import Genre from "../models/VideoGame.js";
import logger from "../config/logger.js";

export const getAllVideoGames = async (req, res) => {
    return res.status(200).json("Lista de juegos para Admins");
};

export const getVideoGameOptions = async (req, res) => {
    return res.status(200).json("Lista de juegos para Users");
};

export const getVideoGameDetails = async (req, res) => {
    return res.status(200).json("Detalles de Videjuego");
};

export const createVideoGame = async (req, res) => {
    return res.status(200).json("Creación de Videojuego");
};

export const updateVideoGame = async (req, res) => {
    return res.status(200).json("Actualización de Videojuego");
};

export const toggleVideoGameStatus = async (req, res) => {
    return res.status(200).json("Toggle de estatus del Videojuego");
};