import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getUserforSlidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const messageRouter = Router();

messageRouter.get("/users", verifyJWT, getUserforSlidebar);
messageRouter.get("/:id", verifyJWT, getMessages);
messageRouter.put("/mark/:id", verifyJWT, markMessageAsSeen);
messageRouter.post("/send/:id", verifyJWT, upload.single("image"), sendMessage);

export default messageRouter;
