const express = require("express");
const router = express.Router();
const { userInfo, getUsers } = require("../controllers/userInfo");
const { authenticateToken } = require("../middleware/tokenRetrieval");

router.post("/user", authenticateToken, userInfo);
router.post("/users", authenticateToken, getUsers);

module.exports = router;
