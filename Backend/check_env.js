console.log("Checking Environment Variables...");
console.log("CLERK_PUBLISHABLE_KEY:", process.env.CLERK_PUBLISHABLE_KEY ? "✅ Loaded" : "❌ Missing");
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "✅ Loaded" : "❌ Missing");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing");
