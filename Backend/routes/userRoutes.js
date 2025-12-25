import express from "express";
import { userCredits, paymentRazorpay, verifyRazorpay } from "../controllers/userController.js";
import { resetCredits } from "../controllers/creditController.js";
import userAuth from "../middlewares/auth.js";

const userRouter = express.Router();

// 🆕 Protected Routes using Clerk
userRouter.get("/credits", userAuth, userCredits);
userRouter.post("/pay-razor", userAuth, paymentRazorpay);
userRouter.post("/reset-credits", userAuth, resetCredits); // Reset credits to 100

// Dummy verify route
userRouter.post("/verify-razor", verifyRazorpay);

export default userRouter;
