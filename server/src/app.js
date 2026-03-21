import express from 'express';
import cors from 'cors';
import http from 'http';


//Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

//Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}))
app.use(express.json({limit: "10mb"}))



//routes import


//routes declaration

export default server;