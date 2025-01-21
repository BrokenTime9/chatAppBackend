const express = require("express");
const router = express.Router();
const { message, getMessages } = require("../controllers/messageController");
const { authenticateToken } = require("../middleware/tokenRetrieval");

router.post("/message", authenticateToken, message);
router.get("/messages/:chatId", getMessages);

module.exports = router;
