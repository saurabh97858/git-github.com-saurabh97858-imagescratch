import axios from "axios";

export const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.json({ success: false, message: "Message required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ success: false, message: "Gemini API key not configured" });
        }

        // Construct conversation history for the prompt
        let conversationContext = "";
        if (history && Array.isArray(history)) {
            conversationContext = history.map(msg =>
                `${msg.isBot ? "AI" : "User"}: ${msg.text}`
            ).join("\n");
        }

        const systemPrompt = `You are a helpful, friendly, and witty AI support assistant for 'Imagify', an AI text-to-image generation platform. 
    Your goal is to help users with:
    1. Generating images (explain how to type prompts).
    2. Using premium features like Upscale, Remove Background, and Image-to-Prompt.
    3. Troubleshooting common issues.
    4. Explaining credit system.
    
    Keep your answers concise (under 3 sentences usually) and use emojis. 
    If you don't know the answer, politely ask them to use the contact form.

    Previous Conversation:
    ${conversationContext}

    Current User Message: "${message}"
    
    Respond to the user's message based on the context.`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: systemPrompt }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            const reply = response.data.candidates[0].content.parts[0].text;
            res.json({ success: true, reply });
        } else {
            throw new Error("Invalid response from Gemini API");
        }

    } catch (error) {
        console.error("❌ Chat Error:", error.message);
        res.json({ success: false, message: "Failed to get AI response" });
    }
};
