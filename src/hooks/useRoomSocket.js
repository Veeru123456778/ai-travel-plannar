'use client';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '@clerk/nextjs';

export function useRoomSocket(roomId) {
  const socketRef = useRef(null);
  const { user, isLoaded } = useUser();
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    if (!roomId || !user || !isLoaded) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ['websocket'],
      auth: { userId: user.id, email: user.emailAddresses?.[0]?.emailAddress || '' },
    });

    socketRef.current = socket;

    const onConnect = () => {
      console.log('✅ Connected to Socket.IO');
      socket.emit('join-room', roomId);
      setSocketReady(true);
    };
    const onDisconnect = () => {
      console.log('❌ Disconnected from Socket.IO');
      setSocketReady(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [roomId, user, isLoaded]);

  const sendTripUpdate = (update) => {
    if (socketRef.current && socketReady) {
      socketRef.current.emit('trip-update', { roomId, data: update });
    }
  };
  const lockField = (key, lockedBy, userName) => {
    if (socketRef.current && socketReady) {
      socketRef.current.emit('lock-field', { roomId, key, lockedBy, userName });
    }
  };
  const unlockField = (key) => {
    if (socketRef.current && socketReady) {
      socketRef.current.emit('unlock-field', { roomId, key });
    }
  };

  return { socketRef, socketReady, sendTripUpdate, lockField, unlockField };
}
