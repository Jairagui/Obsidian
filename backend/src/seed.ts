import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User";

const crearAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Conectado a Mongo");

        const existe = await User.findOne({ email: "admin@obsidian.com" });
        if (existe) {
            console.log("El admin ya existe");
            process.exit(0);
        }

        const hash = await bcrypt.hash("admin123", 10);

        await User.create({
            name: "Admin",
            email: "admin@obsidian.com",
            password: hash,
            role: "admin"
        });

        console.log("Admin creado -> admin@obsidian.com / admin123");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

crearAdmin();
