import express, { json } from "express";
import { verifyAccessToken } from "../../../authServer/JWT/jwtHelper.js";
import User from "../models/user.js";

export const usersRouter = express.Router();

//GET ALL http://localhost:5000/api/questions/
usersRouter.get("/", async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET ONE http://localhost:5000/api/questions/{id}
usersRouter.get("/:id", async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//PATCH http://localhost:5000/api/questions/{id}
usersRouter.patch("/:id", verifyAccessToken, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await User.findByIdAndUpdate(id, updatedData, options);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//POST http://localhost:5000/api/questions/
usersRouter.post("/", async (req, res) => {
  const data = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    loginType: req.body.loginType,
    accessToken: req.body.accessToken,
    email: req.body.email,
    password: req.body.password,
    imageUrl: req.body.imageUrl,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//DELETE http://localhost:5000/api/questions/{id}
usersRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    res.status(204).send(`${data} deleted`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
