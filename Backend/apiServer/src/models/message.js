import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: String,
  },
  textMessages: {
    required: true,
    type: String,
  },
  timePosting: {
    required: Date,
    type: Date.now,
  },
  frand: {
    required: true,
    type: String,
  },
});

export default mongoose.model("Messages", messageSchema);
