import { Router, Response } from "express";
import Articulo from "../models/Articulo";
import { verifyToken, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// GET - traer articulos del usuario
router.get("/", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const articulos = await Articulo.find({ id_usuario: req.user.id });
        res.json(articulos);
    } catch (error) {
        res.status(500).json({ msg: "Error al cargar articulos" });
    }
});

// POST - agregar articulo
router.post("/", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { nombre, marca, categoria, anio, condicion, precio } = req.body;

        const nuevo = await Articulo.create({
            id_usuario: req.user.id,
            nombre,
            marca,
            categoria,
            anio: anio || new Date().getFullYear(),
            condicion: condicion || "Nuevo",
            precio
        });

        // emitir por socket
        const io = req.app.get("io");
        io.to(req.user.id).emit("articulo_agregado", nuevo);

        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ msg: "Error al guardar" });
    }
});

// DELETE - borrar articulo
router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const articulo = await Articulo.findById(req.params.id);

        if (!articulo) {
            return res.status(404).json({ msg: "No encontrado" });
        }

        // checar que sea del usuario
        if (articulo.id_usuario.toString() !== req.user.id) {
            return res.status(403).json({ msg: "No puedes borrar articulos de otro" });
        }

        await Articulo.findByIdAndDelete(req.params.id);

        const io = req.app.get("io");
        io.to(req.user.id).emit("articulo_borrado", req.params.id);

        res.json({ msg: "Articulo eliminado" });
    } catch (error) {
        res.status(500).json({ msg: "Error al borrar" });
    }
});

export default router;
