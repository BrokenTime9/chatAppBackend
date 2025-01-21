const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const auth = require("./routes/authRoutes");
const chat = require("./routes/chatRoutes");
const user = require("./routes/userInfoRoute");
const message = require("./routes/messageRoutes");
require("dotenv").config();

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/home", (req, res) => {
  res.send("chat app");
});

app.use("/api/auth", auth);
app.use("/api", user);
app.use("/api", chat);
app.use("/api", message);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port : ${PORT}`);
});
