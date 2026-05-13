import mongoose, { Schema, Document } from "mongoose";

// modelo del usuario, el password es opcional porque los de google no tienen
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    role: string;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, default: null },
    role: { type: String, default: "user" }
});

export default mongoose.model<IUser>("User", UserSchema);