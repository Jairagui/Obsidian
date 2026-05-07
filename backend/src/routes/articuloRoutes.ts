import { Router, Response } from "express";
import multer from "multer";
import Articulo from "../models/Articulo-backend";
import { verifyToken, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// multer para subir imagenes a la carpeta uploads
const upload = multer({ dest: "uploads/" });

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

        // checamos si subio una foto o no
        let nombreFoto = "";
        if(req.file){
            nombreFoto = req.file.filename;
        }

        const nuevo = await Articulo.create({
            id_usuario: req.user.id,
            nombre, marca, categoria,
            anio: anio || new Date().getFullYear(),
            condicion: condicion || "Nuevo",
            precio,
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

// borrar todos los articulos del usuario
router.delete("/vaciar", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        await Articulo.deleteMany({ id_usuario: req.user.id });
        res.json({ msg: "se vacio la boveda" });
    } catch (error) {
        res.status(500).json({ msg: "Error al vaciar" });
    }
});

// editar un articulo (ahora tambien puede cambiar la foto)
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

        // si subio foto nueva la actualizamos
        if (req.file) {
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

// borrar un solo articulo
router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const articulo = await Articulo.findById(req.params.id);
        if (!articulo) {
            return res.status(404).json({ msg: "no existe ese articulo" })
        }
        if (articulo.id_usuario.toString() !== req.user.id){
            return res.status(403).json({ msg: "no es tuyo ese" })
        }

        await Articulo.findByIdAndDelete(req.params.id);

        const io = req.app.get("io");
        io.to(req.user.id).emit("articulo_borrado", req.params.id);

        res.json({ msg: "Eliminado" });
    } catch (error) {
        res.status(500).json({ msg: "Error al borrar" });
    }
});

export default router;
