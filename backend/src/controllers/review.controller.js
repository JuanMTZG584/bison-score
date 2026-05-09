import mongoose from "mongoose";
import Review from "../models/Review.js";
import VideoGame from "../models/VideoGame.js";
import User from "../models/User.js";
import Rating from "../models/Rating.js"
import logger from "../config/logger.js";

export const getGameReviews = async (req, res) => {
    logger.info("Inicio de obtención de reseñas/calificaciones del videojuego");

    const { id } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn("ID de videojuego inválido");

            return res.status(400).json({ message: "ID de videojuego no válido." });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const videoGame = await VideoGame.findById(id);

        if (!videoGame) {
            logger.warn("Videojuego no encontrado");

            return res.status(404).json({ message: "Videojuego no encontrado." });
        }

        if (!videoGame.is_active) {
            logger.warn(`Intento de obtener feedback de videojuego inactivo: ${videoGame.title}`);

            return res.status(400).json({ message: "El videojuego está inactivo." });
        }

        const [reviews, ratings] = await Promise.all([
            Review.find({
                video_game_id: id,
                is_active: true
            })
                .populate("user_id", "_id name image_url is_active")
                .sort({ created_at: -1 }),

            Rating.find({
                video_game_id: id,
                is_active: true
            })
        ]);

        const feedbackMap = new Map();

        for (const review of reviews) {

            if (!review.user_id || !review.user_id.is_active) {
                continue;
            }

            const userId = review.user_id._id.toString();

            feedbackMap.set(userId, {
                user: {
                    _id: review.user_id._id,
                    name: review.user_id.name,
                    image_url: review.user_id.image_url
                },

                review: {
                    _id: review._id,
                    comment: review.comment,
                    created_at: review.created_at,
                    updated_at: review.updated_at
                },

                rating: null
            });
        }

        const userIdsWithoutReview = ratings
            .filter((rating) => {
                return !feedbackMap.has(
                    rating.user_id.toString()
                );
            })
            .map((rating) => rating.user_id);

        const users = await User.find({
            _id: { $in: userIdsWithoutReview },
            is_active: true
        }).select("_id name image_url");

        const usersMap = new Map();

        for (const user of users) {
            usersMap.set(
                user._id.toString(),
                user
            );
        }

        for (const rating of ratings) {

            const userId = rating.user_id.toString();

            const existingFeedback =
                feedbackMap.get(userId);

            if (existingFeedback) {

                existingFeedback.rating = {
                    _id: rating._id,
                    score: rating.score,
                    created_at: rating.created_at,
                    updated_at: rating.updated_at
                };

            } else {

                const user = usersMap.get(userId);

                if (!user) {
                    continue;
                }

                feedbackMap.set(userId, {
                    user: {
                        _id: user._id,
                        name: user.name,
                        image_url: user.image_url
                    },

                    review: null,

                    rating: {
                        _id: rating._id,
                        score: rating.score,
                        created_at: rating.created_at,
                        updated_at: rating.updated_at
                    }
                });
            }
        }

        const feedbackArray = Array.from(
            feedbackMap.values()
        );

        const total = feedbackArray.length;

        const paginatedFeedback =
            feedbackArray.slice(
                skip,
                skip + limit
            );

        const totalPages = Math.ceil(
            total / limit
        );

        logger.info(`Feedback obtenido: ${paginatedFeedback.length}`);

        return res.status(200).json({
            success: true,
            page,
            totalPages,
            totalFeedback: total,
            feedback: paginatedFeedback
        });

    } catch (error) {

        logger.error("Error al obtener feedback del videojuego", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });

    } finally {

        logger.info("Fin de obtención de reseñas/calificaciones del videojuego");
    }
};

export const getUserReviews = async (req, res) => {
    logger.info("Inicio de obtención de feedback del usuario");

    const user_id = req.user._id;

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const [reviews, ratings] = await Promise.all([

            Review.find({
                user_id,
                is_active: true
            })
                .populate({
                    path: "video_game_id",
                    match: { is_active: true },
                    select: "_id title image_url"
                })
                .sort({ created_at: -1 }),

            Rating.find({
                user_id,
                is_active: true
            })
                .populate({
                    path: "video_game_id",
                    match: { is_active: true },
                    select: "_id title image_url"
                })
        ]);

        const feedbackMap = new Map();

        for (const review of reviews) {

            if (!review.video_game_id) {
                continue;
            }

            const videoGameId =
                review.video_game_id._id.toString();

            feedbackMap.set(videoGameId, {

                video_game: {
                    _id: review.video_game_id._id,
                    title: review.video_game_id.title,
                    image_url: review.video_game_id.image_url
                },

                review: {
                    _id: review._id,
                    comment: review.comment,
                    created_at: review.created_at,
                    updated_at: review.updated_at
                },

                rating: null
            });
        }

        for (const rating of ratings) {

            if (!rating.video_game_id) {
                continue;
            }

            const videoGameId =
                rating.video_game_id._id.toString();

            const existingFeedback =
                feedbackMap.get(videoGameId);

            if (existingFeedback) {

                existingFeedback.rating = {
                    _id: rating._id,
                    score: rating.score,
                    created_at: rating.created_at,
                    updated_at: rating.updated_at
                };

            } else {

                feedbackMap.set(videoGameId, {

                    video_game: {
                        _id: rating.video_game_id._id,
                        title: rating.video_game_id.title,
                        image_url: rating.video_game_id.image_url
                    },

                    review: null,

                    rating: {
                        _id: rating._id,
                        score: rating.score,
                        created_at: rating.created_at,
                        updated_at: rating.updated_at
                    }
                });
            }
        }

        const feedbackArray = Array.from(
            feedbackMap.values()
        );

        feedbackArray.sort((a, b) => {

            const dateA =
                a.review?.created_at ||
                a.rating?.created_at;

            const dateB =
                b.review?.created_at ||
                b.rating?.created_at;

            return new Date(dateB) - new Date(dateA);
        });

        const total = feedbackArray.length;

        const paginatedFeedback =
            feedbackArray.slice(
                skip,
                skip + limit
            );

        const totalPages = Math.ceil(
            total / limit
        );

        logger.info(`Feedback obtenido: ${paginatedFeedback.length}`);

        return res.status(200).json({
            success: true,
            page,
            totalPages,
            totalFeedback: total,
            feedback: paginatedFeedback
        });

    } catch (error) {

        logger.error("Error al obtener feedback del usuario", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });

    } finally {

        logger.info("Fin de obtención de feedback del usuario");
    }
};

