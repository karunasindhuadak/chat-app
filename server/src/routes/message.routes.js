import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, getUserforSlidebar, markMessageAsSeen } from "../controllers/message.controller.js";



const messageRouter = Router() 



messageRouter.get("/users", verifyJWT, getUserforSlidebar)
messageRouter.get("/:id", verifyJWT, getMessages)
messageRouter.get("/mark/:id", verifyJWT, markMessageAsSeen)


export default messageRouter