import mongoose from "mongoose";
import Genre from "../models/Genre.js";
import Platform from "../models/Platform.js";
import Rating from "../models/Rating.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import VideoGame from "../models/VideoGame.js";
import logger from "../config/logger.js";

export const getTopRatedGamesReport = async (req, res) => {
    logger.info("Inicio reporte videojuegos mejor calificados");

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const filter = {
            is_active: true,
            rating_count: { $gt: 0 }
        };

        const [games, total] = await Promise.all([

            VideoGame.find(filter)
                .select("_id title image_url rating_average rating_count")
                .sort({
                    rating_average: -1,
                    rating_count: -1
                })
                .skip(skip)
                .limit(limit),

            VideoGame.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);

        logger.info(`Top calificados obtenidos: ${games.length}`);

        return res.status(200).json({
            success: true,
            page,
            totalPages,
            totalGames: total,
            games
        });

    } catch (error) {

        logger.error("Error en reporte top calificados", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor" });

    } finally {
        logger.info("Fin reporte videojuegos mejor calificados");
    }
};

export const getMostReviewedGamesReport = async (req, res) => {

    logger.info("Inicio reporte interacción videojuegos");

    try {

        const [reviews, ratings] = await Promise.all([

            Review.aggregate([
                {
                    $match: {
                        is_active: true
                    }
                },
                {
                    $group: {
                        _id: "$video_game_id",
                        total_reviews: { $sum: 1 }
                    }
                }
            ]),

            Rating.aggregate([
                {
                    $match: {
                        is_active: true
                    }
                },
                {
                    $group: {
                        _id: "$video_game_id",
                        total_ratings: { $sum: 1 }
                    }
                }
            ])
        ]);

        const map = new Map();

        for (const r of reviews) {
            map.set(r._id.toString(), {
                video_game_id: r._id,
                total_reviews: r.total_reviews,
                total_ratings: 0
            });
        }

        for (const r of ratings) {

            const id = r._id.toString();

            if (!map.has(id)) {
                map.set(id, {
                    video_game_id: r._id,
                    total_reviews: 0,
                    total_ratings: r.total_ratings
                });
            } else {
                map.get(id).total_ratings = r.total_ratings;
            }
        }

        let result = Array.from(map.values());

        result = await Promise.all(
            result.map(async (item) => {

                const game = await VideoGame.findById(item.video_game_id)
                    .select("_id title image_url is_active");

                if (!game || !game.is_active) return null;

                return {
                    game: {
                        _id: game._id,
                        title: game.title,
                        image_url: game.image_url
                    },

                    total_reviews: item.total_reviews,
                    total_ratings: item.total_ratings,
                    total_interactions:
                        item.total_reviews + item.total_ratings
                };
            })
        );

        result = result.filter(Boolean);

        result.sort((a, b) => b.total_interactions - a.total_interactions);

        return res.status(200).json({
            success: true,
            games: result
        });

    } catch (error) {

        logger.error("Error reporte interacción", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor" });

    } finally {
        logger.info("Fin reporte interacción videojuegos");
    }

};

export const getUserActivityReport = async (req, res) => {
    logger.info("Inicio de reporte de actividad de usuarios");

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const users = await User.find({ is_active: true, role: "USER" })
            .select("_id name email image_url")
            .sort({ created_at: -1 });

        const usersActivity = await Promise.all(

            users.map(async (user) => {

                const [totalReviews, totalRatings] =
                    await Promise.all([

                        Review.countDocuments({
                            user_id: user._id,
                            is_active: true
                        }),

                        Rating.countDocuments({
                            user_id: user._id,
                            is_active: true
                        })
                    ]);

                return {

                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        image_url: user.image_url
                    },

                    total_reviews: totalReviews,

                    total_ratings: totalRatings,

                    total_activity:
                        totalReviews + totalRatings
                };
            })
        );

        usersActivity.sort((a, b) => b.total_activity - a.total_activity);

        const total = usersActivity.length;

        const paginatedActivity =
            usersActivity.slice(
                skip,
                skip + limit
            );

        const totalPages = Math.ceil(total / limit);

        logger.info(`Reporte generado: ${paginatedActivity.length} usuarios`);

        return res.status(200).json({
            success: true,
            page,
            totalPages,
            totalUsers: total,
            users: paginatedActivity
        });

    } catch (error) {

        logger.error("Error al generar reporte de actividad", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });

    } finally {

        logger.info("Fin de reporte de actividad de usuarios");
    }
};

export const getGamesDistributionReport = async (req, res) => {
    logger.info("Inicio de reporte de distribución de videojuegos");

    try {

        const [genresDistribution, platformsDistribution] =
            await Promise.all([

                VideoGame.aggregate([
                    {
                        $match: {
                            is_active: true
                        }
                    },

                    {
                        $group: {
                            _id: "$genre_id",
                            total_games: {
                                $sum: 1
                            }
                        }
                    },

                    {
                        $lookup: {
                            from: "genres",
                            localField: "_id",
                            foreignField: "_id",
                            as: "genre"
                        }
                    },

                    {
                        $unwind: "$genre"
                    },

                    {
                        $match: {
                            "genre.is_active": true
                        }
                    },

                    {
                        $project: {
                            _id: 0,

                            genre: {
                                _id: "$genre._id",
                                name: "$genre.name"
                            },

                            total_games: 1
                        }
                    },

                    {
                        $sort: {
                            total_games: -1
                        }
                    }
                ]),

                VideoGame.aggregate([
                    {
                        $match: {
                            is_active: true
                        }
                    },

                    {
                        $group: {
                            _id: "$platform_id",
                            total_games: {
                                $sum: 1
                            }
                        }
                    },

                    {
                        $lookup: {
                            from: "platforms",
                            localField: "_id",
                            foreignField: "_id",
                            as: "platform"
                        }
                    },

                    {
                        $unwind: "$platform"
                    },

                    {
                        $match: {
                            "platform.is_active": true
                        }
                    },

                    {
                        $project: {
                            _id: 0,

                            platform: {
                                _id: "$platform._id",
                                name: "$platform.name"
                            },

                            total_games: 1
                        }
                    },

                    {
                        $sort: {
                            total_games: -1
                        }
                    }
                ])
            ]);

        logger.info("Reporte de distribución generado correctamente");

        return res.status(200).json({
            success: true,
            genres_distribution: genresDistribution,
            platforms_distribution: platformsDistribution
        });

    } catch (error) {

        logger.error("Error al generar reporte de distribución", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });

    } finally {

        logger.info("Fin de reporte de distribución de videojuegos");
    }
};