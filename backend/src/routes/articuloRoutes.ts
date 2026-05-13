import { Router, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Articulo from "../models/Articulo-backend";
import { verifyToken, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// configuracion de cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// storage en cloudinary en vez de disco
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "obsidian",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    } as any
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// borrar foto de cloudinary
const borrarFoto = async (url: string) => {
    if (!url || url === "") return;
    try {
        // sacar el public_id de la url de cloudinary
        const partes = url.split("/");
        const archivo = partes[partes.length - 1];
        const publicId = "obsidian/" + archivo.split(".")[0];
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.log("no se pudo borrar la foto de cloudinary:", err);
    }
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

        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ msg: "El nombre es obligatorio" });
        }
        if (!marca || marca.trim() === "") {
            return res.status(400).json({ msg: "La marca es obligatoria" });
        }
        if (!precio || Number(precio) <= 0) {
            return res.status(400).json({ msg: "El precio tiene que ser mayor a 0" });
        }

        // ahora la imagen es la URL de cloudinary
        let imagenUrl = "";
        if (req.file) {
            imagenUrl = req.file.path;
        }

        const nuevo = await Articulo.create({
            id_usuario: req.user.id,
            nombre: nombre.trim(),
            marca: marca.trim(),
            categoria,
            anio: anio || new Date().getFullYear(),
            condicion: condicion || "Nuevo",
            precio: Number(precio),
            imagen: imagenUrl
        });

        const io = req.app.get("io");
        io.to(req.user.id).emit("articulo_agregado", nuevo);

        res.status(201).json(nuevo);
    } catch (error) {
        console.log("no se pudo guardar el articulo", error);
        res.status(500).json({ msg: "Error al guardar" });
    }
});

// borrar todos los articulos del usuario y las fotos tambien
router.delete("/vaciar", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const articulos = await Articulo.find({ id_usuario: req.user.id });
        for (const art of articulos) {
            await borrarFoto(art.imagen);
        }

        await Articulo.deleteMany({ id_usuario: req.user.id });
        res.json({ msg: "se vacio la boveda" });
    } catch (error) {
        res.status(500).json({ msg: "Error al vaciar" });
    }
});

// editar un articulo
router.put("/:id", verifyToken, upload.single("imagen"), async (req: AuthRequest, res: Response) => {
    try {
        const articulo = await Articulo.findById(req.params.id);
        if (!articulo) {
            return res.status(404).json({ msg: "no se encontro" });
        }
        if (articulo.id_usuario.toString() !== req.user.id) {
            return res.status(403).json({ msg: "ese articulo no es tuyo" });
        }

        // si subio foto nueva quitamos la vieja de cloudinary
        if (req.file) {
            await borrarFoto(articulo.imagen);
            req.body.imagen = req.file.path;
        }

        const actualizado = await Articulo.findByIdAndUpdate(req.params.id, req.body, { new: true });

        const io = req.app.get("io");
        io.to(req.user.id).emit("articulo_actualizado", actualizado);

        res.json(actualizado);
    } catch (error) {
        console.log("error editando", error);
        res.status(500).json({ msg: "Error al editar" });
    }
});

// borrar un solo articulo y su foto
router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const articulo = await Articulo.findById(req.params.id);
        if (!articulo) {
            return res.status(404).json({ msg: "no existe ese articulo" });
        }
        if (articulo.id_usuario.toString() !== req.user.id) {
            return res.status(403).json({ msg: "no es tuyo ese" });
        }

        await borrarFoto(articulo.imagen);
        await Articulo.findByIdAndDelete(req.params.id);

        const io = req.app.get("io");
        io.to(req.user.id).emit("articulo_borrado", req.params.id);

        res.json({ msg: "Eliminado" });
    } catch (error) {
        res.status(500).json({ msg: "Error al borrar" });
    }
});

export default router;