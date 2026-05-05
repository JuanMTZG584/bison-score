import Platform from "../models/Platform.js";
import logger from "../config/logger.js";

export const getAllPlatforms = async (req, res) => {
    res.status(200).json({ message: "Plataformas admin" });
};

export const getPlatformOptions = async (req, res) => {
   res.status(200).json({ message: "Plataformas user" });
};

export const createPlatform = async (req, res) => {
   res.status(200).json({ message: "Crear plataformas" });
};

export const updatePlatform = async (req, res) => {
    res.status(200).json({ message: "Actualizar Plataformas" });
};

export const deletePlatform = async (req, res) => {
   res.status(200).json({ message: "Eliminar Plataformas" });
};