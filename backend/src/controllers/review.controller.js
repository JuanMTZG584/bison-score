import Review from "../models/Review.js";
import logger from "../config/logger.js";

export const getGameReviews = async (req, res) => {
    return res.status(200).json("Reseñas de un juego.");
};

export const getUserReviews = async (req, res) => {
    return res.status(200).json("Reseñas de un usuario.");
};

export const createReview = async (req, res) => {
    return res.status(200).json("Creación de reseña.");
};

export const updateReview = async (req, res) => {
    return res.status(200).json("Actualización de reseña");
};

export const deleteReview = async (req, res) => {
    return res.status(200).json("Eliminación de reseña");
};