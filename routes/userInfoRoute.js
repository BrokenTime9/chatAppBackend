const express = require("express");
const router = express.Router();
const { userInfo } = require("../controllers/userInfo");
const { authenticateToken } = require("../middleware/tokenRetrieval");

router.post("/user", authenticateToken, userInfo);

module.exports = router;
