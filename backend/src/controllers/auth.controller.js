import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import logger from "../config/logger.js";
import { env } from "../config/env.js";

export const signup = async (req, res) => {
    logger.info("Inicio de proceso de registro");

    const { name, email, password, image_url, birth_date } = req.body;

    if (!name || !email || !password || !birth_date) {
        logger.warn("Campos incompletos en registro");
        return res.status(400).json({ message: "Debes de completar todos los campos." });
    }

    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
        logger.warn("Email inválido");
        return res.status(400).json({ message: "Formato de correo no válido." });
    }

    if (password.length < 6) {
        logger.warn("Contraseña demasiado corta");
        return res.status(400).json({ message: "La contraseña debe contener al menos 6 caracteres." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
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

    if (age < 13) {
        logger.warn(`Usuario menor de edad: ${normalizedEmail}`);
        return res.status(403).json({ message: "Debes tener al menos 13 años." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const savedUser = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            image_url,
            birth_date: birthDateObj
        });

        generateToken(savedUser._id, res);

        logger.info(`Usuario registrado correctamente: ${normalizedEmail}`);

        return res.status(201).json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role
        });

    } catch (error) {
        if (error.code === 11000) {
            logger.warn(`Email duplicado (DB): ${normalizedEmail}`);
            return res.status(400).json({ message: "Este correo ya fue registrado." });
        }

        logger.error("Error en registro", { message: error.message });

        return res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        logger.info("Fin de proceso de registro");
    }
};

export const login = async (req, res) => {
    logger.info("Inicio de proceso de login");

    const { email, password } = req.body;

    if (!email || !password) {
        logger.warn("Login fallido: campos incompletos");
        return res.status(400).json({ message: "Todos los campos se deben rellenar" });
    }

    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
        logger.warn("Login fallido: email inválido");
        return res.status(400).json({ message: "Credenciales inválidas" });
    }

    try {
        const user = await User.findOne({ email: normalizedEmail});

        if (!user) {
            logger.warn(`Login fallido: usuario no encontrado (${normalizedEmail})`);
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            logger.warn(`Login fallido: contraseña incorrecta (${normalizedEmail})`);
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        generateToken(user._id, res);

        logger.info(`Login exitoso: ${user.email}`);

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image_url: user.image_url,
            birth_date: user.birth_date,
            role: user.role
        });

    } catch (error) {
        logger.error("Error en controlador de login", {
            message: error.message
        });

        return res.status(500).json({ message: "Error interno del servidor" });
    } finally {
        logger.info("Fin de proceso de login");
    }
};

export const logout = (_, res) => {
    logger.info("Inicio de logout");

    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "strict",
        secure: env.NODE_ENV !== "development"
    });

    logger.info("Logout exitoso");

    res.status(200).json({ message: "Cierre de sesión exitoso" });
};