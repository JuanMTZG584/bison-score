import VideoGame from "../models/VideoGame.js";
import Platform from "../models/Platform.js";
import Genre from "../models/Genre.js";
import logger from "../config/logger.js";

export const getAllVideoGames = async (req, res) => {
    return res.status(200).json("Lista de juegos para Admins");
};

export const getVideoGameOptions = async (req, res) => {
    return res.status(200).json("Lista de juegos para Users");
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
    return res.status(200).json("Actualización de Videojuego");
};

export const toggleVideoGameStatus = async (req, res) => {
    return res.status(200).json("Toggle de estatus del Videojuego");
};