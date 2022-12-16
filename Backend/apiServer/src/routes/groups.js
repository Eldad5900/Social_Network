import express from "express";
import Group from "../models/group.js";
import User from "../models/user.js";
import Post from "../models/post.js";
export const groupsRouter = express.Router();

//Post Method
groupsRouter.post("/", async (req, res) => {
  const data = new Group({
    name: req.body.name,
    creator: req.body.creator,
    privacy: req.body.privacy,
    memebers: req.body.memebers,
    admins: req.body.admins,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
groupsRouter.get("/", async (req, res) => {
  try {
    const data = await Group.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
groupsRouter.get("/getById/:id", async (req, res) => {
  try {
    const data = await Group.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

groupsRouter.get("/getPublic", async (req, res) => {
  try {
    const data = await Group.find({ privacy: "public" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

groupsRouter.get("/getAllInformation/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    const members = group.memebers?.map(async (request) => {
      return await User.findById(request);
    });
    const requests = group.requests?.map(async (request) => {
      return await User.findById(request);
    });
    const posts = group.posts?.map(async (post) => {
      return await Post.findById(post);
    });
    const admins = group.admins?.map(async (admins) => {
      return await User.findById(admins);
    });
    const dataMembers = await Promise.all([...members]);
    const dataAdmins = await Promise.all([...admins]);
    const dataPosts = await Promise.all([...posts]);
    const dataRequests = await Promise.all([...requests]);

    const ret = { dataMembers, dataAdmins, dataPosts, dataRequests, group };
    res.status(200).json(ret);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
groupsRouter.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await Group.findByIdAndUpdate(id, updatedData, options);
    res.status.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
groupsRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Group.findByIdAndDelete(id);
    res.status(204).send(`${data} deleted`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

groupsRouter.patch("/requestToJoin/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { sender } = req.body;
    const group = await Group.findById(groupId);

    // UPDATE RECEIVER - REQUESTS RECEIVED

    group.requests.push(sender._id);
    await Group.findByIdAndUpdate(
      groupId,
      { requests: group.requests },
      { new: true }
    );

    res.status(201);
  } catch (error) {
    res.status(400).json(error);
  }
});

groupsRouter.patch("/acceptJoinRequest/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    const { request } = req.body;
    const group = await Group.findById(groupId);

    const groupReq = group.requests?.filter(
      (x) => x.toString() !== request._id.toString()
    );
    group.memebers.push(request._id.toString());
    await Group.findByIdAndUpdate(groupId, {
      requests: groupReq,
      memebers: group.memebers,
    });

    res.status(201);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

groupsRouter.patch("/cancelRequest/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { sender } = req.body;
    const group = await Group.findById(groupId);

    // UPDATE RECEIVER - REQUESTS RECEIVED
    const groupReq = group.requests.filter(
      (x) => x.toString() !== sender._id.toString()
    );
    await Group.findByIdAndUpdate(groupId, {
      requests: [...groupReq],
    });

    res.status(201);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

groupsRouter.patch("/leaveGroup/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { sender } = req.body;
    const group = await Group.findById(groupId);

    // UPDATE RECEIVER - REQUESTS RECEIVED
    const groupMeb = group.members.filter(
      (x) => x.toString() !== sender._id.toString()
    );
    const groupAdm = group.admins.filter(
      (x) => x.toString() !== sender._id.toString()
    );
    await Group.findByIdAndUpdate(groupId, {
      requests: [...groupMeb],
      admins: [...groupAdm],
    });

    res.status(201);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

groupsRouter.patch("/removeAdmin/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { sender } = req.body;
    const group = await Group.findById(groupId);

    const admins = group.admins.filter(
      (x) => sender._id.toString() !== x.toString()
    );
    await Group.findByIdAndUpdate(groupId, {
      admins: admins,
    });
    res.status(201);
  } catch (error) {
    res.status(400).json(error);
  }
});

groupsRouter.patch("/makeAdmin/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { sender } = req.body;
    const group = await Group.findById(groupId);

    // UPDATE RECEIVER - REQUESTS RECEIVED

    group.admins.push(sender._id);
    await Group.findByIdAndUpdate(groupId, {
      admins: group.admins,
    });

    res.status(201);
  } catch (error) {
    res.status(400).json(error);
  }
});

groupsRouter.patch("/addPost/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { post } = req.body;
    const group = await Model.findById(groupId);

    // UPDATE RECEIVER - REQUESTS RECEIVED

    group.posts.push(post._id);
    await Model.findByIdAndUpdate(groupId, {
      posts: group.posts,
    });

    res.status(201);
  } catch (error) {
    res.status(400).json(error);
  }
});
