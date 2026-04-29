import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url: string) => {
  const [wsMessage, setWsMessage] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => console.log(`Connected to WS: ${url}`);
    
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket Message Received:", data);
        setWsMessage(data);
      } catch (error) {
        console.error("Failed to parse WS message", error);
      }
    };

    ws.current.onclose = () => console.log(`Disconnected from WS: ${url}`);

    return () => {
      ws.current?.close();
    };
  }, [url]);

  return { wsMessage, ws: ws.current };
};
