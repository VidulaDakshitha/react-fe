import { useEffect, useRef, useState } from 'react';

const useChatWebSocket = (url: string, selectedRoom: string) => {
  const [userMessages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    if (selectedRoom) {
      const websocket = new WebSocket(url);

      websocket.onopen = () => {
        console.log('WebSocket connection opened');
      };

      websocket.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      };

      websocket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      wsRef.current = websocket;
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, selectedRoom]);

  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const chatMsg = {
            message: message,
          };
          wsRef.current.send(JSON.stringify(chatMsg));
    }
  };

  return { userMessages, sendMessage };
};

export default useChatWebSocket;
