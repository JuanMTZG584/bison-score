import Rating from "../models/Rating.js";
import logger from "../config/logger.js";

export const getGameRatings = async (req, res) => {
    return res.status(200).json("Calificaciones de un juego.");
};

export const getUserRatings = async (req, res) => {
    return res.status(200).json("Calificaciones de un usuario.");
};

export const upsertRating = async (req, res) => {
    return res.status(200).json("Upsert de calificación.");
};

export const deleteRating = async (req, res) => {
    return res.status(200).json("Eliminación de calificación.");
};
