import Platform from "../models/Platform.js";
import logger from "../config/logger.js";

export const getAllPlatforms = async (req, res) => {
    logger.info("Inicio de listado de plataformas");

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
                { manufacturer: regex }
            ];
        }

        const [platforms, total] = await Promise.all([
            Platform.find(filter)
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),

            Platform.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            page,
            totalPages,
            totalPlatforms: total,
            platforms
        });

    } catch (error) {
        logger.error("Error al listar plataformas", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        logger.info("Fin de listado de plataformas");
    }
};

export const getPlatformOptions = async (req, res) => {
    logger.info("Inicio de obtención de opciones de plataformas");

    try {
        const platforms = await Platform.find({ is_active: true })
            .select("_id name")
            .sort({ name: 1 });

        logger.info(`Plataformas activas obtenidas: ${platforms.length}`);

        return res.status(200).json({
            success: true,
            platforms
        });

    } catch (error) {
        logger.error("Error al obtener opciones de plataformas", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        logger.info("Fin de obtención de opciones de plataformas");
    }
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
    logger.info("Inicio de actualización de plataforma");

    const { id } = req.params;
    const { name, manufacturer, release_date } = req.body;

    try {
        const updateData = {};

        const platform = await Platform.findById(id);

        if (!platform) {
            logger.warn("Plataforma no encontrada");
            return res.status(404).json({ message: "Plataforma no encontrada" });
        }

        if (!platform.is_active) {
            logger.warn(`Intento de actualizar plataforma inactiva: ${id}`);
            return res.status(403).json({ message: "No se puede actualizar una plataforma inactiva" });
        }

        if (typeof name === "string" && name.trim().length > 0) {
            const trimmedName = name.trim();

            const existingPlatform = await Platform.findOne({
                _id: { $ne: id },
                name: { $regex: `^${trimmedName}$`, $options: "i" }
            });

            if (existingPlatform) {
                logger.warn("Plataforma existente con el mismo nombre");
                return res.status(400).json({ message: "Ya existe otra plataforma con ese nombre" });
            }

            updateData.name = trimmedName;
        }

        if (typeof manufacturer === "string" && manufacturer.trim().length > 0) {
            updateData.manufacturer = manufacturer.trim();
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

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No hay datos para actualizar" });
        }

        const updatedPlatform = await Platform.findByIdAndUpdate(
            id,
            { $set: updateData },
            { returnDocument: "after", runValidators: true }
        );

        logger.info(`Plataforma actualizada: ${updatedPlatform.name}`);

        return res.status(200).json({
            success: true,
            platform: updatedPlatform
        });

    } catch (error) {
        if (error.code === 11000) {
            logger.warn("Duplicado en DB al actualizar plataforma");
            return res.status(400).json({ message: "Ya existe una plataforma con ese nombre" });
        }

        logger.error("Error al actualizar plataforma", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        logger.info("Fin de actualización de plataforma");
    }
};

export const togglePlatformStatus = async (req, res) => {
    logger.info("Inicio de toggle de estado de plataforma");

    const { id } = req.params;

    try {
        const platform = await Platform.findById(id);

        if (!platform) {
            return res.status(404).json({ message: "Plataforma no encontrada." });
        }

        platform.is_active = !platform.is_active;
        await platform.save();

        logger.info(`Estado cambiado: ${platform.name} → ${platform.is_active}`);

        return res.status(200).json({
            success: true,
            message: platform.is_active
                ? "Plataforma activada."
                : "Plataforma desactivada.",
            platform: {
                _id: platform._id,
                name: platform.name,
                is_active: platform.is_active
            }
        });

    } catch (error) {
        logger.error("Error en toggle de plataforma", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de toggle de estado de plataforma");
    }
};