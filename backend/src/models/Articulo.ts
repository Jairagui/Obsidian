import mongoose, { Schema, Document } from "mongoose";

export interface IArticulo extends Document {
    id_usuario: mongoose.Types.ObjectId;
    nombre: string;
    marca: string;
    categoria: string;
    anio: number;
    condicion: string;
    precio: number;
}

const ArticuloSchema: Schema = new Schema({
    id_usuario: { type: Schema.Types.ObjectId, ref: "User", required: true },
    nombre: { type: String, required: true },
    marca: { type: String, required: true },
    categoria: { type: String, required: true },
    anio: { type: Number, default: new Date().getFullYear() },
    condicion: { type: String, default: "Nuevo" },
    precio: { type: Number, required: true }
});

export default mongoose.model<IArticulo>("Articulo", ArticuloSchema);
