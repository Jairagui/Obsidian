import { Router, Response } from "express";
import User from "../models/User";
import Articulo from "../models/Articulo";
import { verifyToken, esAdmin, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.get("/usuarios", verifyToken, esAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const usuarios = await User.find().select("-password");

        const resultado = await Promise.all(
            usuarios.map(async (user) => {
                const totalArticulos = await Articulo.countDocuments({ id_usuario: user._id });
                return {
                    ...user.toObject(),
                    totalArticulos
                };
            })
        );

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ msg: "Error al cargar usuarios" });
    }
});

// DELETE - borrar usuario y sus articulos
router.delete("/usuarios/:id", verifyToken, esAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const usuario = await User.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // no dejar que se borre a si mismo
        if (usuario._id.toString() === req.user.id) {
            return res.status(400).json({ msg: "No puedes borrar tu propia cuenta" });
        }

        // borrar sus articulos tambien
        await Articulo.deleteMany({ id_usuario: usuario._id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: "Usuario y sus articulos eliminados" });
    } catch (error) {
        res.status(500).json({ msg: "Error al borrar usuario" });
    }
});

export default router;