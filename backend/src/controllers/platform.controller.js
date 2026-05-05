import Platform from "../models/Platform.js";
import logger from "../config/logger.js";

export const getAllPlatforms = async (req, res) => {
    res.status(200).json({ message: "Plataformas admin" });
};

export const getPlatformOptions = async (req, res) => {
    res.status(200).json({ message: "Plataformas user" });
};

export const createPlatform = async (req, res) => {
    logger.info("Inicio de creación de plataforma");

    const { name, manufacturer, release_date } = req.body;

    if (!name || !manufacturer || !release_date) {
        logger.warn("Campos incompletos en creación de plataforma");
        return res.status(400).json({ message: "Debes completar todos los campos." });
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
        logger.warn("Nombre inválido");
        return res.status(400).json({ message: "Nombre no válido." });
    }

    const trimmedManufacturer = manufacturer.trim();
    if (!trimmedManufacturer) {
        logger.warn("Fabricante inválido");
        return res.status(400).json({ message: "Fabricante no válido." });
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
        const existingPlatform = await Platform.findOne({ name: { $regex: `^${trimmedName}$`, $options: "i" } });

        if (existingPlatform) {
            logger.warn(`Plataforma duplicada: ${trimmedName}`);
            return res.status(400).json({ message: "Esta plataforma ya existe." });
        }

        const savedPlatform = await Platform.create({
            name: trimmedName,
            manufacturer: trimmedManufacturer,
            release_date: releaseDateObj
        });

        logger.info(`Plataforma creada correctamente: ${trimmedName}`);

        return res.status(201).json(savedPlatform);

    } catch (error) {
        if (error.code === 11000) {
            logger.warn(`Duplicado en DB: ${trimmedName}`);
            return res.status(400).json({ message: "Esta plataforma ya existe." });
        }

        logger.error("Error en creación de plataforma", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de creación de plataforma");
    }
};

export const updatePlatform = async (req, res) => {
    res.status(200).json({ message: "Actualizar Plataformas" });
};

export const deletePlatform = async (req, res) => {
    res.status(200).json({ message: "Eliminar Plataformas" });
};