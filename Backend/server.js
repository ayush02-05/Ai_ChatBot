require("dotenv").config();
const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/services/ai.service");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log("A user Connected");

  socket.on("disconnect", () => {
    console.log("A User Disconnected");
  });

  socket.on("ai-message", async (data) => {
    console.log("client side prompt: ", data);
    const response = await generateResponse(data);
    socket.emit("ai-message-response", response);
  });
});

httpServer.listen(3000, () => {
  console.log("server is now successfully created ✅");
});
