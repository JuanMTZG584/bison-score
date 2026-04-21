import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.get("/login", login);

router.get("/logout", (req, res) => {
  res.send("Logout endpoint");
});

router.get("/check", protectRoute, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
