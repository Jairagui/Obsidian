import { Request, Response, NextFunction } from "express";

// middleware para atrapar errores que no se manejan en las rutas
// por ejemplo si multer truena porque el archivo es muy grande
export const manejarErrores = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("error atrapado:", err.message);

    // si es error de multer (archivo muy grande o tipo invalido)
    if (err.message && err.message.includes("Solo se permiten imagenes")) {
        return res.status(400).json({ msg: err.message });
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ msg: "El archivo es muy grande, maximo 5MB" });
    }

    // cualquier otro error
    res.status(500).json({ msg: "Algo salio mal en el servidor" });
};
