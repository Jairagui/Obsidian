import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import passport from "passport";
import "./config/passport";
import authRoutes from "./routes/authRoutes";
import articuloRoutes from "./routes/articuloRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
const server = http.createServer(app);

// socket.io para tiempo real
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// lo guardamos para usarlo en las rutas
app.set("io", io);

// middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// rutas
app.use("/api/auth", authRoutes);
app.use("/api/articulos", articuloRoutes);
app.use("/api/admin", adminRoutes);

// ruta de prueba
app.get("/", (req, res) => {
    res.json({ msg: "API de Obsidian funcionando" });
});

// socket.io
io.on("connection", (socket) => {
    console.log("Socket conectado:", socket.id);

    socket.on("unirse_sala", (userId: string) => {
        socket.join(userId);
        console.log(`Usuario ${userId} en su sala`);
    });

    socket.on("disconnect", () => {
        console.log("Socket desconectado:", socket.id);
    });
});

// conectar mongo y arrancar
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("Mongo conectado");
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
    })
    .catch(err => console.log("Error mongo:", err));
