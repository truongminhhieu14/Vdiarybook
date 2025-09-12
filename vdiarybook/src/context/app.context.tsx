import { User } from "@/types/auth.type";
import { connectSocket, disconnectSocket } from "@/utils/socket";
import React, { createContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface AppContextInterface {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    socket: Socket | null
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>
}

const defaultValue: AppContextInterface = {
    user: null,
    setUser: () => null,
    isAuthenticated: false,
    setIsAuthenticated: () => null,
    socket: null,
    setSocket: () => null
}

export const AppContext = createContext<AppContextInterface>(defaultValue)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAuth = localStorage.getItem("isAuthenticated");

    if (storedUser && storedAuth === "true") {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => { 
    if(isAuthenticated && user && !socket) {
        const newSocket = connectSocket(user._id)
        newSocket.on('connect', () => {
            console.log('✅ Socket connected')
        })
        setSocket(newSocket);
        return () => {
            disconnectSocket()
            setSocket(null)
            console.log('❌ Socket disconnected');           
        }
    }

    if(!isAuthenticated && socket) {
        disconnectSocket()
        setSocket(null)
    }
  }, [isAuthenticated, user])

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        socket,
        setSocket
      }}
    >
      {children}
    </AppContext.Provider>
  )
}