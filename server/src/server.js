import dotenv from 'dotenv';
dotenv.config({
    path:"./.env"
})
import server from './app.js';
import connectDB from './db/index.js';

const PORT = process.env.PORT || 5000;

//Connect to MongoDB and start the server
connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`\n Server is runing on port: ${PORT}`)
        })
    })
    .catch((error) => {
        console.error("MongoDB connection failed !! ", error)
    })