export const createReview = async (req, res) => {
    logger.info("Inicio de creación de reseña");

    const user_id = req.user._id;

    const { video_game_id, comment } = req.body;

    if (!video_game_id || !comment) {
        logger.warn("Campos incompletos en reseña");

        return res.status(400).json({ message: "Debes completar todos los campos." });
    }

    if (!mongoose.Types.ObjectId.isValid(video_game_id)) {
        logger.warn("ID de videojuego inválido");

        return res.status(400).json({ message: "ID de videojuego no válido." });
    }

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
        logger.warn("Comentario inválido");

        return res.status(400).json({ message: "Comentario no válido." });
    }

    try {
        const videoGame = await VideoGame.findById(video_game_id);

        if (!videoGame) {
            logger.warn("Videojuego no encontrado");

            return res.status(404).json({ message: "Videojuego no encontrado." });
        }

        if (!videoGame.is_active) {
            logger.warn(`Intento de reseñar videojuego inactivo: ${videoGame.title}`);

            return res.status(400).json({ message: "No puedes reseñar un videojuego inactivo." });
        }

        const existingReview = await Review.findOne({
            user_id,
            video_game_id
        });

        if (existingReview) {

            existingReview.comment = trimmedComment;
            existingReview.is_active = true;

            await existingReview.save();

            logger.info(`Reseña reactivada/actualizada: ${videoGame.title}`);

            return res.status(200).json({
                success: true,
                review: existingReview
            });
        }

        const savedReview = await Review.create({
            user_id,
            video_game_id,
            comment: trimmedComment
        });

        logger.info(`Reseña creada: ${videoGame.title}`);

        return res.status(201).json({
            success: true,
            review: savedReview
        });

    } catch (error) {
        logger.error("Error en creación de reseña", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de creación de reseña");
    }
};

export const updateReview = async (req, res) => {
    logger.info("Inicio de actualización de reseña");

    const user_id = req.user._id;

    const { id } = req.params;

    const { comment } = req.body;

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn("ID de reseña inválido");

            return res.status(400).json({ message: "ID de reseña no válido." });
        }

        const review = await Review.findById(id);

        if (!review) {
            logger.warn("Reseña no encontrada");

            return res.status(404).json({ message: "Reseña no encontrada." });
        }

        if (!review.is_active) {
            logger.warn("Intento de actualizar reseña inactiva");

            return res.status(400).json({ message: "No puedes actualizar una reseña inactiva." });
        }

        if (review.user_id.toString() !== user_id.toString()) {
            logger.warn("Intento de actualizar reseña ajena");

            return res.status(403).json({ message: "No tienes permisos para actualizar esta reseña." });
        }

        const updateData = {};

        if (typeof comment === "string") {

            const trimmedComment = comment.trim();

            if (!trimmedComment) {
                logger.warn("Comentario inválido");

                return res.status(400).json({
                    message: "Comentario no válido."
                });
            }

            updateData.comment = trimmedComment;
        }

        if (Object.keys(updateData).length === 0) {
            logger.warn("No hay datos para actualizar");

            return res.status(400).json({
                message: "No hay datos para actualizar."
            });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            {
                $set: updateData
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        )
            .populate("user_id", "_id name image_url")
            .populate("video_game_id", "_id title image_url");

        logger.info(`Reseña actualizada: ${updatedReview._id}`);

        return res.status(200).json({
            success: true,
            review: updatedReview
        });

    } catch (error) {
        logger.error("Error en actualización de reseña", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de actualización de reseña");
    }
};

export const deleteReview = async (req, res) => {
    logger.info("Inicio de eliminación de reseña");

    const { id } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn("ID de reseña inválido");

            return res.status(400).json({ message: "ID de reseña no válido." });
        }

        const review = await Review.findById(id);

        if (!review) {
            logger.warn("Reseña no encontrada");

            return res.status(404).json({ message: "Reseña no encontrada." });
        }

        if (review.user_id.toString() !== req.user._id.toString() && req.user.role !== "ADMIN"
        ) {
            logger.warn("Intento de eliminar reseña sin permisos");

            return res.status(403).json({ message: "No tienes permisos para eliminar esta reseña." });
        }

        if (!review.is_active) {
            logger.warn("Reseña ya eliminada");

            return res.status(400).json({ message: "La reseña ya está eliminada." });
        }

        review.is_active = false;

        await review.save();

        logger.info(`Reseña eliminada: ${review._id}`);

        return res.status(200).json({
            success: true,
            message: "Reseña eliminada correctamente."
        });

    } catch (error) {
        logger.error("Error al eliminar reseña", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de eliminación de reseña");
    }
};