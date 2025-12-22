import express from "express";
import { chatWithAI } from "../controllers/chatController.js";
import userAuth from "../middlewares/auth.js";

const router = express.Router();

// Public route (or protected if you prefer, currently making it accessible to logged in users)
router.post("/ask", userAuth, chatWithAI);

export default router;
