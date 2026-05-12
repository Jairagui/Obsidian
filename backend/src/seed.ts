import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User";

const crearAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Conectado a Mongo");

        // sacamos los datos del .env o usamos los de siempre
        const adminEmail = process.env.ADMIN_EMAIL || "admin@obsidian.com";
        const adminPass = process.env.ADMIN_PASSWORD || "admin123";
        const adminName = process.env.ADMIN_NAME || "Admin";

        const existe = await User.findOne({ email: adminEmail });
        if (existe) {
            console.log("El admin ya existe con email:", adminEmail);
            process.exit(0);
        }

        const hash = await bcrypt.hash(adminPass, 10);

        await User.create({
            name: adminName,
            email: adminEmail,
            password: hash,
            role: "admin"
        });

        console.log("Admin creado -> " + adminEmail);
        console.log("(la contraseña es la que pusiste en ADMIN_PASSWORD o admin123 por defecto)");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

crearAdmin();