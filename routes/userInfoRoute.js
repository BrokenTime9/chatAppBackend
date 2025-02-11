const express = require("express");
const router = express.Router();
const { userInfo, getUsers } = require("../controllers/userInfo");
const { authenticateToken } = require("../middleware/tokenRetrieval");

router.post("/user", authenticateToken, userInfo);
router.get("/users", getUsers);

module.exports = router;
