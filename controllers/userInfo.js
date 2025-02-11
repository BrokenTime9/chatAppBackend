const User = require("../models/User");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");

const userInfo = async (req, res) => {
  const userId = req.user.userId;
  if (req.body.oppUser) {
    try {
      const oppUser = req.body.oppUser;
      const user = await User.findById(oppUser).select(
        "-_id -password -googleId -loginType -createdAt",
      );
      if (!user) {
        res.status(404);
      }
      res.json(user);
    } catch (e) {
      console.error(e);
      res.status(500);
    }
  }

  try {
    const user = await User.findById(userId).select(
      "-_id -password -googleId -loginType -createdAt",
    );
    if (!user) {
      res.status(404).send("user not found");
    }

    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).send("server error");
  }
};

const getUsers = async (req, res) => {
  try {
    const userId = req.user.userId;
    let { username } = req.body;

    if (!username || typeof username !== "string") {
      username = ""; // Default to empty string to avoid errors
    }

    // Get existing chats where the user is involved
    const existingChats = await Chat.find({
      $or: [{ owner1: userId }, { owner2: userId }],
    });

    // Extract user IDs from existing chats
    const excludedUserIds = new Set(
      existingChats.flatMap((chat) => [
        chat.owner1.toString(),
        chat.owner2.toString(),
      ]),
    );

    // Find users matching the username but exclude those already in a chat
    const users = await User.find({
      _id: { $nin: [...excludedUserIds] }, // Exclude users already in a chat
      username: { $regex: `^${username}`, $options: "i" }, // Ensure it starts with the given text
    });

    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { userInfo, getUsers };
