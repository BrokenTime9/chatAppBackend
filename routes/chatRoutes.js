const express = require("express");
const router = express.Router();
const { createChat, getChats } = require("../controllers/chatController");
const { authenticateToken } = require("../middleware/tokenRetrieval");
const { userExtraction } = require("../middleware/userExtraction");

router.post("/chat", authenticateToken, userExtraction, createChat);
router.post("/getChats", authenticateToken, getChats);

module.exports = router;
