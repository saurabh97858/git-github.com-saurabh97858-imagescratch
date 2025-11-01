import express from 'express';
import cors from 'cors';
import 'dotenv/config';   // ✅ dotenv sahi import
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    // Routes
    app.use('/api/user', userRouter);
    app.use('/api/image', imageRouter);

    app.get('/', (req, res) => res.send("API Working ✅"));

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to connect DB", error);
    process.exit(1);
  }
};

startServer();
