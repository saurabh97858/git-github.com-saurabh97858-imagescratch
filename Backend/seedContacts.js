import "dotenv/config";
import mongoose from "mongoose";
import contactModel from "./models/contactModel.js";
import connectDB from "./config/mongodb.js";

const seedData = [
    {
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        message: "I'm having trouble generating images with specific styles. Can you help?",
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
        name: "Priya Patel",
        email: "priya.p@example.com",
        message: "Great app! Just wanted to ask if you offer bulk generation plans?",
        status: "resolved",
        adminResponse: "Hi Priya, thanks for the feedback! We are working on a pro plan that will include bulk generation. Stay tuned!",
        respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    },
    {
        name: "Rohan Gupta",
        email: "rohan.g@example.com",
        message: "The download button isn't working on my iPad. Is this a known issue?",
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
    {
        name: "Sarah Jenkins",
        email: "sarah.j@example.com",
        message: "I love the cyberpunk style! Can we get more neon presets?",
        status: "resolved",
        adminResponse: "Glad you like it, Sarah! We just added 3 new neon presets. Check them out!",
        respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    },
    {
        name: "Mike Ross",
        email: "mike.ross@example.com",
        message: "My credits didn't update after payment. Please check.",
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    },
    {
        name: "Jessica Pearson",
        email: "jessica.p@example.com",
        message: "Is there an API available for commercial use?",
        status: "resolved",
        adminResponse: "Hello Jessica, yes we have an enterprise API. I've sent the details to your email.",
        respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log("✅ MongoDB Connected");

        // Optional: Clear existing data
        // await contactModel.deleteMany({});
        // console.log("🗑️ Cleared existing contacts");

        await contactModel.insertMany(seedData);
        console.log("🌱 Seed data inserted successfully!");

        console.log("📊 Added:");
        console.log("- 3 Pending Messages");
        console.log("- 3 Resolved Messages");

        process.exit();
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};

seedDB();
