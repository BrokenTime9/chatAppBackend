const { JsonWebTokenError } = require("jsonwebtoken");
const axios = require("axios");

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

const handleGoogleCallback = async (code, state) => {
  const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

  try {
    const response = await axios.post(GOOGLE_TOKEN_URL, {
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `http://localhost:5000/api/auth/google${state}`,
      grant_type: "authorization_code",
    });

    return response.data;
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return null;
  }
};

const googleAuthMiddleware = async (req, res, next) => {
  try {
    const { state } = req.query;
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ msg: "Authorization code is required" });
    }

    const tokenData = await handleGoogleCallback(code, state);
    if (!tokenData || !tokenData.id_token) {
      return res
        .status(400)
        .json({ msg: "Failed to retrieve tokens from Google" });
    }

    const userInfo = parseJwt(tokenData.id_token);
    if (!userInfo) {
      return res.status(400).json({ msg: "Failed to parse ID token" });
    }

    req.user = {
      email: userInfo.email,
      name: userInfo.name,
      googleId: userInfo.sub,
    };

    next();
  } catch (error) {
    console.error("Error during Google OAuth:", error);
    res.status(500).send("Authentication failed");
  }
};

module.exports = { googleAuthMiddleware };
