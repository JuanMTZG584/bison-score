import mongoose from "mongoose";
import Genre from "../models/Genre.js";
import Platform from "../models/Platform.js";
import Rating from "../models/Rating.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import VideoGame from "../models/VideoGame.js";
import logger from "../config/logger.js";

export const getTopRatedGamesReport = async (req, res) => {
    return res.status(200).json("Juegos mejor calificados");
};

export const getMostReviewedGamesReport = async (req, res) => {
    return res.status(200).json("Juegos más reseñados");
};

export const getUserActivityReport = async (req, res) => {
    return res.status(200).json("Actividad de usuarios");
};

export const getGamesDistributionReport = async (req, res) => {
    return res.status(200).json("Distribución de juegos");
};