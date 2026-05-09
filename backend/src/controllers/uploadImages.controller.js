import { uploadImage } from "../lib/cloudinary.helper.js";
import logger from "../config/logger.js";

export const uploadImageController = async (req, res) => {
    logger.info("Inicio upload de imagen");

    try {
        if (!req.file) {
            logger.warn("No se recibió archivo en upload");
            return res.status(400).json({
                message: "No se envió ninguna imagen"
            });
        }

        const result = await uploadImage(req.file.buffer);

        logger.info("Imagen subida correctamente", {
            url: result.secure_url,
            public_id: result.public_id
        });

        return res.status(200).json({
            url: result.secure_url
        });

    } catch (error) {
        logger.error("Error al subir imagen", {
            message: error.message
        });

        return res.status(500).json({
            message: "Error al subir imagen"
        });
    } finally {
        logger.info("Fin upload de imagen");
    }
};