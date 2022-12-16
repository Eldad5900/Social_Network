import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: String,
  },
  postId: {
    required: true,
    type: String,
  },
});

export default mongoose.model("Like", likeSchema);
