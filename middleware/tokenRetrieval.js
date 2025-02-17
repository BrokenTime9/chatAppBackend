const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  const token = await req.cookies.token;
  if (!token) {
    return res.status(401).send("token not found");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
    };
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "invalid token" });
  }
};

module.exports = { authenticateToken };
