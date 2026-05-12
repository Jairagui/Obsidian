import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Articulo from "../models/Articulo-backend";
import { verifyToken, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// configuracion de multer para que guarde las fotos con extension
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // le ponemos un nombre unico para que no se repita
        const unico = Date.now() + "-" + Math.round(Math.random() * 1000);
        const ext = path.extname(file.originalname);
        cb(null, unico + ext);
    }
});

// nomas dejamos pasar imagenes
const filtroArchivo = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imagenes (jpg, png, gif, webp)"));
    }
};

const upload = multer({
    storage,
    fileFilter: filtroArchivo,
    limits: { fileSize: 5 * 1024 * 1024 } // maximo 5MB
});

// para borrar la foto del disco cuando ya no se ocupa
const borrarFoto = (nombreFoto: string) => {
    if (!nombreFoto || nombreFoto === "") return;
    const ruta = path.join(__dirname, "../../uploads", nombreFoto);
    fs.unlink(ruta, (err) => {
        if (err && err.code !== "ENOENT") {
            console.log("no se pudo borrar la foto:", nombreFoto);
        }
    });
};

// GET - traer articulos del usuario
router.get("/", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const articulos = await Articulo.find({ id_usuario: req.user.id });
        res.json(articulos);
    } catch (error) {
        console.log("error al traer los articulos", error);
        res.status(500).json({ msg: "Error al cargar articulos" });
    }
});

// POST - agregar articulo con foto
router.post("/", verifyToken, upload.single("imagen"), async (req: AuthRequest, res: Response) => {
    try {
        const { nombre, marca, categoria, anio, condicion, precio } = req.body;

        // validamos que no esten vacios
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ msg: "El nombre es obligatorio" });
        }
        if (!marca || marca.trim() === "") {
            return res.status(400).json({ msg: "La marca es obligatoria" });
        }
        if (!precio || Number(precio) <= 0) {
            return res.status(400).json({ msg: "El precio tiene que ser mayor a 0" });
        }

        // checamos si subio una foto o no
        let nombreFoto = "";
        if(req.file){
            nombreFoto = req.file.filename;
        }

        const nuevo = await Articulo.create({
            id_usuario: req.user.id,
            nombre: nombre.trim(),
            marca: marca.trim(),
            categoria,
            anio: anio || new Date().getFullYear(),
            condicion: condicion || "Nuevo",
            precio: Number(precio),
            imagen: nombreFoto
        });

        // mandamos el evento por socket
        const io = req.app.get("io");
        io.to(req.user.id).emit("articulo_agregado", nuevo);

        res.status(201).json(nuevo);
    } catch (error) {
        console.log("no se pudo guardar el articulo", error)
        res.status(500).json({ msg: "Error al guardar" });
    }
});

// borrar todos los articulos del usuario y las fotos tambien
router.delete("/vaciar", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        // borramos las fotos antes de borrar los articulos
        const articulos = await Articulo.find({ id_usuario: req.user.id });
        articulos.forEach(art => borrarFoto(art.imagen));

        await Articulo.deleteMany({ id_usuario: req.user.id });
        res.json({ msg: "se vacio la boveda" });
    } catch (error) {
        res.status(500).json({ msg: "Error al vaciar" });
    }
});

// editar un articulo ahora tambien puede cambiar la foto
router.put("/:id", verifyToken, upload.single("imagen"), async (req: AuthRequest, res: Response) => {
    try {
        const articulo = await Articulo.findById(req.params.id);
        if (!articulo) {
            return res.status(404).json({ msg: "no se encontro" });
        }
        // que no pueda editar cosas de otro usuario
        if (articulo.id_usuario.toString() !== req.user.id) {
            return res.status(403).json({ msg: "ese articulo no es tuyo" });
        }

        // si subio foto nueva quitamos la vieja
        if (req.file) {
            borrarFoto(articulo.imagen);
            req.body.imagen = req.file.filename;
        }

        const actualizado = await Articulo.findByIdAndUpdate(req.params.id, req.body, { new: true });

        const io = req.app.get("io");
        io.to(req.user.id).emit("articulo_actualizado", actualizado);

        res.json(actualizado);
    } catch (error) {
        console.log("error editando", error)
        res.status(500).json({ msg: "Error al editar" });
    }
});

// borrar un solo articulo y su foto
router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const articulo = await Articulo.findById(req.params.id);
        if (!articulo) {
            return res.status(404).json({ msg: "no existe ese articulo" })
        }
        if (articulo.id_usuario.toString() !== req.user.id){
            return res.status(403).json({ msg: "no es tuyo ese" })
        }

        // quitamos la foto
        borrarFoto(articulo.imagen);

        await Articulo.findByIdAndDelete(req.params.id);

        const io = req.app.get("io");
        io.to(req.user.id).emit("articulo_borrado", req.params.id);

        res.json({ msg: "Eliminado" });
    } catch (error) {
        res.status(500).json({ msg: "Error al borrar" });
    }
});

export default router;
