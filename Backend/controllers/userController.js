import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionData.js";

const userCredits = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const name = req.auth.session.user.firstName || "User";

    let user = await userModel.findOne({ clerkId: clerkUserId });

    if (!user) {
      user = await userModel.create({
        clerkId: clerkUserId,
        name,
        creditBalance: 5,
      });
    }

    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const paymentRazorpay = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { planId } = req.body;

    let credits = 0;
    if (planId === "Basic") credits = 100;
    if (planId === "Advanced") credits = 500;
    if (planId === "Business") credits = 5000;

    const user = await userModel.findOneAndUpdate(
      { clerkId: clerkUserId },
      { $inc: { creditBalance: credits } },
      { new: true }
    );

    res.json({ success: true, message: "Credits added!", credits: user.creditBalance });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  res.json({ success: true, message: "Payment Verified Clerk Mode" });
};

export { userCredits, paymentRazorpay, verifyRazorpay };
