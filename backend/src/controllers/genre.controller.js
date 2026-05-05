import Genre from "../models/Genre.js";
import logger from "../config/logger.js";

export const getAllGenres = async (req, res) => {
    return res.status(200).json({ message: "Listado completo de generos para Admins" });
};

export const getGenreOptions = async (req, res) => {
    return res.status(200).json({ message: "Listado de opciones de genero para Usuarios" });
};

export const createGenre = async (req, res) => {
    return res.status(200).json({ message: "Creación de generos" });
};

export const updateGenre = async (req, res) => {
    return res.status(200).json({ message: "Actualización de generos" });
};

export const toggleGenreStatus = async (req, res) => {
    return res.status(200).json({ message: "Toggle de estatus de generos" });
};