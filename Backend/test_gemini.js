import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const generateWithGemini = async (prompt) => {
    try {
        console.log("🔄 Attempting generation with Gemini...");
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Gemini API key not configured");
        }

        console.log(`Using API Key: ${apiKey.substring(0, 5)}...`);

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
            {
                instances: [{ prompt: prompt }],
                parameters: { sampleCount: 1 },
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        if (
            response.data &&
            response.data.predictions &&
            response.data.predictions.length > 0
        ) {
            console.log("✅ Gemini Generation Success!");
            console.log("Response data structure valid.");
        } else {
            console.log("❌ Invalid response structure from Gemini API");
            console.log(JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.error(
            "❌ Gemini Generation Error:",
            error.response ? error.response.data : error.message
        );
    }
};

generateWithGemini("A futuristic city on Mars");
