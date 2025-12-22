import express from "express";
import { userCredits, paymentRazorpay, verifyRazorpay } from "../controllers/userController.js";
import { resetCredits } from "../controllers/creditController.js";
import clerkAuth from "../middlewares/clerkAuth.js";

const userRouter = express.Router();

// 🆕 Protected Routes using Clerk
userRouter.get("/credits", clerkAuth, userCredits);
userRouter.post("/pay-razor", clerkAuth, paymentRazorpay);
userRouter.post("/reset-credits", clerkAuth, resetCredits); // Reset credits to 100

// Dummy verify route
userRouter.post("/verify-razor", verifyRazorpay);

export default userRouter;
