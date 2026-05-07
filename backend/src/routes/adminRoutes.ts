import { Router, Response } from "express";
import User from "../models/User";
import Articulo from "../models/Articulo-backend";
import { verifyToken, esAdmin, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// GET - traer todos los usuarios con conteo de articulos
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

// GET - resumen general de la plataforma
router.get("/resumen", verifyToken, esAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const totalUsuarios = await User.countDocuments();
        const totalArticulos = await Articulo.countDocuments();

        // sumar el valor de todos los articulos
        const resultado = await Articulo.aggregate([
            { $group: { _id: null, valorTotal: { $sum: "$precio" } } }
        ]);

        const valorTotal = resultado.length > 0 ? resultado[0].valorTotal : 0;

        res.json({ totalUsuarios, totalArticulos, valorTotal });
    } catch (error) {
        res.status(500).json({ msg: "Error al cargar resumen" });
    }
});

// DELETE - borrar usuario y sus articulos
router.delete("/usuarios/:id", verifyToken, esAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const usuario = await User.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        if (usuario._id.toString() === req.user.id) {
            return res.status(400).json({ msg: "No puedes borrar tu propia cuenta" });
        }

        await Articulo.deleteMany({ id_usuario: usuario._id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: "Usuario y sus articulos eliminados" });
    } catch (error) {
        res.status(500).json({ msg: "Error al borrar usuario" });
    }
});

export default router;
