import express from "express";
import env from "dotenv";
import User from "../../apiServer/src/models/user.js";
import { createJWT, verifyAccessToken } from "../JWT/jwtHelper.js";
import {
  loginValidation,
  resetPasswordValidation,
  signUpValidation,
} from "../validation/validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";

env.config();

export const authRouter = express.Router();

// Returns profile by JWT token
authRouter.get("/profile-by-token", verifyAccessToken, async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);
  res.status(200).json(user);
});

// Registers a new user
authRouter.post("/register", async (req, res) => {
  try {
    //VALIDATE USER
    const { error } = signUpValidation(req.body);
    if (error) {
      throw new Error(error.message);
    }

    const { email, password, firstName, lastName, imageUrl } = req.body;

    //VALIDATE UNIQUE EMAIL
    const userExists = await User.findOne({ email }).exec();
    if (userExists) {
      throw new Error("Email already taken!");
    }

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //SAVE USER IN DB
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      imageUrl,
    });

    const savedData = await user.save();

    //CREATE A JWT
    const token = createJWT(savedData);

    res.status(200).json({
      ok: true,
      message: "created a new user",
      user: savedData,
      accessToken: token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, ok: false });
  }
});

authRouter.post("/login", async (req, res) => {
  //VALIDATE CREDENTIALS
  try {
    const { email, password } = req.body;
    const { error } = loginValidation(req.body);
    if (error) {
      throw new Error(error.message);
    }

    //VALIDATE EMAIL
    const user = await User.findOne({ email }).exec();
    if (!user) {
      throw new Error("Wrong Email");
    }

    //VALIDATE PASSWORD
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      throw new Error("Wrong Password");
    }

    //CREATE ACCESS TOKEN
    const accessToken = createJWT(user);

    res.status(200).json({ ok: true, user, accessToken });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

authRouter.post("/social-login", async (req, res) => {
  try {
    const { email } = req.body;
    let existingUser = await User.findOne({ email });
    // USER NOT FOUND - CREATE NEW
    if (!existingUser) {
      const { firstName, lastName, imageUrl } = req.body;
      const user = new User({ firstName, lastName, imageUrl });
      // SAVE IN DB
      existingUser = await user.save();
    }
    // CREATE ACCESS TOKEN
    const accessToken = createJWT(existingUser);

    res.status(200).json({ ok: true, user: existingUser, accessToken });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

authRouter.post("/forgot-password", async (req, res, next) => {
  const { email } = req.body;
  try {
    //GET USER
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    //CREATE ONE TIME LINK - VALID FOR 15 MINUTES
    const secret = process.env.ACCESS_TOKEN_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "15m",
    });
    const link = `${process.env.CLIENT_URL}reset-password/${user._id}/${token}`;
    //SEND EMAIL
    await sendEmail(email, "reset password link for 'bunnies' website", link);

    res.status(200).json({ ok: true, message: "Reset link sent to email" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, message: error.message });
  }
});

authRouter.post("/reset-password/:userId/:token", async (req, res, next) => {
  const { userId, token } = req.params;
  const { password1, password2 } = req.body;
  try {
    //FIND USER
    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }
    // VERIFY TOKEN
    const secret = process.env.ACCESS_TOKEN_SECRET + user.password;
    jwt.verify(token, secret);
    // VALIDATE PASSWORDS
    const { error } = resetPasswordValidation({ password1, password2 });
    if (error) {
      throw new Error(error.message);
    }

    //UPDATE USER PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password1, salt);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Password Updated Succesfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});
