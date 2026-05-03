import express from "express";
import { signup, login, logout, getMe, updateProfile, toggleUserStatus, getUsers } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";
import {uploadImageController } from "../controllers/uploadImages.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protectRoute, getMe);

router.put("/profile", protectRoute, updateProfile);

router.get("/users", protectRoute, requireAdmin, getUsers);

router.patch("/users/:id/toggle-status", protectRoute, requireAdmin, toggleUserStatus);

router.post("/upload", protectRoute, upload.single("image"), uploadImageController);

// router.get("/check", protectRoute, (req, res) => {
//   res.status(200).json(req.user);
// });

export default router;
