import {Router} from 'express';
import { checkAuth, loginUser, logoutUser, signupUser, updateProfile } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';



const userRouter = Router();


userRouter.post("/signup", signupUser)
userRouter.post("/login", loginUser)
userRouter.post("/logout", verifyJWT, logoutUser)
userRouter.put(
    "/update-profile",
    verifyJWT,
    upload.single("avatar"),
    updateProfile
)
userRouter.get("/check", verifyJWT, checkAuth)

export default userRouter;