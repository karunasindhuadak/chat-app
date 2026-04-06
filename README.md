# Zync — Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack and Socket.IO.
Users can sign up, log in, send text & image messages in real time, update their
profile, and see online/offline status of other users.

## 🖥️ Live Demo

[Click here](https://chat-app-snowy-eight-97.vercel.app)

## ✨ Features

- 🔐 JWT-based Authentication (signup, login, logout)
- 💬 Real-time messaging with Socket.IO
- 🖼️ Image sharing via Cloudinary
- 👤 Profile management with avatar upload
- 🟢 Online/Offline user status indicators
- 📱 Fully responsive (mobile + desktop)
- 🎨 Modern glassmorphism UI with custom SVG backgrounds

## 🛠️ Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Frontend   | React 19, Vite, TailwindCSS 4, React Router 7 |
| Backend    | Node.js, Express 5, Socket.IO                 |
| Database   | MongoDB (Mongoose 9)                          |
| Auth       | JWT, bcrypt                                   |
| File Store | Cloudinary + Multer                           |
| Deployment | Vercel (frontend) + Render (backend)          |

## 📁 Project Structure

├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # ChatContainer, Sidebar, RightSidebar
│ │ ├── context/ # AuthContext, ChatContext
│ │ ├── pages/ # HomePage, LoginPage, ProfilePage
│ │ └── lib/ # Utility functions
│ └── ...
├── server/ # Express backend
│ ├── src/
│ │ ├── controllers/ # User & Message controllers
│ │ ├── models/ # User & Message Mongoose models
│ │ ├── middlewares/ # Auth & multer middlewares
│ │ ├── routes/ # API routes
│ │ └── utils/ # ApiError, ApiResponse, Cloudinary, asyncHandler
│ └── ...

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account
- Cloudinary account

### Installation

# Clone the repository

git clone https://github.com/karunasindhuadak/chat-app.git
cd chat-app

# Install server dependencies

cd server && npm install

# Install client dependencies

cd ../client && npm install

### Environment Variables

#### Server (.env)

PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

#### Client (.env)

VITE_API_URL=http://localhost:5000

### Run Locally

# Start backend

cd server && npm run dev

# Start frontend (in a new terminal)

cd client && npm run dev

## 📸 Screenshots

![alt text](<WhatsApp Image 2026-04-06 at 12.20.29 PM.jpeg>)
![alt text](<WhatsApp Image 2026-04-06 at 12.22.01 PM.jpeg>)
![alt text](<WhatsApp Image 2026-04-06 at 12.22.35 PM.jpeg>)

## 🤝 Connect with Me

- LinkedIn: [https://www.linkedin.com/in/karunasindhu-adak-7a63b3260/]
- GitHub: [https://github.com/karunasindhuadak]

## 📄 License

MIT
