'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [fieldLocks, setFieldLocks] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [currentTripId, setCurrentTripId] = useState(null);
  
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const typingTimeoutsRef = useRef({});

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      toast.success('Connected to collaboration server');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
      setParticipants([]);
      setFieldLocks({});
      setTypingUsers({});
      
      if (reason === 'io server disconnect') {
        // Server disconnected, need to reconnect manually
        newSocket.connect();
      }
      
      toast.error('Disconnected from collaboration server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      reconnectAttemptsRef.current++;
      
      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        toast.error('Failed to connect to collaboration server');
      }
    });

    // Trip collaboration events
    newSocket.on('user-joined', (data) => {
      setParticipants(prev => {
        const exists = prev.some(p => p.userId === data.user.userId);
        if (!exists) {
          return [...prev, {
            socketId: data.socketId,
            userId: data.user.userId,
            name: data.user.name,
            avatar: data.user.avatar
          }];
        }
        return prev;
      });
      
      toast.success(`${data.user.name} joined the trip`);
    });

    newSocket.on('user-left', (data) => {
      setParticipants(prev => prev.filter(p => p.userId !== data.user.userId));
      toast(`${data.user.name} left the trip`, { icon: '👋' });
    });

    newSocket.on('room-participants', (data) => {
      setParticipants(data);
    });

    // Field locking events
    newSocket.on('field-locked', (data) => {
      setFieldLocks(prev => ({
        ...prev,
        [data.fieldPath]: data.lockedBy
      }));
    });

    newSocket.on('field-unlocked', (data) => {
      setFieldLocks(prev => {
        const updated = { ...prev };
        delete updated[data.fieldPath];
        return updated;
      });
    });

    newSocket.on('lock-denied', (data) => {
      toast.error(`Field is being edited by ${data.lockedBy.userName}`);
    });

    newSocket.on('current-locks', (locks) => {
      const lockMap = {};
      locks.forEach(lock => {
        lockMap[lock.fieldPath] = {
          userId: lock.userId,
          userName: lock.userName,
          lockedAt: lock.lockedAt,
          expiresAt: lock.expiresAt
        };
      });
      setFieldLocks(lockMap);
    });

    // Typing indicators
    newSocket.on('user-typing', (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.fieldPath]: {
          ...prev[data.fieldPath],
          [data.user.userId]: {
            name: data.user.name,
            timestamp: data.timestamp
          }
        }
      }));

      // Clear typing indicator after 3 seconds
      if (typingTimeoutsRef.current[`${data.fieldPath}-${data.user.userId}`]) {
        clearTimeout(typingTimeoutsRef.current[`${data.fieldPath}-${data.user.userId}`]);
      }

      typingTimeoutsRef.current[`${data.fieldPath}-${data.user.userId}`] = setTimeout(() => {
        setTypingUsers(prev => {
          const updated = { ...prev };
          if (updated[data.fieldPath]) {
            delete updated[data.fieldPath][data.user.userId];
            if (Object.keys(updated[data.fieldPath]).length === 0) {
              delete updated[data.fieldPath];
            }
          }
          return updated;
        });
      }, 3000);
    });

    newSocket.on('user-stopped-typing', (data) => {
      setTypingUsers(prev => {
        const updated = { ...prev };
        if (updated[data.fieldPath]) {
          delete updated[data.fieldPath][data.user.userId];
          if (Object.keys(updated[data.fieldPath]).length === 0) {
            delete updated[data.fieldPath];
          }
        }
        return updated;
      });

      if (typingTimeoutsRef.current[`${data.fieldPath}-${data.user.userId}`]) {
        clearTimeout(typingTimeoutsRef.current[`${data.fieldPath}-${data.user.userId}`]);
        delete typingTimeoutsRef.current[`${data.fieldPath}-${data.user.userId}`];
      }
    });

    // Error handling
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error(error.message || 'An error occurred');
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      
      // Clear all timeouts
      Object.values(typingTimeoutsRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, [user]);

  // Join a trip room
  const joinTrip = useCallback((tripId) => {
    if (!socket || !user || !tripId) return;

    const userData = {
      userId: user.id,
      name: user.fullName || `${user.firstName} ${user.lastName}`,
      email: user.primaryEmailAddress?.emailAddress,
      avatar: user.imageUrl
    };

    socket.emit('join-trip', { tripId, user: userData });
    setCurrentTripId(tripId);
  }, [socket, user]);

  // Leave current trip
  const leaveTrip = useCallback(() => {
    if (!socket || !currentTripId) return;
    
    socket.disconnect();
    setCurrentTripId(null);
    setParticipants([]);
    setFieldLocks({});
    setTypingUsers({});
  }, [socket, currentTripId]);

  // Lock a field for editing
  const lockField = useCallback((fieldPath) => {
    if (!socket || !currentTripId) return;
    socket.emit('lock-field', { fieldPath });
  }, [socket, currentTripId]);

  // Unlock a field
  const unlockField = useCallback((fieldPath) => {
    if (!socket || !currentTripId) return;
    socket.emit('unlock-field', { fieldPath });
  }, [socket, currentTripId]);

  // Send trip update
  const sendTripUpdate = useCallback((updateType, payload, version) => {
    if (!socket || !currentTripId) return;
    socket.emit('trip-update', { updateType, payload, version });
  }, [socket, currentTripId]);

  // Send note update
  const sendNoteUpdate = useCallback((noteId, content, action) => {
    if (!socket || !currentTripId) return;
    socket.emit('note-update', { noteId, content, action });
  }, [socket, currentTripId]);

  // Send expense update
  const sendExpenseUpdate = useCallback((expenseId, expense, action) => {
    if (!socket || !currentTripId) return;
    socket.emit('expense-update', { expenseId, expense, action });
  }, [socket, currentTripId]);

  // Typing indicators
  const startTyping = useCallback((fieldPath) => {
    if (!socket || !currentTripId) return;
    socket.emit('typing-start', { fieldPath });
  }, [socket, currentTripId]);

  const stopTyping = useCallback((fieldPath) => {
    if (!socket || !currentTripId) return;
    socket.emit('typing-stop', { fieldPath });
  }, [socket, currentTripId]);

  // Voice chat methods
  const sendVoiceOffer = useCallback((targetUserId, offer) => {
    if (!socket || !currentTripId) return;
    socket.emit('voice-offer', { targetUserId, offer });
  }, [socket, currentTripId]);

  const sendVoiceAnswer = useCallback((targetUserId, answer) => {
    if (!socket || !currentTripId) return;
    socket.emit('voice-answer', { targetUserId, answer });
  }, [socket, currentTripId]);

  const sendIceCandidate = useCallback((targetUserId, candidate) => {
    if (!socket || !currentTripId) return;
    socket.emit('ice-candidate', { targetUserId, candidate });
  }, [socket, currentTripId]);

  // Check if field is locked
  const isFieldLocked = useCallback((fieldPath) => {
    return fieldLocks[fieldPath] && fieldLocks[fieldPath].userId !== user?.id;
  }, [fieldLocks, user]);

  // Get field lock info
  const getFieldLock = useCallback((fieldPath) => {
    return fieldLocks[fieldPath];
  }, [fieldLocks]);

  // Get typing users for a field
  const getTypingUsers = useCallback((fieldPath) => {
    const fieldTyping = typingUsers[fieldPath] || {};
    return Object.values(fieldTyping).filter(u => u.name);
  }, [typingUsers]);

  const value = {
    socket,
    isConnected,
    participants,
    fieldLocks,
    typingUsers,
    currentTripId,
    
    // Methods
    joinTrip,
    leaveTrip,
    lockField,
    unlockField,
    sendTripUpdate,
    sendNoteUpdate,
    sendExpenseUpdate,
    startTyping,
    stopTyping,
    sendVoiceOffer,
    sendVoiceAnswer,
    sendIceCandidate,
    
    // Utilities
    isFieldLocked,
    getFieldLock,
    getTypingUsers
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}