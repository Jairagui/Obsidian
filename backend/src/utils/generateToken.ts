import jwt from "jsonwebtoken";

export const generateToken = (user: any) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "8h" }
    );
};
