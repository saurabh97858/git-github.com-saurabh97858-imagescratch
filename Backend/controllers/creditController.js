import userModel from "../models/userModel.js";

// Reset credits for a user (admin only or for testing)
export const resetCredits = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Update user credits to 100
        const result = await userModel.updateOne(
            { clerkId: userId },
            { $set: { creditBalance: 100 } }
        );

        if (result.modifiedCount === 0) {
            return res.json({
                success: false,
                message: "User not found or credits already at 100",
            });
        }

        res.json({
            success: true,
            message: "Credits reset to 100 successfully!",
            creditBalance: 100,
        });
    } catch (error) {
        console.error("❌ Reset credits error:", error.message);
        res.json({
            success: false,
            message: "Failed to reset credits",
        });
    }
};
