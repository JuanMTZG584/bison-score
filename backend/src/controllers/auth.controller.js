import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import logger from "../config/logger.js";

export const signup = async (req, res) => {
    logger.info("Inicio de proceso de registro");
    try {
        const { name, email, password, image_url, birth_date } = req.body;

        if (!name || !email || !password || !birth_date) {
            logger.warn("Campos incompletos en registro");
            return res.status(400).json({ message: "Debes de completar todos los campos." });
        }

        if (password.length < 6) {
            logger.warn("Contraseña demasiado corta");
            return res.status(400).json({ message: "La contraseña debe contener al menos 6 caracteres." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            logger.warn("Formato de correo inválido");
            return res.status(400).json({ message: "Formato de correo no válido." });
        }

        const birthDateObj = new Date(birth_date);
        if (isNaN(birthDateObj.getTime())) {
            logger.warn("Fecha de nacimiento inválida");
            return res.status(400).json({ message: "Fecha de nacimiento no válida." });
        }

        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }

        const MIN_AGE = 13;
        if (age < MIN_AGE) {
            logger.warn(`Usuario menor de edad: ${email}`);
            return res.status(403).json({
                message: `Debes tener al menos ${MIN_AGE} años para registrarte.`,
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            logger.warn(`Email duplicado: ${email}`);
            return res.status(400).json({ message: "Este correo ya fue registrado." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            image_url,
            birth_date,
        });

        if (newUser) {

            const savedUser = await newUser.save();

            generateToken(savedUser._id, res);

            logger.info(`Usuario registrado correctamente: ${email}`);

            res.status(201).json({
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                image_url: savedUser.image_url,
                birth_date: savedUser.birth_date,
                role: savedUser.role
            });

        } else {
            res.status(400).json({ message: "Información de usuario inválida." });
        }

    } catch (error) {
        
        console.log("Error al registrar usuario:", error);
        logger.error("Error en registro", { error: error.message });
        res.status(500).json({ message: "Error interno del servidor." });

    } finally{
        logger.info("Fin de proceso de registro");
    }

}