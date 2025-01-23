const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

const message = async (req, res) => {
  const { content, chatId } = req.body;
  const owner = await req.user.userId;
  try {
    if (!content || !chatId || !owner) {
      return res.status(400).send("content or chatId or owner not found");
    }

    const newMessage = new Message({
      content,
      chatId,
      owner,
    });

    await newMessage.save();
    res.status(200).json({ msg: "new msg" });
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).send("chat id not found");
    }

    const messages = await Message.find({ chatId })
      .select("-_id content owner timestamp ")
      .populate("owner", "username");

    res.status(200).json(messages || [{ content: "no messges yet" }]);
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
};

module.exports = { message, getMessages };
