import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import logger from "../config/logger.js";

export const protectRoute = async (req, res, next) => {
    logger.info("Inicio de verificación de autenticación");
    try {
        const token = req.cookies.jwt;
        if (!token) {
            logger.warn("Token no proporcionado");
            return res.status(401).json({ message: "No autorizado - Token no dado" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, env.JWT_SECRET);
        } catch (err) {
            logger.warn("Token inválido o expirado");
            return res.status(401).json({ message: "No autorizado - Token inválido" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            logger.warn(`Usuario no encontrado para ID: ${decoded.userId}`);
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        req.user = user;

        logger.info(`Usuario autenticado: ${user.email}`);

        next();
    } catch (error) {
        logger.error("Error en middleware protectRoute", { message: error.message, });

        res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        logger.info("Fin de verificación de autenticación");
    }
};