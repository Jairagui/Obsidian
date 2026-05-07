import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import passport from "passport";
import "./config/passport";
import authRoutes from "./routes/authRoutes";
import articuloRoutes from "./routes/articuloRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.set("io", io);

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// para que se puedan acceder las fotos que sube el usuario
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// rutas de la api
app.use("/api/auth", authRoutes);
app.use("/api/articulos", articuloRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({ msg: "API de Obsidian funcionando" });
});

// sockets
io.on("connection", (socket) => {
    console.log("usuario conectado al socket:", socket.id);
    socket.on("unirse_sala", (userId: string) => {
        socket.join(userId);
        console.log("usuario " + userId + " entro a su sala")
    });
    socket.on("disconnect", () => {
        console.log("se desconecto:", socket.id);
    });
});

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("Mongo conectado");
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => console.log("Servidor corriendo en puerto " + PORT));
    })
    .catch(err => console.log("no se pudo conectar a mongo:", err));
