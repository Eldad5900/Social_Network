import express from "express";
import { verifyAccessToken } from "../../../authServer/JWT/jwtHelper.js";
import Post from "../models/message.js";

export const messagRouter = express.Router();

//Post Method
messagRouter.post("/", verifyAccessToken, async (req, res) => {
  const data = new messag({
    userId: req.body.userId,
    textMessages: req.body.content,
    timePosting: req.body.timePosting,
    groupId: req.body.groupId,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
messagRouter.get("/", async (req, res) => {
  try {
    const data = await Post.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
messagRouter.get("/:id", async (req, res) => {
  try {
    const data = await Post.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

messagRouter.get("/getPostsByUser/:userId", async (req, res) => {
  try {
    const data = await Post.find({ userId: req.params.userId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
messagRouter.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await Post.findByIdAndUpdate(id, updatedData, options);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
messagRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Post.findByIdAndDelete(id);
    res.status(204).send(`${data} deleted`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
