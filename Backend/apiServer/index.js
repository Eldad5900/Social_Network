import env from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

//routes
import { postsRouter } from "./src/routes/post.js";
import { usersRouter } from "./src/routes/users.js";
import { relationshipsRouter } from "./src/routes/relationships.js";
import { profileRouter } from "./src/routes/profile.js";
import { groupsRouter } from "./src/routes/groups.js";


env.config();

//CONNECT TO DB
const mongoString = process.env.DB_URL;

mongoose.connect(mongoString, () => console.log("API Connected to MongoDB"));
const db = mongoose.connection;
db.on("error", (error) => {
  console.log(error);
});

const app = express();
const PORT = 3003;

//MIDDLEWARE
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`API Server Started at http://localhost:${PORT}/`);
});

app.use("/api/posts", postsRouter);

app.use("/api/users", usersRouter);

app.use("/api/relationships", relationshipsRouter);

app.use("/api/profile", profileRouter);

app.use("/api/groups", groupsRouter);

