import express, { json } from "express";
import Model from "../models/like.js";

const likesRouter = express.Router();

likesRouter.get("/", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

//GET ONE http://localhost:5000/api/questions/{id}
likesRouter.get("/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

likesRouter.get("/getAllLikesPostsByUser/:userId", async (req, res) => {
    try {
      const data = await Model.find({userId : req.params.userId});
      res.json(data);
    } catch (error) {
      res.send(500).json({ message: error.message });
    }
  });

  likesRouter.get("/getPostsLikes/:postId", async (req, res) => {
    try {
      const data = await Model.find({postId : req.params.postId});
      res.json(data);
    } catch (error) {
      res.send(500).json({ message: error.message });
    }
  });


//POST http://localhost:5000/api/questions/
likesRouter.post("/", async (req, res) => {
  const data = new Model({
    userId : req.body.userId,
    postId: req.body.postId,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//DELETE http://localhost:5000/api/questions/{id}
likesRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`${data} deleted`);
  } catch (error) {
    res.send(400).json({ message: error.message });
  }
});