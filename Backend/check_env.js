
import dotenv from "dotenv";
dotenv.config();

console.log("Checking Environment Variables...");
console.log("CLERK_PUBLISHABLE_KEY:", process.env.CLERK_PUBLISHABLE_KEY ? "✅ Loaded" : "❌ Missing");
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "✅ Loaded" : "❌ Missing");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing");
console.log("CLIPDROP_API:", process.env.CLIPDROP_API ? "✅ Loaded" : "❌ Missing");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing");
