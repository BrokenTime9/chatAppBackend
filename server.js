const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { setupWebSocket } = require("./utils/websocket");
const auth = require("./routes/authRoutes");
const chat = require("./routes/chatRoutes");
const user = require("./routes/userInfoRoute");
const message = require("./routes/messageRoutes");

require("dotenv").config();

connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(
  cors({
    origin: ["https://chat-app-zeta-roan.vercel.app", "http://localhost:3000"],
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

setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`server is running on port : ${PORT}`);
});
