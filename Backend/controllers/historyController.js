import imageHistoryModel from "../models/imageHistoryModel.js";

// Get user's image history
export const getUserHistory = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const history = await imageHistoryModel
            .find({ clerkId: userId })
            .sort({ createdAt: -1 }) // Most recent first
            .limit(100); // Limit to 100 items

        res.json({
            success: true,
            history,
        });
    } catch (error) {
        console.error("❌ History fetch error:", error.message);
        res.json({
            success: false,
            message: "Failed to fetch history",
        });
    }
};

// Delete specific image from history
export const deleteHistoryItem = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Delete only if it belongs to the user
        const result = await imageHistoryModel.deleteOne({
            _id: id,
            clerkId: userId,
        });

        if (result.deletedCount === 0) {
            return res.json({
                success: false,
                message: "Image not found or unauthorized",
            });
        }

        res.json({
            success: true,
            message: "Image deleted successfully",
        });
    } catch (error) {
        console.error("❌ Delete error:", error.message);
        res.json({
            success: false,
            message: "Failed to delete image",
        });
    }
};
