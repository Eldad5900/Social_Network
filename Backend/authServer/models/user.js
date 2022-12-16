import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
    min: 6,
    max: 1024,
  },
  email: {
    required: true,
    type: String,
    min: 6,
    max: 1024,
  },
  isAdmin: {
    required: true,
    type: Boolean,
    default: false,
  },
  imageUrl: {
    required: false,
    type: String,
  },
  workplace: {
    required: false,
    type: String,
  },
  bio: {
    required: false,
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  birthDate: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  education: {
    type: String,
    required: false,
  },
});

export default mongoose.model("User", userSchema);
