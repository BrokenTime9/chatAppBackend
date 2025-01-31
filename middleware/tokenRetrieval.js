const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  console.log("got to token retrieval");
  const token = await req.cookies.token;
  console.log("token", token);

  if (!token) {
    return res.status(404);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
    };
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "token is not valid" });
  }
};

module.exports = { authenticateToken };
