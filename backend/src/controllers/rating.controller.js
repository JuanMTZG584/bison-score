import mongoose from "mongoose";
import Rating from "../models/Rating.js";
import VideoGame from "../models/VideoGame.js";
import logger from "../config/logger.js";

export const upsertRating = async (req, res) => {
    logger.info("Inicio de creación/actualización de calificación");

    const user_id = req.user._id;

    const { video_game_id, score } = req.body;

    if (!video_game_id || score === undefined) {
        logger.warn("Campos incompletos en calificación");

        return res.status(400).json({ message: "Debes completar todos los campos." });
    }

    if (!mongoose.Types.ObjectId.isValid(video_game_id)) {
        logger.warn("ID de videojuego inválido");

        return res.status(400).json({ message: "ID de videojuego no válido." });
    }

    const numericScore = Number(score);

    if (isNaN(numericScore)) {
        logger.warn("Puntuación inválida");

        return res.status(400).json({ message: "La puntuación debe ser numérica." });
    }

    if (numericScore < 0 || numericScore > 100) {
        logger.warn("Puntuación fuera de rango");

        return res.status(400).json({ message: "La puntuación debe estar entre 0 y 100." });
    }

    try {
        const videoGame = await VideoGame.findById(video_game_id);

        if (!videoGame) {
            logger.warn("Videojuego no encontrado");

            return res.status(404).json({ message: "Videojuego no encontrado." });
        }

        if (!videoGame.is_active) {
            logger.warn(`Intento de calificar videojuego inactivo: ${videoGame.title}`);

            return res.status(400).json({ message: "No puedes calificar un videojuego inactivo." });
        }

        const rating = await Rating.findOneAndUpdate(
            {
                user_id,
                video_game_id
            },
            {
                score: numericScore,
                is_active: true
            },
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true
            }
        );

        const ratings = await Rating.find({
            video_game_id,
            is_active: true
        });

        const totalScore = ratings.reduce(
            (sum, rating) => sum + rating.score,
            0
        );

        const average =
            ratings.length > 0
                ? totalScore / ratings.length
                : 0;

        videoGame.rating_average = average;
        videoGame.rating_count = ratings.length;

        await videoGame.save();

        logger.info(`Calificación registrada: ${videoGame.title} → ${numericScore}`);

        return res.status(200).json({
            success: true,
            rating
        });

    } catch (error) {
        logger.error("Error en creación/actualización de calificación", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de creación/actualización de calificación");
    }
};

export const deleteRating = async (req, res) => {
    logger.info("Inicio de eliminación de calificación");

    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn("ID de calificación inválido");

            return res.status(400).json({ message: "ID de calificación no válido." });
        }

        const rating = await Rating.findById(id);

        if (!rating) {
            logger.warn("Calificación no encontrada");

            return res.status(404).json({ message: "Calificación no encontrada." });
        }

        if (rating.user_id.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
            logger.warn("Intento de eliminar calificación sin permisos");

            return res.status(403).json({ message: "No tienes permisos para eliminar esta calificación." });
        }

        if (!rating.is_active) {
            logger.warn("Calificación ya eliminada");

            return res.status(400).json({ message: "La calificación ya está eliminada." });
        }

        rating.is_active = false;

        await rating.save();

        const ratings = await Rating.find({
            video_game_id: rating.video_game_id,
            is_active: true
        });

        const totalScore = ratings.reduce(
            (sum, item) => sum + item.score,
            0
        );

        const average =
            ratings.length > 0
                ? totalScore / ratings.length
                : 0;

        await VideoGame.findByIdAndUpdate(
            rating.video_game_id,
            {
                rating_average: average,
                rating_count: ratings.length
            }
        );

        logger.info(`Calificación eliminada: ${rating._id}`);

        return res.status(200).json({
            success: true,
            message: "Calificación eliminada correctamente."
        });

    } catch (error) {
        logger.error("Error al eliminar calificación", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de eliminación de calificación");
    }
};
