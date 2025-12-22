import mongoose from "mongoose";

const imageHistorySchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        index: true, // For fast queries
    },
    imageUrl: {
        type: String,
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const imageHistoryModel = mongoose.model("ImageHistory", imageHistorySchema);

export default imageHistoryModel;
