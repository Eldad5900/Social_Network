import express from "express";
import { verifyAccessToken } from "../../../authServer/JWT/jwtHelper.js";
import Post from "../models/post.js";
import user from "../models/user.js";

export const postsRouter = express.Router();

//Post Method
postsRouter.post("/", verifyAccessToken, async (req, res) => {
  const data = new Post({
    content: req.body.content,
    userId: req.body.userId,
    imageUrl: req.body.imageUrl,
    fileName: req.body.fileName,
    privacy: req.body.privacy,
    location: req.body.location,
    tagged: req.body.tagged,
    tags: req.body.tags,
    publishedBy: req.body.publishedBy,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
postsRouter.get("/", async (req, res) => {
  try {
    const data = await Post.find();
    res.status(200).json(data.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

postsRouter.get("/withoutBlocked", async (req, res) => {
  try {
    const currUser = req.body._id;
    const data = await Post.find();
    const posters = data.forEach((element) => {
      return user.findById(element.userId);
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
postsRouter.get("/:id", async (req, res) => {
  try {
    const data = await Post.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

postsRouter.get("/get-posts-by-user/:userId", async (req, res) => {
  try {
    const data = await Post.find({ userId: req.params.userId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
postsRouter.patch("/:id", verifyAccessToken, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    console.log(updatedData);
    const options = { new: true };
    const result = await Post.findByIdAndUpdate(id, updatedData, options);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
postsRouter.delete("/:id", verifyAccessToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Post.findByIdAndDelete(id);
    res.status(204).send(`${data} deleted`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
