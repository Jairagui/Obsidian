import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import passport from "passport";
import "./config/passport";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(passport.initialize());

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("Mongo conectado"))
    .catch(err => console.log(err));

app.listen(3000, () => console.log("Servidor listo"));