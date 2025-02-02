const User = require("../models/User");

const userExtraction = async (req, res, next) => {
  const owner1 = req.user.userId;
  const user = await req.body.owner2;

  if (!user) {
    return res.status(404).json({ msg: "no user found" });
  }
  try {
    const userId = await User.findOne({ username: user });
    if (!userId) {
      return res.status(404).json({ msg: "username" });
    }
    req.user = {
      owner1,
      owner2: userId._id,
    };
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "error caught in userExtraction" });
  }
};

module.exports = { userExtraction };
