import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";

// REGISTER
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // checamos que no mande campos vacios
        if (!name || name.trim() === "") {
            return res.status(400).json({ msg: "El nombre es obligatorio" });
        }
        if (!email || email.trim() === "") {
            return res.status(400).json({ msg: "El correo es obligatorio" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ msg: "La contraseña debe tener al menos 6 caracteres" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = generateToken(user);

        res.status(201).json({
            msg: "Usuario registrado",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ msg: "Error en registro" });
    }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Credenciales incorrectas" });
        }

        // si se registro con google no tiene password
        if (!user.password) {
            return res.status(400).json({ msg: "Esta cuenta usa Google para iniciar sesion" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Credenciales incorrectas" });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ msg: "Error en login" });
    }
};

// GET ME
export const getMe = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: "Error obteniendo usuario" });
    }
};

// LOGOUT
export const logout = (req: Request, res: Response) => {
    res.json({ msg: "Logout exitoso" });
};
