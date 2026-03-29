import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import {io} from "socket.io-client"

const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl
axios.defaults.withCredentials = true

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem("token")) // here token -> access Token
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)

    // Check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const {data} = await axios.get("/api/auth/check")
            if(data.success) {
                setAuthUser(data.data.user)
                connectSocket(data.data.user)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Login function to handle user authentication and socket connection
    const login = async (state, credentials) => {
        try {
            const {data} = await axios.post(`/api/auth/${state}`, credentials)
            if(data.success) {
                setAuthUser(data.data.user)
                connectSocket(data.data.user)
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.data.accessToken}`
                setToken(data.data.accessToken)
                localStorage.setItem("token", data.data.accessToken)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Logout function to handle user logout and socket disconnection
    const logout = async () => {
        try {
           const {data} =  await axios.post("/api/auth/logout")
           if(data.success) {
            localStorage.removeItem("token")
            setToken(null)
            setAuthUser(null)
            setOnlineUsers([])
            delete axios.defaults.headers.common["Authorization"]
            toast.success(data.message)
            socket.disconnect()
           }else {
            toast.error(data.message)
           }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Update profile function to handle user profile updates
    const updateProfile = async (body) => {
        try {
            const {data} = await axios.put("/api/auth/update-profile", body);

            if (data.success) {
                setAuthUser(data.data.user);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
};

    // Connect socket function to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        })
        newSocket.connect()
        setSocket(newSocket)

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds)
        })
    }


    useEffect(() => {
        if(token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        checkAuth()

        return () => {
            socket?.disconnect()
        }
    }, [])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}