import jwt from "jsonwebtoken";

// genera un token con los datos del usuario, dura 8 horas
export const generateToken = (user: any) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "8h" }
    );
};
