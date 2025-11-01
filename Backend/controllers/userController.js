import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transactionModel from "../models/transactionData.js";

// ---------------- Register ----------------
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      creditBalance: 5, // ✅ Give new users 5 credits
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dummy_secret");

    res.json({ success: true, token, user: { name: user.name, creditBalance: user.creditBalance } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Login ----------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dummy_secret");
      return res.json({ success: true, token, user: { name: user.name, creditBalance: user.creditBalance } });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- User Credits ----------------
const userCredits = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Dummy Razorpay (for testing without keys) ----------------
const paymentRazorpay = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    let credits = 0;
    switch (planId) {
      case "Basic":
        credits = 100;
        break;
      case "Advanced":
        credits = 500;
        break;
      case "Business":
        credits = 5000;
        break;
      default:
        return res.json({ success: false, message: "Invalid plan" });
    }

    await userModel.findByIdAndUpdate(userId, { $inc: { creditBalance: credits } });

    res.json({ success: true, message: `Added ${credits} credits successfully (dummy mode)` });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- Dummy verifyRazorpay ----------------
const verifyRazorpay = async (req, res) => {
  res.json({ success: true, message: "Payment verified (dummy mode)" });
};

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay };
