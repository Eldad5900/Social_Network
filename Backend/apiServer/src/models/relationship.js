import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema({
  userId1: {
    required: true,
    type: String,
  },
  userId2: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
});

export default mongoose.model("Relationship", relationshipSchema);
