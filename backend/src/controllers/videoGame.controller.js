import VideoGame from "../models/VideoGame.js";
import Platform from "../models/Platform.js";
import Genre from "../models/Genre.js";
import logger from "../config/logger.js";
import { deleteImage } from "../lib/cloudinary.helper.js";
import mongoose from "mongoose";

export const getAllVideoGames = async (req, res) => {
    logger.info("Inicio de listado de videojuegos");

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const is_active = req.query.is_active;
        const search = req.query.search;

        const platform_id = req.query.platform_id;
        const genre_id = req.query.genre_id;

        const skip = (page - 1) * limit;

        const filter = {};

        if (is_active !== undefined) {
            filter.is_active = is_active === "true";
        }

        if (typeof platform_id === "string" && platform_id.trim().length > 0) {

            if (!mongoose.Types.ObjectId.isValid(platform_id)) {
                return res.status(400).json({ message: "Id de plataforma no válido." });
            }

            filter.platform_id = platform_id;
        }

        if (typeof genre_id === "string" && genre_id.trim().length > 0) {

            if (!mongoose.Types.ObjectId.isValid(genre_id)) {
                return res.status(400).json({ message: "Id de género no válido." });
            }

            filter.genre_id = genre_id;
        }

        if (search && search.trim().length > 0) {
            const regex = new RegExp(search.trim(), "i");

            filter.$or = [
                { title: regex },
                { developer: regex },
                { description: regex }
            ];
        }

        const [videoGames, total] = await Promise.all([
            VideoGame.find(filter)
                .populate("platform_id", "_id name manufacturer")
                .populate("genre_id", "_id name")
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),

            VideoGame.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            page,
            totalPages,
            totalVideoGames: total,
            videoGames
        });

    } catch (error) {
        logger.error("Error al listar videojuegos", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        logger.info("Fin de listado de videojuegos");
    }
};

export const getVideoGameOptions = async (req, res) => {
    logger.info("Inicio de listado público de videojuegos");

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const search = req.query.search;
        const platform_id = req.query.platform_id;
        const genre_id = req.query.genre_id;

        const skip = (page - 1) * limit;

        const filter = {
            is_active: true
        };

        if (typeof platform_id === "string" && platform_id.trim().length > 0) {

            if (!mongoose.Types.ObjectId.isValid(platform_id)) {
                return res.status(400).json({ message: "Id de plataforma no válido." });
            }

            filter.platform_id = platform_id;
        }

        if (typeof genre_id === "string" && genre_id.trim().length > 0) {

            if (!mongoose.Types.ObjectId.isValid(genre_id)) {
                return res.status(400).json({ message: "Id de género no válido." });
            }

            filter.genre_id = genre_id;
        }

        if (typeof search === "string" && search.trim().length > 0) {
            const regex = new RegExp(search.trim(), "i");

            filter.$or = [
                { title: regex }
            ];
        }

        const [videoGames, total] = await Promise.all([
            VideoGame.find(filter)
                .select(`
          _id
          title
          image_url
          rating_average
          rating_count
        `)
                .populate("platform_id", "_id name")
                .populate("genre_id", "_id name")
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),

            VideoGame.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            page,
            totalPages,
            totalVideoGames: total,
            videoGames
        });

    } catch (error) {
        logger.error("Error al obtener videojuegos públicos", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        logger.info("Fin de listado público de videojuegos");
    }
};

export const getVideoGameDetails = async (req, res) => {
    return res.status(200).json("Detalles de Videjuego");
};

