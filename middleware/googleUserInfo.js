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

const handleGoogleCallback = async (code, state, url) => {
  const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
  console.log("url in googlecallback", url);

  try {
    const response = await axios.post(GOOGLE_TOKEN_URL, {
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${url}/api/auth/google${state}`,
      grant_type: "authorization_code",
    });

    return response.data;
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return null;
  }
};

const googleAuthMiddleware = async (req, res, next) => {
  console.log("got to google middleware");
  const origin = req.get("Origin");

  let url = "http://localhost:5000";
  if (origin && origin.includes("chat-app-zeta-roan.vercel.app")) {
    url = "https://chatappbackend-omj2.onrender.com";
  }
  try {
    const { state } = req.query;
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ msg: "Authorization code is required" });
    }

    console.log("url before googlecallback", url);
    const tokenData = await handleGoogleCallback(code, state, url);
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
