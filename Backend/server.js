import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";

import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

import { clerkMiddleware } from "@clerk/express";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 image uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));



// Clerk Authentication Middleware
app.use(clerkMiddleware());

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected ✔");

    app.use("/api/user", userRouter);
    app.use("/api/image", imageRouter);
    app.use("/api/contact", contactRouter);
    app.use("/api/admin", adminRouter);
    app.use("/api/chat", chatRouter);

    app.get("/", (req, res) => res.send("API Running with Clerk Auth ✔"));

    // Global Error Handler
    app.use((err, req, res, next) => {
      console.error("❌ GLOBAL ERROR HANDLER CAUGHT:", err);
      console.error(err.stack);
      res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server Running on PORT ${PORT}`);
      console.log(`📱 Network: http://10.153.209.231:${PORT}`);
    });
  } catch (err) {
    console.error("DB Error", err);
  }
};

startServer();