export const createVideoGame = async (req, res) => {
    logger.info("Inicio de creación de videojuego");

    const { title, description, release_date, developer, image_url, platform_id, genre_id } = req.body;

    if (!title || !description || !release_date || !developer || !platform_id || !genre_id) {
        logger.warn("Campos incompletos en creación de videojuego");
        return res.status(400).json({ message: "Debes completar todos los campos obligatorios." });
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
        logger.warn("Título inválido");
        return res.status(400).json({ message: "Título no válido." });
    }

    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
        logger.warn("Descripción inválida");
        return res.status(400).json({ message: "Descripción no válida." });
    }

    const trimmedDeveloper = developer.trim();
    if (!trimmedDeveloper) {
        logger.warn("Desarrolladora inválida");
        return res.status(400).json({ message: "Desarrolladora no válida." });
    }


    const releaseDateObj = new Date(release_date);

    if (isNaN(releaseDateObj.getTime())) {
        logger.warn("Fecha de lanzamiento inválida");
        return res.status(400).json({ message: "Fecha de lanzamiento no válida." });
    }

    const today = new Date();
    if (releaseDateObj > today) {
        logger.warn("Fecha de lanzamiento en el futuro");
        return res.status(400).json({ message: "La fecha de lanzamiento no puede ser futura." });
    }

    try {
        const [platform, genre] = await Promise.all([Platform.findById(platform_id), Genre.findById(genre_id)]);

        if (!platform) {
            return res.status(400).json({ message: "Plataforma no válida." });
        }

        if (!genre) {
            return res.status(400).json({ message: "Género no válido." });
        }

        if (!platform.is_active) {
            logger.warn(`Plataforma inactiva: ${platform.name}`);

            return res.status(400).json({ message: "La plataforma seleccionada está inactiva." });
        }

        if (!genre.is_active) {
            logger.warn(`Género inactivo: ${genre.name}`);

            return res.status(400).json({ message: "El género seleccionado está inactivo." });
        }

        const existingVideoGame = await VideoGame.findOne({
            title: { $regex: `^${trimmedTitle}$`, $options: "i" },
            platform_id
        });

        if (existingVideoGame) {
            logger.warn(`Videojuego duplicado: ${trimmedTitle}`);
            return res.status(400).json({ message: "Este videojuego ya existe para esa plataforma." });
        }

        const savedVideoGame = await VideoGame.create({
            title: trimmedTitle,
            description: trimmedDescription,
            release_date: releaseDateObj,
            developer: trimmedDeveloper,
            platform_id,
            genre_id
        });

        if (typeof image_url === "string" && image_url.trim() !== "") {
            videoGameData.image_url = image_url.trim();
        }

        logger.info(`Videojuego creado correctamente: ${trimmedTitle}`);

        return res.status(201).json(savedVideoGame);

    } catch (error) {
        if (error.code === 11000) {
            logger.warn(`Duplicado en DB: ${trimmedTitle}`);
            return res.status(400).json({ message: "Este videojuego ya existe." });
        }

        logger.error("Error en creación de videojuego", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de creación de videojuego");
    }
};

