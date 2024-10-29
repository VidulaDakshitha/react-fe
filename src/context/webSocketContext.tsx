import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { remote_chat_url_v1 } from "../environment/environment";

// Define the type for the context value
interface WebSocketContextType {
  socket: ReconnectingWebSocket | null;
  messages: any;
}

// Create the context with the proper type
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

// Custom hook to listen for changes in local storage
const useLocalStorage = (key: string) => {
  const [storedValue, setStoredValue] = useState<string | null>(localStorage.getItem(key));

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(localStorage.getItem(key));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return storedValue;
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<ReconnectingWebSocket | null>(null);
  const [messages, setMessages] = useState<any>('');
  const chatId = useLocalStorage("chat_id");

  useEffect(() => {
    if (chatId) {
      const socketUrl = `${remote_chat_url_v1}ws/notifications/${chatId}/`;
      const ws = new ReconnectingWebSocket(socketUrl);

      ws.onopen = () => {
        console.log("WebSocket connection established.");
      };

      ws.onmessage = (message: MessageEvent) => {
        console.log("WebSocket message received:", message);
        setMessages(message);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      setSocket(ws);
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [chatId]); // Listen for changes in chatId

  return (
    <WebSocketContext.Provider value={{ socket, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
