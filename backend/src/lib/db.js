import mongoose from "mongoose"
import { env } from "../config/env.js";

export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(env.MONGO_URI);
        console.log("¡Conectado a MongoDB!", conn.connection.host);
    } catch (error) {
        console.error("Error de conexión a MongoDB:",error);
        process.exit(1);
    }
}