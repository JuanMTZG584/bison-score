import multer from "multer";
import logger from "../config/logger.js";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            return cb(null, true);
        }

        logger.warn("Archivo rechazado: tipo inválido", {
            mimetype: file.mimetype,
            user: req.user?._id
        });

        cb(new Error("Solo se permiten imágenes"), false);
    }
});