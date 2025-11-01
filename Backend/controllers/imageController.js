import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";

export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;
    if (!userId || !prompt) return res.json({ success: false, message: "Missing details" });

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.creditBalance <= 0) return res.json({ success: false, message: "No credits left", creditBalance: 0 });

    if (!process.env.CLIPDROP_API) {
      await userModel.findByIdAndUpdate(user._id, { $inc: { creditBalance: -1 } });
      return res.json({
        success: true,
        message: "Image generated (dummy)",
        creditBalance: user.creditBalance - 1,
        resultImage: "https://via.placeholder.com/512x512.png?text=Generated+Image",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
      headers: { "x-api-key": process.env.CLIPDROP_API },
      responseType: "arraybuffer",
    });

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, { $inc: { creditBalance: -1 } });

    res.json({ success: true, message: "Image generated", creditBalance: user.creditBalance - 1, resultImage });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
