import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: String,
  },
  imageUrl: {
    required: false,
    type: String,
  },
  fileName: {
    required: false,
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  comments: {
    required: false,
    type: Array,
  },
  privacy: {
    type: String,
    default: "public",
  },
  likes: {
    required: false,
    type: Array,
  },
  location: {
    required: false,
    type: Object,
  },
  likes: {
    required: false,
    type: Array,
  },
  isComment: {
    type: Boolean,
    default: false,
  },
  tagged: {
    type: Array,
  },
  tags: {
    type: Array,
  },
  publishedBy: {
    type: String,
  },
  groupId: {
    required: false,
    type: String,
    default: "",
  },
});

export default mongoose.model("Post", postSchema);
