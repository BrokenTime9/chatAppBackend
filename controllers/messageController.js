const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");
const { notifyRecipient } = require("../utils/websocket");

const message = async (req, res) => {
  const { content, chatId } = req.body;
  const owner = await req.user.userId;

  try {
    if (!content || !chatId || !owner) {
      res.status(400);
    }

    const newMessage = new Message({
      content,
      chatId,
      owner,
    });

    await newMessage.save();

    res.status(201);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(401);
    }

    const messages = await Message.find({ chatId })
      .select("-_id content owner timestamp ")
      .populate("owner", "username");

    res.status(200).json(messages || [{ content: "no messges yet" }]);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};

module.exports = { message, getMessages };
