import express from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';


//Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

//Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}))
app.use(express.json({limit: "10mb"}))
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))


//routes import
import userRouter from './routes/user.routes.js';


//routes declaration
app.use("/api/auth", userRouter)

export default server;