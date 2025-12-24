import mongoose from "mongoose";

const connectDB = async () => {
  // Check if we have a connection to the database or if it's currently connecting or disconnecting
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Do NOT process.exit(1) in serverless/Vercel environment
    throw error;
  }
};

export default connectDB;
