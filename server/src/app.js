import express from "express";
import cors from "cors";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

//Create Express app and HTTP server
const app = express();
const httpServer = createServer(app);

//Initialize Socket.IO server
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

//Store online users
export const userSocketMap = {}; // {userId: socketId}

//Handle Socket.IO connections
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected: ", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  //Emit the list of online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  //Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected: ", userId);

    //Remove user from online users map
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//Middleware setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//routes import
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";

//routes declaration
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

export default httpServer;
