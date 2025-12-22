import express from "express";
import { generateImage, enhancePrompt, removeBackground, upscaleImage, generateVariations, imageToPrompt } from "../controllers/imageController.js";
import { getUserHistory, deleteHistoryItem } from "../controllers/historyController.js";
import userAuth from "../middlewares/auth.js";

const router = express.Router();

router.post("/generate-image", userAuth, generateImage);
router.post("/enhance-prompt", userAuth, enhancePrompt);
router.post("/remove-background", userAuth, removeBackground);
router.post("/upscale", userAuth, upscaleImage);
router.post("/variations", userAuth, generateVariations);
router.post("/image-to-prompt", userAuth, imageToPrompt);
router.get("/history", userAuth, getUserHistory);
router.delete("/history/:id", userAuth, deleteHistoryItem);

// Debug endpoint to check API configuration
router.get("/check-config", (req, res) => {
    res.json({
        clipdropConfigured: !!process.env.CLIPDROP_API,
        apiKeyLength: process.env.CLIPDROP_API?.length || 0,
        apiKeyPreview: process.env.CLIPDROP_API ?
            `${process.env.CLIPDROP_API.substring(0, 10)}...` :
            "NOT SET",
    });
});

export default router;
