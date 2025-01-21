const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "user or password not found" });
  }

  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: "user exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hashedPassword,
      loginType: "local",
    });

    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 6 * 60 * 60 * 1000,
    });

    res.status(201).json({ redirectTo: "http://localhost:3000/dashboard" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const registerGoogleUser = async (req, res) => {
  const { email, name, googleId } = req.user;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedId = await bcrypt.hash(googleId, salt);

    user = new User({
      username: `${name}-${Date.now()}`,
      email,
      googleId: hashedId,
      loginType: "google",
    });

    await user.save();
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 6 * 60 * 60 * 1000,
    });

    res.redirect(`http://localhost:3000/dashboard`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "password incorrect" });

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 6 * 60 * 60 * 1000,
    });

    res.status(201).json({ redirectTo: "http://localhost:3000/dashboard" });
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
};

const loginGoogleUser = async (req, res) => {
  const { googleId, email } = req.user;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(googleId, user.googleId);
    if (!isMatch) return res.status(400).send({ msg: "Google Id incorrect" });

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 6 * 60 * 60 * 1000,
    });

    res.redirect(`http://localhost:3000/dashboard`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginGoogleUser,
  registerGoogleUser,
};
