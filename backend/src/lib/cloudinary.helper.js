import cloudinary from "./cloudinary.js";
import logger from "../config/logger.js";

export const uploadImage = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "users" },
            (error, result) => {
                if (error) {
                    logger.error("Error subiendo imagen a Cloudinary", {
                        message: error.message
                    });
                    return reject(error);
                }

                logger.info("Imagen subida a Cloudinary", {
                    url: result.secure_url,
                    public_id: result.public_id
                });

                resolve(result);
            }
        ).end(fileBuffer);
    });
};

export const deleteImage = async (imageUrl) => {
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1];
    const publicId = `users/${filename.split(".")[0]}`;

    return await cloudinary.uploader.destroy(publicId);
};