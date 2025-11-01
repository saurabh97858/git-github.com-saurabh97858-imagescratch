import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  creditBalance: { type: Number, default: 5 }, // ✅ New users get 5 credits
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
