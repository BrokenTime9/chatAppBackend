const WebSocket = require("ws");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");

let clients = {};

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async (ws, req) => {
    console.log("New WebSocket connection");

    if (!req.headers.cookie) {
      console.log("No cookie found");
      ws.close();
      return;
    }

    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies["token"];

    if (!token) {
      console.log("No token found in cookies");
      ws.close();
      return;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const url = new URL(req.url, `http://${req.headers.host}`);
      const chatId = url.searchParams.get("chatId");

      if (!chatId) {
        console.log("No chatId provided");
        ws.close();
        return;
      }

      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.log("Chat not found");
        ws.close();
        return;
      }

      if (![chat.owner1.toString(), chat.owner2.toString()].includes(userId)) {
        console.log("User is not a part of this chat");
        ws.close();
        return;
      }
      if (!clients[chatId]) {
        clients[chatId] = [];
      }
      clients[chatId].push(ws);
      console.log(`User ${userId} connected to chat ${chatId} via WebSocket`);

      ws.on("message", (message) => {
        const messageData = JSON.parse(message);
        console.log("message receiver", messageData);

        if (clients[chatId] && clients[chatId].length > 0) {
          console.log("sending message");
          clients[chatId].forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(messageData));
            }
          });
        }
      });

      ws.on("close", () => {
        console.log(`user ${userId} disconnected from ${chatId} disconnected`);
        clients[chatId] = clients[chatId].filter((client) => client !== ws);
        if (clients[chatId].length === 0) {
          delete clients[chatId];
        }
      });
    } catch (e) {
      console.error("Invalid token:", e);
      ws.close();
    }
  });
};

module.exports = { setupWebSocket };
