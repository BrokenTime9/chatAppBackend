const User = require("../models/User");

const userInfo = async (req, res) => {
  const userId = req.user.userId;
  if (req.body.oppUser) {
    try {
      const oppUser = req.body.oppUser;
      const user = await User.findById(oppUser).select(
        "-_id -password -googleId -loginType -createdAt",
      );
      if (!user) {
        res.status(404);
      }
      res.json(user);
    } catch (e) {
      console.error(e);
      res.status(500);
    }
  }

  try {
    const user = await User.findById(userId).select(
      "-_id -password -googleId -loginType -createdAt",
    );
    if (!user) {
      res.status(404).send("user not found");
    }

    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).send("server error");
  }
};

module.exports = { userInfo };
