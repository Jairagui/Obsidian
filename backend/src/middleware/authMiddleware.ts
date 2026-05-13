import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// le agregamos user al Request para poder acceder al usuario en las rutas
export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: "No token proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token inválido" });
    }
};

// middleware para checar si es admin
export const esAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ msg: "Acceso solo para admin" });
    }
    next();
};
