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
            return res.status(400).json({ message: "Este género ya existe." });
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
            return res.status(400).json({ message: "Este género ya existe." });
        }

        logger.error("Error en creación de género", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de creación de género");
    }
};

export const updateGenre = async (req, res) => {
    logger.info("Inicio de actualización de género");

    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const updateData = {};

        const genre = await Genre.findById(id);

        if (!genre) {
            logger.warn("Género no encontrado");
            return res.status(404).json({ message: "Género no encontrado" });
        }

        if (!genre.is_active) {
            logger.warn(`Intento de actualizar género inactivo: ${id}`);
            return res.status(403).json({ message: "No se puede actualizar un género inactivo" });
        }

        if (typeof name === "string" && name.trim().length > 0) {
            const trimmedName = name.trim();

            const existingGenre = await Genre.findOne({
                _id: { $ne: id },
                name: { $regex: `^${trimmedName}$`, $options: "i" }
            });

            if (existingGenre) {
                logger.warn("Género existente con el mismo nombre");
                return res.status(400).json({ message: "Ya existe otro género con ese nombre" });
            }

            updateData.name = trimmedName;
        }

        if (typeof description === "string" && description.trim().length > 0) {
            updateData.description = description.trim();
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No hay datos para actualizar" });
        }

        const updatedGenre = await Genre.findByIdAndUpdate(
            id,
            { $set: updateData },
            { returnDocument: "after", runValidators: true }
        );

        logger.info(`Género actualizado: ${updatedGenre.name}`);

        return res.status(200).json({
            success: true,
            genre: updatedGenre
        });

    } catch (error) {
        if (error.code === 11000) {
            logger.warn("Duplicado en DB al actualizar género");
            return res.status(400).json({ message: "Ya existe un género con ese nombre" });
        }

        logger.error("Error al actualizar género", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        logger.info("Fin de actualización de género");
    }
};

export const toggleGenreStatus = async (req, res) => {
    logger.info("Inicio de toggle de estado de género");

    const { id } = req.params;

    try {
        const genre = await Genre.findById(id);

        if (!genre) {
            return res.status(404).json({message: "Género no encontrado."});
        }

        genre.is_active = !genre.is_active;
        await genre.save();

        logger.info(`Estado cambiado: ${genre.name} → ${genre.is_active}`);

        return res.status(200).json({
            success: true,
            message: genre.is_active
                ? "Género activado."
                : "Género desactivado.",
            genre: {
                _id: genre._id,
                name: genre.name,
                is_active: genre.is_active
            }
        });

    } catch (error) {
        logger.error("Error en toggle de género", {message: error.message});

        return res.status(500).json({message: "Error interno del servidor."});
    } finally {
        logger.info("Fin de toggle de estado de género");
    }
};