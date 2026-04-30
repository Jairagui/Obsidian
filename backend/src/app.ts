import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("Mongo conectado"))
    .catch(err => console.log(err));

app.listen(3000, () => console.log("Servidor listo"));