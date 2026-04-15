import express from "express";
import AuthController from "./auth.controller.js";
import authMiddleware from "./auth.middleware.js";

const router = express.Router();

// Register a new user
router.post("/register", AuthController.register);

// Login user
router.post("/login", AuthController.login);

// Get current user profile (protected)
router.get("/profile", authMiddleware, AuthController.getProfile);

export default router;