export const updateVideoGame = async (req, res) => {
    logger.info("Inicio de actualización de videojuego");

    const { id } = req.params;

    const { title, description, release_date, developer, image_url, platform_id, genre_id } = req.body;

    try {
        const updateData = {};

        const videoGame = await VideoGame.findById(id);

        if (!videoGame) {
            logger.warn("Videojuego no encontrado");

            return res.status(404).json({ message: "Videojuego no encontrado" });
        }

        if (!videoGame.is_active) {
            logger.warn(`Intento de actualizar videojuego inactivo: ${id}`);

            return res.status(403).json({ message: "No se puede actualizar un videojuego inactivo" });
        }

        if (typeof title === "string" && title.trim().length > 0) {
            const trimmedTitle = title.trim();

            const existingVideoGame = await VideoGame.findOne({
                _id: { $ne: id },
                title: { $regex: `^${trimmedTitle}$`, $options: "i" },
                platform_id: platform_id || videoGame.platform_id
            });

            if (existingVideoGame) {
                logger.warn("Videojuego existente con el mismo título y plataforma");

                return res.status(400).json({ message: "Ya existe un videojuego con ese título en esa plataforma" });
            }

            updateData.title = trimmedTitle;
        }

        if (typeof description === "string" && description.trim().length > 0) {
            updateData.description = description.trim();
        }

        if (typeof developer === "string" && developer.trim().length > 0) {
            updateData.developer = developer.trim();
        }

        if (typeof image_url === "string" && image_url.trim() !== "") {

            if (videoGame.image_url && !videoGame.image_url.includes("dicebear")) {
                try {
                    await deleteImage(videoGame.image_url);
                } catch (err) {
                    logger.warn("No se pudo borrar imagen anterior del videojuego", { message: err.message });
                }
            }

            updateData.image_url = image_url.trim();
        }

        if (typeof release_date === "string" && release_date.trim().length > 0) {
            const releaseDateObj = new Date(release_date);

            if (isNaN(releaseDateObj.getTime())) {
                return res.status(400).json({ message: "Fecha de lanzamiento no válida" });
            }

            const today = new Date();

            if (releaseDateObj > today) {
                return res.status(400).json({ message: "La fecha de lanzamiento no puede ser futura" });
            }

            updateData.release_date = releaseDateObj;
        }

        if (typeof platform_id === "string" && platform_id.trim().length > 0) {
            const platform = await Platform.findById(platform_id);

            if (!platform) {
                return res.status(400).json({ message: "Plataforma no válida" });
            }

            if (!platform.is_active) {
                return res.status(400).json({ message: "La plataforma seleccionada está inactiva" });
            }

            updateData.platform_id = platform_id;
        }

        if (typeof genre_id === "string" && genre_id.trim().length > 0) {
            const genre = await Genre.findById(genre_id);

            if (!genre) {
                return res.status(400).json({ message: "Género no válido" });
            }

            if (!genre.is_active) {
                return res.status(400).json({ message: "El género seleccionado está inactivo" });
            }

            updateData.genre_id = genre_id;
        }

        if (updateData.platform_id && !updateData.title) {
            const existingVideoGame = await VideoGame.findOne({
                _id: { $ne: id },
                title: { $regex: `^${videoGame.title}$`, $options: "i" },
                platform_id: updateData.platform_id
            });

            if (existingVideoGame) {
                return res.status(400).json({ message: "Ya existe un videojuego con ese título en esa plataforma" });
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No hay datos para actualizar" });
        }

        const updatedVideoGame = await VideoGame.findByIdAndUpdate(id, { $set: updateData },
            {
                returnDocument: "after",
                runValidators: true
            }
        ).populate("platform_id", "name").populate("genre_id", "name");

        logger.info(`Videojuego actualizado: ${updatedVideoGame.title}`);

        return res.status(200).json({
            success: true,
            videoGame: updatedVideoGame
        });

    } catch (error) {
        if (error.code === 11000) {
            logger.warn("Duplicado en DB al actualizar videojuego");

            return res.status(400).json({ message: "Ya existe un videojuego con esos datos" });
        }

        logger.error("Error al actualizar videojuego", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        logger.info("Fin de actualización de videojuego");
    }
};

export const toggleVideoGameStatus = async (req, res) => {
    logger.info("Inicio de toggle de estado de videojuego");

    const { id } = req.params;

    try {
        const videoGame = await VideoGame.findById(id);

        if (!videoGame) {
            return res.status(404).json({ message: "Videojuego no encontrado." });
        }

        if (!videoGame.is_active) {

            const [platform, genre] = await Promise.all([Platform.findById(videoGame.platform_id), Genre.findById(videoGame.genre_id)]);

            if (!platform) {
                return res.status(400).json({ message: "La plataforma asociada no existe." });
            }

            if (!genre) {
                return res.status(400).json({ message: "El género asociado no existe." });
            }

            if (!platform.is_active) {
                logger.warn(`Intento de activar videojuego con plataforma inactiva: ${platform.name}`);

                return res.status(400).json({ message: "No se puede activar el videojuego porque su plataforma está inactiva." });
            }

            if (!genre.is_active) {
                logger.warn(`Intento de activar videojuego con género inactivo: ${genre.name}`);

                return res.status(400).json({ message: "No se puede activar el videojuego porque su género está inactivo." });
            }
        }

        videoGame.is_active = !videoGame.is_active;

        await videoGame.save();

        logger.info(`Estado cambiado: ${videoGame.title} → ${videoGame.is_active}`);

        return res.status(200).json({
            success: true,
            message: videoGame.is_active
                ? "Videojuego activado."
                : "Videojuego desactivado.",
            videoGame: {
                _id: videoGame._id,
                title: videoGame.title,
                is_active: videoGame.is_active
            }
        });

    } catch (error) {
        logger.error("Error en toggle de videojuego", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de toggle de estado de videojuego");
    }
};