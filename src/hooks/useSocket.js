// hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useNotification } from '@/context/NotificationContext';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { userId } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!userId) return;

    const socket = new WebSocket('ws://localhost:5000');
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'register', userId }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'notification') {
        addNotification(msg.data);
      }
    };

    socket.onclose = () => {
      console.log("Socket disconnected");
    };

    return () => socket.close();
  }, [userId]);

  return socketRef;
};
