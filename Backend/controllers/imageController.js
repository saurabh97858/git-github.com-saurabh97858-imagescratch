import axios from "axios";
import userModel from "../models/userModel.js";
import imageHistoryModel from "../models/imageHistoryModel.js";
import FormData from "form-data";
import { createCanvas, loadImage } from "canvas";

// Helper function for Gemini Image Generation (text-to-image)
const generateWithGemini = async (prompt) => {
  try {
    console.log("🔄 Attempting generation with Gemini...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

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
      const base64Image = response.data.predictions[0].bytesBase64Encoded;
      return `data:image/png;base64,${base64Image}`;
    } else {
      throw new Error("Invalid response structure from Gemini API");
    }
  } catch (error) {
    console.error(
      "❌ Gemini Generation Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Helper function to create collage from multiple images
const createCollage = async (images) => {
  try {
    console.log(`🖼️ Creating collage from ${images.length} images...`);

    const imageCount = images.length;
    const imageSize = 512;
    let canvasWidth, canvasHeight, cols, rows;

    if (imageCount === 1) {
      cols = 1;
      rows = 1;
    } else if (imageCount === 2) {
      cols = 2;
      rows = 1;
    } else if (imageCount <= 4) {
      cols = 2;
      rows = 2;
    } else {
      cols = 2;
      rows = 2;
    }

    canvasWidth = cols * imageSize;
    canvasHeight = rows * imageSize;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < Math.min(imageCount, 4); i++) {
      const base64Data = images[i].replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const img = await loadImage(buffer);

      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * imageSize;
      const y = row * imageSize;

      ctx.drawImage(img, x, y, imageSize, imageSize);
    }

    const collageBase64 = canvas.toDataURL("image/png");
    console.log("✅ Collage created successfully");
    return collageBase64;
  } catch (error) {
    console.error("❌ Collage creation error:", error.message);
    throw error;
  }
};

export const generateImage = async (req, res) => {
  try {
    const { prompt, images } = req.body;
    const userId = req.userId;

    console.log("🔍 Request received:", {
      hasPrompt: !!prompt,
      hasImages: images && images.length > 0,
      imageCount: images ? images.length : 0,
    });

    if (!prompt) {
      return res.json({ success: false, message: "Prompt required" });
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let user = await userModel.findOne({ clerkId: userId });

    if (!user) {
      user = await userModel.create({
        clerkId: userId,
        name: "New User",
        creditBalance: 100, // Default credits for new users
      });
    }

    // Credits check disabled for testing
    // if (user.creditBalance <= 0) {
    //   return res.json({
    //     success: false,
    //     message: "No credits left",
    //     creditBalance: user.creditBalance,
    //   });
    // }

    let finalImage = null;
    let usedProvider = "";

    if (images && images.length > 0) {
      console.log("📸 Multiple images mode - creating collage");
      try {
        finalImage = await createCollage(images);
        usedProvider = "Collage";
      } catch (collageError) {
        console.error("❌ Collage creation failed:", collageError.message);
        throw new Error("Failed to create collage. Please try again.");
      }
    } else {
      console.log("📝 Text-to-image mode");
      console.log("🔑 ClipDrop API configured:", !!process.env.CLIPDROP_API);

      if (process.env.CLIPDROP_API) {
        try {
          console.log("🎨 Attempting generation with ClipDrop...");
          const formData = new FormData();
          formData.append("prompt", prompt);

          const { data } = await axios.post(
            "https://clipdrop-api.co/text-to-image/v1",
            formData,
            {
              headers: {
                "x-api-key": process.env.CLIPDROP_API,
                ...formData.getHeaders(),
              },
              responseType: "arraybuffer",
              timeout: 30000,
            }
          );

          const isPng =
            data[0] === 0x89 &&
            data[1] === 0x50 &&
            data[2] === 0x4e &&
            data[3] === 0x47;

          if (!isPng) {
            throw new Error("ClipDrop returned invalid image data");
          }

          const base64Image = Buffer.from(data).toString("base64");
          finalImage = `data:image/png;base64,${base64Image}`;
          usedProvider = "ClipDrop";
          console.log("✅ ClipDrop generation successful");
        } catch (clipdropError) {
          console.warn(
            "⚠️ ClipDrop failed, switching to Gemini...",
            clipdropError.message
          );
        }
      }

      if (!finalImage) {
        try {
          finalImage = await generateWithGemini(prompt);
          usedProvider = "Gemini";
          console.log("✅ Gemini generation successful");
        } catch (geminiError) {
          console.error("❌ Gemini also failed:", geminiError.message);
          throw new Error(
            "Both image generation services failed. Please try again later."
          );
        }
      }
    }

    await userModel.updateOne(
      { clerkId: userId },
      { $inc: { creditBalance: -1 } }
    );

    // Save to history
    await imageHistoryModel.create({
      clerkId: userId,
      imageUrl: finalImage,
      prompt: prompt,
    });

    res.json({
      success: true,
      message: `Image ${images && images.length > 0 ? "Collage Created" : "Generated"} Successfully via ${usedProvider}`,
      resultImage: finalImage,
      creditBalance: user.creditBalance - 1,
    });
  } catch (err) {
    console.log("❌ Generation Error:", err.message);
    res.json({
      success: false,
      message: err.message || "Image generation failed! Please try again.",
    });
  }
};

// Enhance prompt using Gemini Text model
export const enhancePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.json({ success: false, message: "Prompt required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Gemini API key not configured" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: `Enhance this image generation prompt to be more descriptive, artistic, and detailed. Keep it under 50 words. Only return the enhanced prompt text, nothing else. Original prompt: "${prompt}"`
          }]
        }]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const enhancedText = response.data.candidates[0].content.parts[0].text.trim();
      res.json({ success: true, enhancedPrompt: enhancedText });
    } else {
      throw new Error("Invalid response from Gemini");
    }

  } catch (error) {
    console.error("❌ Prompt Enhancement Error:", error.message);
    res.json({ success: false, message: "Failed to enhance prompt" });
  }
};

