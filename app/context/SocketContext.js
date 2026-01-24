import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const { token, user } = useAuth();

    useEffect(() => {
        // Only connect if user is authenticated
        if (!token || !user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setConnected(false);
            }
            return;
        }

        // Get base URL - ensure we connect to root, not /api
        const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.1:5000";
        // Strip trailing slash and trailing /api if present
        const socketURL = baseURL.replace(/\/$/, "").replace(/\/api$/, "");

        console.log("🔌 Connecting to Socket.io:", socketURL);

        // Create socket connection
        const newSocket = io(socketURL, {
            auth: {
                token: token,
            },
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on("connect", () => {
            console.log("✅ Socket.io connected", newSocket.id);
            setConnected(true);
        });

        newSocket.on("connect_error", (err) => {
            console.error("❌ Socket connection error:", err.message);
            // alert(`Chat connection error: ${err.message}`);
        });

        newSocket.on("disconnect", () => {
            console.log("❌ Socket.io disconnected");
            setConnected(false);
        });

        newSocket.on("error", (error) => {
            console.error("Socket.io error:", error);
        });

        setSocket(newSocket);

        // Cleanup on unmount or token change
        return () => {
            console.log("🔌 Disconnecting Socket.io");
            newSocket.disconnect();
        };
    }, [token, user]);

    const value = {
        socket,
        connected,
    };

    return (
        <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
    );
};
