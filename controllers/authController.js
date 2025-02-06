const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const prod = process.env.NODE_ENV === "production";

let url = [
  "http://localhost:3000/dashboard",
  "https://chat-app-zeta-roan.vercel.app/dashboard",
];

//#1 to change
const reUrl = url[1];

const registerUser = async (req, res) => {
  const origin = req.get("Origin");

  let redirectUrl = "http://localhost:3000/dashboard";
  if (origin && origin.includes("chat-app-zeta-roan.vercel.app")) {
    redirectUrl = "https://chat-app-zeta-roan.vercel.app/dashboard";
  }
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
      secure: prod,
      sameSite: prod ? "None" : "Lax",
      maxAge: 6 * 60 * 60 * 1000,
    });
    res.status(201).json({ redirectTo: redirectUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
const loginUser = async (req, res) => {
  const origin = req.get("Origin");

  let redirectUrl = "http://localhost:3000/dashboard";
  if (origin && origin.includes("chat-app-zeta-roan.vercel.app")) {
    redirectUrl = "https://chat-app-zeta-roan.vercel.app/dashboard";
  }
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
      secure: prod,
      sameSite: prod ? "None" : "Lax",
      maxAge: 6 * 60 * 60 * 1000,
    });

    res.status(201).json({ redirectTo: redirectUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
};

const loginGoogleUser = async (req, res) => {
  const { googleId, email, name } = req.user;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedId = await bcrypt.hash(googleId, salt);

      user = new User({
        username: `${name}-${Date.now()}`,
        email,
        googleId: hashedId,
        loginType: "google",
      });

      await user.save();
    }
    user = await User.findOne({ email });

    const isMatch = await bcrypt.compare(googleId, user.googleId);
    if (!isMatch) return res.status(400).send({ msg: "Google Id incorrect" });

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: prod,
      sameSite: prod ? "None" : "Lax",
      maxAge: 6 * 60 * 60 * 1000,
    });
    res.status(200).json({ redirectTo: reUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const logout = async (req, res) => {
  const origin = req.get("Origin");

  let redirectUrl = "http://localhost:3000";
  if (origin && origin.includes("chat-app-zeta-roan.vercel.app")) {
    redirectUrl = "https://chat-app-zeta-roan.vercel.app";
  }
  try {
    await res.clearCookie("token", {
      httpOnly: true,
      secure: prod,
      sameSite: prod ? "None" : "Lax",
    });

    res.status(200).json({ redirectTo: redirectUrl });
  } catch (e) {
    console.error(e);
  }
};

const checkLogin = async (req, res) => {
  const origin = req.get("Origin");

  let redirectUrl = "http://localhost:3000";
  if (origin && origin.includes("chat-app-zeta-roan.vercel.app")) {
    redirectUrl = "https://chat-app-zeta-roan.vercel.app";
  }
  try {
    const token = req.cookies.token;
    if (!token) return res.status(200).json({ redirectTo: redirectUrl });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginGoogleUser,
  logout,
  checkLogin,
};
