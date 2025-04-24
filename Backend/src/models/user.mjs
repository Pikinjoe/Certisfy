import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photoUrl: { type: String, default: "" },
}, {
  timestamps: true,
});

export default mongoose.model("User", userSchema);
