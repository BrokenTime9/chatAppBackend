//treehouse 286 -35
const express = require("express");
const router = express.Router();
const { googleAuthMiddleware } = require("../middleware/googleUserInfo");
const {
  registerUser,
  loginUser,
  registerGoogleUser,
  loginGoogleUser,
  logout,
  checkLogin,
} = require("../controllers/authController.js");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/googleregister", googleAuthMiddleware, registerGoogleUser);

router.post("/googlelogin", googleAuthMiddleware, loginGoogleUser);

router.post("/logout", logout);
router.post("/checkLogin", checkLogin);

module.exports = router;