// Remove background using ClipDrop
export const removeBackground = async (req, res) => {
  try {
    const { image } = req.body; // Base64 image
    if (!image) {
      return res.json({ success: false, message: "Image required" });
    }

    const apiKey = process.env.CLIPDROP_API;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "ClipDrop API key not configured" });
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const formData = new FormData();
    formData.append("image_file", buffer, { filename: "image.png" });

    const response = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          "x-api-key": apiKey,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    const base64Result = Buffer.from(response.data).toString("base64");
    const finalImage = `data:image/png;base64,${base64Result}`;

    res.json({ success: true, resultImage: finalImage });

  } catch (error) {
    console.error("❌ Background Removal Error:", error.message);
    res.json({ success: false, message: "Failed to remove background" });
  }
};

// Upscale image using ClipDrop
export const upscaleImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.json({ success: false, message: "Image required" });
    }

    const apiKey = process.env.CLIPDROP_API;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "ClipDrop API key not configured" });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const formData = new FormData();
    formData.append("image_file", buffer, { filename: "image.png" });
    formData.append("target_width", "4096"); // Request 4k upscale

    const response = await axios.post(
      "https://clipdrop-api.co/image-upscaling/v1/upscale",
      formData,
      {
        headers: {
          "x-api-key": apiKey,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    const base64Result = Buffer.from(response.data).toString("base64");
    const finalImage = `data:image/png;base64,${base64Result}`;

    res.json({ success: true, resultImage: finalImage });

  } catch (error) {
    console.error("❌ Upscale Error:", error.message);
    res.json({ success: false, message: "Failed to upscale image" });
  }
};

// Generate variations using ClipDrop (Reimagine)
export const generateVariations = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.json({ success: false, message: "Image required" });
    }

    const apiKey = process.env.CLIPDROP_API;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "ClipDrop API key not configured" });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const formData = new FormData();
    formData.append("image_file", buffer, { filename: "image.png" });

    const response = await axios.post(
      "https://clipdrop-api.co/reimagine/v1/reimagine",
      formData,
      {
        headers: {
          "x-api-key": apiKey,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    const base64Result = Buffer.from(response.data).toString("base64");
    const finalImage = `data:image/png;base64,${base64Result}`;

    res.json({ success: true, resultImage: finalImage });

  } catch (error) {
    console.error("❌ Variations Error:", error.message);
    res.json({ success: false, message: "Failed to generate variations" });
  }
};

// Image to Prompt using Gemini Vision
export const imageToPrompt = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.json({ success: false, message: "Image required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Gemini API key not configured" });
    }

    // Extract mime type
    const mimeTypeMatch = image.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png";

    // Remove header if present to get pure base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [
            { text: "Describe this image in detail to create a text-to-image prompt. Keep it under 50 words. Focus on visual elements, style, lighting, and composition." },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const description = response.data.candidates[0].content.parts[0].text;
      res.json({ success: true, prompt: description });
    } else {
      throw new Error("Invalid response from Gemini API");
    }

  } catch (error) {
    console.error("❌ Image to Prompt Error:", error.message);
    res.json({ success: false, message: "Failed to generate prompt from image" });
  }
};
