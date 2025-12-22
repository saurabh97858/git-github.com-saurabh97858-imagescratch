import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
  adminResponse: {
    type: String,
    default: "",
  },
  respondedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const contactModel = mongoose.model("Contact", contactSchema);

export default contactModel;
