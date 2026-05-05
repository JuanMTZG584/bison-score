import Genre from "../models/Genre.js";
import logger from "../config/logger.js";

export const getAllGenres = async (req, res) => {
    return res.status(200).json({ message: "Listado completo de generos para Admins" });
};

export const getGenreOptions = async (req, res) => {
    return res.status(200).json({ message: "Listado de opciones de genero para Usuarios" });
};

export const createGenre = async (req, res) => {
    logger.info("Inicio de creación de género");

    const { name, description } = req.body;

    if (!name || !description) {
        logger.warn("Campos incompletos en creación de género");
        return res.status(400).json({ message: "Debes completar todos los campos." });
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
        logger.warn("Nombre inválido");
        return res.status(400).json({ message: "Nombre no válido." });
    }

    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
        logger.warn("Descripción inválida");
        return res.status(400).json({ message: "Descripción no válida." });
    }

    try {
        const existingGenre = await Genre.findOne({
            name: { $regex: `^${trimmedName}$`, $options: "i" }
        });

        if (existingGenre) {
            logger.warn(`Género duplicado: ${trimmedName}`);
            return res.status(400).json({message: "Este género ya existe."});
        }

        const savedGenre = await Genre.create({
            name: trimmedName,
            description: trimmedDescription
        });

        logger.info(`Género creado correctamente: ${trimmedName}`);

        return res.status(201).json(savedGenre);

    } catch (error) {
        if (error.code === 11000) {
            logger.warn(`Duplicado en DB: ${trimmedName}`);
            return res.status(400).json({message: "Este género ya existe."});
        }

        logger.error("Error en creación de género", {message: error.message});

        return res.status(500).json({message: "Error interno del servidor."});
    } finally {
        logger.info("Fin de creación de género");
    }
};

export const updateGenre = async (req, res) => {
    return res.status(200).json({ message: "Actualización de generos" });
};

export const toggleGenreStatus = async (req, res) => {
    return res.status(200).json({ message: "Toggle de estatus de generos" });
};