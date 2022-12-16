import express from "express";
import { verifyAccessToken } from "../../../authServer/JWT/jwtHelper.js";
import Model from "../models/relationship.js";
import User from "../models/user.js";

export const relationshipsRouter = express.Router();

const options = { new: true };

//SEND FRIEND REQ
relationshipsRouter.patch(
  "/send-friend-request/:receiverId",
  verifyAccessToken,
  async (req, res) => {
    try {
      const { receiverId } = req.params;
      const { sender } = req.body;
      const receiver = await User.findById(receiverId);

      // UPDATE SENDER - REQUESTS SENT
      sender.requestsSent.push(receiverId);
      const updatedSender = await User.findByIdAndUpdate(
        sender._id,
        { requestsSent: sender.requestsSent },
        options
      );

      // UPDATE RECEIVER - REQUESTS RECEIVED
      receiver.requestsReceived.push(sender._id);
      await User.findByIdAndUpdate(receiverId, {
        requestsReceived: receiver.requestsReceived,
      });

      res.status(201).json({ user: updatedSender });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

//WITHDRAW FRIEND REQ
relationshipsRouter.patch(
  "/withdraw-friend-request/:receiverId",
  verifyAccessToken,
  async (req, res) => {
    try {
      const { receiverId } = req.params;
      const { sender } = req.body;
      const receiver = await User.findById(receiverId);

      //UPDATE SENDER - REQUESTS SENT
      const requestsSent = sender.requestsSent.filter(
        (req) => req.toString() !== receiverId.toString()
      );
      const updatedSender = await User.findByIdAndUpdate(
        sender._id,
        { requestsSent },
        options
      );

      //UPDATE RECEIVER - REQUESTS RECEIVED
      const requestsReceived = receiver.requestsReceived.filter(
        (req) => req.toString() !== sender._id.toString()
      );
      await User.findByIdAndUpdate(receiver._id, { requestsReceived });

      res.status(201).json({ user: updatedSender });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

//ACCEPT FRIEND REQ
relationshipsRouter.patch(
  "/accept-friend-request/:senderId",
  verifyAccessToken,
  async (req, res) => {
    try {
      const { senderId } = req.params;
      const { receiver } = req.body;
      const sender = await User.findById(senderId);

      //UPDATE SENDER - REQUESTS SENT, FRIENDS
      const requestsSent = sender.requestsSent.filter(
        (req) => req.toString() !== receiver._id.toString()
      );
      sender.friends.push(receiver._id);
      await User.findByIdAndUpdate(sender._id, {
        requestsSent,
        friends: sender.friends,
      });

      //UPDATE RECEIVER - REQUESTS RECEIVED, FRIENDS
      const requestsReceived = receiver.requestsReceived.filter(
        (req) => req.toString() !== senderId.toString()
      );
      receiver.friends.push(senderId);
      const updatedReceiver = await User.findByIdAndUpdate(receiver._id, {
        requestsReceived,
        friends: receiver.friends,
        options,
      });
      res.status(201).json({ user: updatedReceiver });
    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(error);
    }
  }
);

//REJECT FRIEND REQ
relationshipsRouter.patch(
  "/reject-friend-request/:senderId",
  verifyAccessToken,
  async (req, res) => {
    try {
      const { senderId } = req.params;
      const { receiver } = req.body;
      const sender = await User.findById(senderId);

      //UPDATE SENDER - REQUESTS SENT
      const requestsSent = sender.requestsSent.filter(
        (req) => req.toString() !== receiver._id.toString()
      );
      await User.findByIdAndUpdate(sender._id, { requestsSent });

      //UPDATE RECEIVER - REQUESTS RECEIVED, FRIENDS
      const requestsReceived = receiver.requestsReceived.filter(
        (req) => req.toString() !== senderId.toString()
      );
      const updatedReceiver = await User.findByIdAndUpdate(
        receiver._id,
        { requestsReceived },
        options
      );
      res.status(201).json({ user: updatedReceiver });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// REMOVE FRIEND
relationshipsRouter.patch(
  "/remove-friend",
  verifyAccessToken,
  async (req, res) => {
    try {
      const { id1, id2 } = req.body;
      const user1 = await User.findById(id1);
      const user2 = await User.findById(id2);

      //UPDATE USER1 - FRIENDS
      const friends1 = user1.friends.filter((f) => f !== id2);
      await User.findByIdAndUpdate(id1, { friends: friends1 });

      //UPDATE USER2 - FRIENDS
      const friends2 = user2.friends.filter((f) => f !== id1);
      await User.findByIdAndUpdate(id2, { friends: friends2 });

      res.status(201);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

//Block functions

relationshipsRouter.patch("/block-person/:receiverId", async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { sender } = req.body;
    const receiver = await User.findById(receiverId);

    // UPDATE SENDER - REQUESTS SENT
    sender.blocked.push(receiverId);
    const updatedSender = await User.findByIdAndUpdate(
      sender._id,
      { blocked: sender.blocked },
      options
    );

    // UPDATE RECEIVER - REQUESTS RECEIVED
    receiver.blockedBy.push(sender._id);
    await User.findByIdAndUpdate(receiverId, {
      blockedBy: receiver.blockedBy,
    });

    res.status(201).json({ user: updatedSender });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

relationshipsRouter.patch("/withdraw-block/:receiverId", async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { sender } = req.body;
    const receiver = await User.findById(receiverId);

    //UPDATE SENDER - REQUESTS SENT
    const blocked = sender.blocked.filter(
      (req) => req.toString() !== receiverId.toString()
    );
    const updatedSender = await User.findByIdAndUpdate(
      sender._id,
      { blocked },
      options
    );

    //UPDATE RECEIVER - REQUESTS RECEIVED
    const blockedBy = receiver.blockedBy.filter(
      (req) => req.toString() !== sender._id.toString()
    );
    await User.findByIdAndUpdate(receiver._id, { blockedBy: blockedBy });

    res.status(201).json({ user: updatedSender });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//GET FRIENDS
relationshipsRouter.get(
  "/get-users/:userId/:relationship",
  verifyAccessToken,
  async (req, res) => {
    try {
      const { userId, relationship } = req.params;
      const user = await User.findById(userId);
      const promises = user[relationship].map((id) => User.findById(id));
      const users = await Promise.all(promises);
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(error);
    }
  }
);

//GET FRIENDS
relationshipsRouter.get("/get-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const promises = user.friends.map((friendId) => {
      return User.findById(friendId);
    });
    const friends = await Promise.all(promises);
    res.status(200).json(friends);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Post Method
relationshipsRouter.post("/", async (req, res) => {
  console.log("hi" + req.body);
  const data = new Model({
    userId1: req.body.userId1,
    userId2: req.body.userId2,
    type: req.body.type,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
relationshipsRouter.get("/", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

//Get by ID Method
relationshipsRouter.get("/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
});

relationshipsRouter.get("/getBlocked/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const blocked = user.blocked?.map(async (block) => {
      return await User.findById(block);
    });
    const data = await Promise.all([...blocked]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

relationshipsRouter.get("/getBlockedBy/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const blocked = user.blockedBy?.map(async (block) => {
      return await User.findById(block);
    });
    const data = await Promise.all([...blocked]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// relationshipsRouter.get("/getBlocked/:userId", async (req, res) => {
//   try {
//     const data = await Model.find({
//       userId1: req.params.userId,
//       type: "blocked",
//     });
//     const data2 = await Model.find({
//       userId2: req.params.userId,
//       type: "blocked",
//     });
//     const blocked = data.map(async (r) => {
//       const user = await User.findById(r.userId2);
//       const block = { id: r._id, blocked: user };
//       return block;
//     });
//     const blocked2 = data2.map(async (r) => {
//       const user = await User.findById(r.userId1);
//       const block = { id: r._id, blocked: user };
//       return block;
//     });
//     const all = await Promise.all([...blocked, ...blocked2]);
//     res.json(all);
//   } catch (error) {
//     res.send(500).json({ message: error.message });
//   }
// });

// relationshipsRouter.get("/getBlockedByYou/:userId", async (req, res) => {
//   try {
//     const data = await Model.find({
//       userId1: req.params.userId,
//       type: "blocked",
//     });
//     const blocked = data.map(async (r) => {
//       const user = await User.findById(r.userId2);
//       const block = { id: r._id, blocked: user };
//       return block;
//     });
//     const all = await Promise.all([...blocked]);
//     res.json(all);
//   } catch (error) {
//     res.send(500).json({ message: error.message });
//   }
// });

// relationshipsRouter.get("/getRelevantUsers/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const allUsers = await User.find();
//     const allRelationships = await Model.find({
//       $or: [{ userId1: userId }, { userId2: userId }],
//     });
//     const all = allUsers.map((element) => {
//       const monker = allRelationships.find((u) => {
//         const id = element._id.toString();
//         return u.userId1 === id || u.userId2 === id;
//       });
//       if (!monker) return element;
//     });
//     res.json(all);
//   } catch (error) {
//     res.send(600).json({ message: error.message });
//   }
// });

// relationshipsRouter.get("/getRequested/:userId", async (req, res) => {
//   try {
//     const data = await Model.find({
//       userId2: req.params.userId,
//       type: "request",
//     });
//     const requested = data.map(async (r) => {
//       const user = await User.findById(r.userId2);
//       const request = { req: r, requested: user };
//       return request;
//     });
//     const all = await Promise.all([...requested]);
//     res.json(all);
//   } catch (error) {
//     res.send(500).json({ message: error.message });
//   }
// });

// relationshipsRouter.patch("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const updatedData = req.body;
//     const options = { new: true };
//     const result = await Model.findByIdAndUpdate(id, updatedData, options);
//     res.send(result);
//   } catch (error) {
//     res.send(400).json({ message: error.message });
//   }
// });
