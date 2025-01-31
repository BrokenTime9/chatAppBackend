const Chat = require("../models/Chat");
const User = require("../models/User");

// senders username + recipients username
const createChat = async (req, res) => {
  const { owner1, owner2 } = req.user;

  try {
    if (!owner1) {
      return res.status(400).json({ msg: "sender id incorrect" });
    }
    if (!owner2) {
      return res.status(400).json({ msg: "receipent id incorrect" });
    }

    const newChat = new Chat({
      owner1,
      owner2,
    });

    await newChat.save();

    res.status(201).json({ msg: "chat saved" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// token
// send chat id here remember that
const getChats = async (req, res) => {
  console.log("got to chats");
  try {
    const userId = req.user.userId;
    console.log(userId);

    const chats = await Chat.find({
      $or: [{ owner1: userId }, { owner2: userId }],
    }).populate("owner1 owner2", "username");

    res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
};

const getChat = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { chatId } = req.body;

    const user = await User.findOne({ userId });
    const chat = await User.findOne({ chatId });

    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).send("server error");
  }
};

module.exports = { createChat, getChat, getChats };
