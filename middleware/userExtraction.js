const User = require("../models/User");

const userExtraction = async (req, res, next) => {
  const owner1 = req.user.userId;
  const user = await req.body.owner2;

  if (!user) {
    return res.status(401).json({ msg: "no user found" });
  }
  try {
    const userId = await User.findOne({ username: user });
    req.user = {
      owner1,
      owner2: userId._id,
    };
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "error caught in userExtraction" });
  }
};

module.exports = { userExtraction };
