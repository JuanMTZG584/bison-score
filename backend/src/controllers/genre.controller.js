import Genre from "../models/Genre.js";
import logger from "../config/logger.js";
import mongoose from "mongoose";

export const getAllGenres = async (req, res) => {
    logger.info("Inicio de listado de géneros");

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const is_active = req.query.is_active;
        const search = req.query.search;

        const skip = (page - 1) * limit;

        const filter = {};

        if (is_active !== undefined) {
            filter.is_active = is_active === "true";
        }

        if (search && search.trim().length > 0) {
            const regex = new RegExp(search.trim(), "i");

            filter.$or = [
                { name: regex },
                { description: regex }
            ];
        }

        const [genres, total] = await Promise.all([
            Genre.find(filter)
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),

            Genre.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            page,
            totalPages,
            totalGenres: total,
            genres
        });

    } catch (error) {
        logger.error("Error al listar géneros", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        logger.info("Fin de listado de géneros");
    }
};

export const getGenreOptions = async (req, res) => {
    logger.info("Inicio de obtención de opciones de géneros");

    try {
        const genres = await Genre.find({ is_active: true })
            .select("_id name")
            .sort({ name: 1 });

        logger.info(`Géneros activos obtenidos: ${genres.length}`);

        return res.status(200).json({
            success: true,
            genres
        });

    } catch (error) {
        logger.error("Error al obtener opciones de géneros", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        logger.info("Fin de obtención de opciones de géneros");
    }
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`ID de género inválido: ${id}`);

            return res.status(400).json({ message: "ID de género no válido" });
        }

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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de género no válido." });
        }

        const genre = await Genre.findById(id);

        if (!genre) {
            return res.status(404).json({ message: "Género no encontrado." });
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
        logger.error("Error en toggle de género", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de toggle de estado de género");
    }
};