const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store active rooms and user connections
const activeRooms = new Map();
const userConnections = new Map();
const fieldLocks = new Map(); // tripId -> fieldPath -> lockInfo

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a trip room
  socket.on('join-trip', (data) => {
    const { tripId, user } = data;
    
    if (!tripId || !user) {
      socket.emit('error', { message: 'Trip ID and user data required' });
      return;
    }

    socket.join(tripId);
    socket.tripId = tripId;
    socket.user = user;

    // Track user connection
    userConnections.set(socket.id, { tripId, user, joinedAt: new Date() });

    // Update room participants
    if (!activeRooms.has(tripId)) {
      activeRooms.set(tripId, new Set());
    }
    activeRooms.get(tripId).add({
      socketId: socket.id,
      userId: user.userId,
      name: user.name,
      avatar: user.avatar
    });

    // Notify others in the room
    socket.to(tripId).emit('user-joined', {
      user: user,
      timestamp: new Date()
    });

    // Send current participants to the joining user
    const participants = Array.from(activeRooms.get(tripId));
    socket.emit('room-participants', participants);

    // Send current field locks
    const tripLocks = Array.from(fieldLocks.entries())
      .filter(([key]) => key.startsWith(tripId))
      .map(([key, lock]) => ({
        fieldPath: key.replace(`${tripId}:`, ''),
        ...lock
      }));
    socket.emit('current-locks', tripLocks);

    console.log(`User ${user.name} joined trip ${tripId}`);
  });

  // Handle field locking
  socket.on('lock-field', (data) => {
    const { fieldPath } = data;
    const { tripId, user } = userConnections.get(socket.id) || {};
    
    if (!tripId || !user || !fieldPath) {
      socket.emit('error', { message: 'Invalid lock request' });
      return;
    }

    const lockKey = `${tripId}:${fieldPath}`;
    const existingLock = fieldLocks.get(lockKey);

    // Check if field is already locked by someone else
    if (existingLock && existingLock.userId !== user.userId) {
      socket.emit('lock-denied', {
        fieldPath,
        lockedBy: existingLock
      });
      return;
    }

    // Create or update lock
    const lockInfo = {
      userId: user.userId,
      userName: user.name,
      socketId: socket.id,
      lockedAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    };

    fieldLocks.set(lockKey, lockInfo);

    // Notify all users in the trip
    io.to(tripId).emit('field-locked', {
      fieldPath,
      lockedBy: lockInfo
    });

    // Set auto-unlock timer
    setTimeout(() => {
      const currentLock = fieldLocks.get(lockKey);
      if (currentLock && currentLock.socketId === socket.id) {
        fieldLocks.delete(lockKey);
        io.to(tripId).emit('field-unlocked', { fieldPath });
      }
    }, 5 * 60 * 1000);

    console.log(`Field ${fieldPath} locked by ${user.name} in trip ${tripId}`);
  });

  // Handle field unlocking
  socket.on('unlock-field', (data) => {
    const { fieldPath } = data;
    const { tripId, user } = userConnections.get(socket.id) || {};
    
    if (!tripId || !user || !fieldPath) {
      socket.emit('error', { message: 'Invalid unlock request' });
      return;
    }

    const lockKey = `${tripId}:${fieldPath}`;
    const existingLock = fieldLocks.get(lockKey);

    // Only allow unlocking if user owns the lock
    if (existingLock && existingLock.userId === user.userId) {
      fieldLocks.delete(lockKey);
      io.to(tripId).emit('field-unlocked', { fieldPath });
      console.log(`Field ${fieldPath} unlocked by ${user.name} in trip ${tripId}`);
    }
  });

  // Handle real-time trip updates
  socket.on('trip-update', (data) => {
    const { updateType, payload, version } = data;
    const { tripId, user } = userConnections.get(socket.id) || {};
    
    if (!tripId || !user) {
      socket.emit('error', { message: 'Invalid update request' });
      return;
    }

    // Broadcast update to all other users in the trip
    socket.to(tripId).emit('trip-updated', {
      updateType,
      payload,
      version,
      updatedBy: user,
      timestamp: new Date()
    });

    console.log(`Trip ${tripId} updated by ${user.name}: ${updateType}`);
  });

  // Handle notes updates
  socket.on('note-update', (data) => {
    const { noteId, content, action } = data; // action: 'create', 'update', 'delete'
    const { tripId, user } = userConnections.get(socket.id) || {};
    
    if (!tripId || !user) {
      socket.emit('error', { message: 'Invalid note update' });
      return;
    }

    socket.to(tripId).emit('note-updated', {
      noteId,
      content,
      action,
      author: user,
      timestamp: new Date()
    });

    console.log(`Note ${action} by ${user.name} in trip ${tripId}`);
  });

  // Handle expense updates
  socket.on('expense-update', (data) => {
    const { expenseId, expense, action } = data;
    const { tripId, user } = userConnections.get(socket.id) || {};
    
    if (!tripId || !user) {
      socket.emit('error', { message: 'Invalid expense update' });
      return;
    }

    socket.to(tripId).emit('expense-updated', {
      expenseId,
      expense,
      action,
      updatedBy: user,
      timestamp: new Date()
    });

    console.log(`Expense ${action} by ${user.name} in trip ${tripId}`);
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    const { fieldPath } = data;
    const { tripId, user } = userConnections.get(socket.id) || {};
    
    if (tripId && user) {
      socket.to(tripId).emit('user-typing', {
        fieldPath,
        user,
        timestamp: new Date()
      });
    }
  });

  socket.on('typing-stop', (data) => {
    const { fieldPath } = data;
    const { tripId, user } = userConnections.get(socket.id) || {};
    
    if (tripId && user) {
      socket.to(tripId).emit('user-stopped-typing', {
        fieldPath,
        user,
        timestamp: new Date()
      });
    }
  });

  // Handle cursor position for real-time collaboration
  socket.on('cursor-move', (data) => {
    const { fieldPath, position } = data;
    const { tripId, user } = userConnections.get(socket.id) || {};
    
    if (tripId && user) {
      socket.to(tripId).emit('cursor-updated', {
        fieldPath,
        position,
        user,
        timestamp: new Date()
      });
    }
  });

  // Handle voice chat signaling
  socket.on('voice-offer', (data) => {
    const { targetUserId, offer } = data;
    const { tripId, user } = userConnections.get(socket.id) || {};
    
    if (tripId && user) {
      // Find target user's socket
      const targetSocket = Array.from(userConnections.entries())
        .find(([, conn]) => conn.tripId === tripId && conn.user.userId === targetUserId);
      
      if (targetSocket) {
        io.to(targetSocket[0]).emit('voice-offer', {
          fromUserId: user.userId,
          fromUserName: user.name,
          offer
        });
      }
    }
  });

  socket.on('voice-answer', (data) => {
    const { targetUserId, answer } = data;
    const { tripId, user } = userConnections.get(socket.id) || {};
    
    if (tripId && user) {
      const targetSocket = Array.from(userConnections.entries())
        .find(([, conn]) => conn.tripId === tripId && conn.user.userId === targetUserId);
      
      if (targetSocket) {
        io.to(targetSocket[0]).emit('voice-answer', {
          fromUserId: user.userId,
          answer
        });
      }
    }
  });

  socket.on('ice-candidate', (data) => {
    const { targetUserId, candidate } = data;
    const { tripId, user } = userConnections.get(socket.id) || {};
    
    if (tripId && user) {
      const targetSocket = Array.from(userConnections.entries())
        .find(([, conn]) => conn.tripId === tripId && conn.user.userId === targetUserId);
      
      if (targetSocket) {
        io.to(targetSocket[0]).emit('ice-candidate', {
          fromUserId: user.userId,
          candidate
        });
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const connection = userConnections.get(socket.id);
    
    if (connection) {
      const { tripId, user } = connection;
      
      // Remove user from active rooms
      if (activeRooms.has(tripId)) {
        const participants = activeRooms.get(tripId);
        participants.forEach(participant => {
          if (participant.socketId === socket.id) {
            participants.delete(participant);
          }
        });
        
        if (participants.size === 0) {
          activeRooms.delete(tripId);
        }
      }
      
      // Remove all field locks held by this user
      const userLocks = Array.from(fieldLocks.entries())
        .filter(([, lock]) => lock.socketId === socket.id);
      
      userLocks.forEach(([lockKey]) => {
        fieldLocks.delete(lockKey);
        const fieldPath = lockKey.replace(`${tripId}:`, '');
        io.to(tripId).emit('field-unlocked', { fieldPath });
      });
      
      // Notify others about user leaving
      socket.to(tripId).emit('user-left', {
        user,
        timestamp: new Date()
      });
      
      userConnections.delete(socket.id);
      console.log(`User ${user.name} disconnected from trip ${tripId}`);
    }
    
    console.log(`Socket disconnected: ${socket.id}`);
  });

  // Heartbeat to keep connection alive
  socket.on('ping', () => {
    socket.emit('pong');
  });
});

// Cleanup expired locks every minute
setInterval(() => {
  const now = new Date();
  const expiredLocks = Array.from(fieldLocks.entries())
    .filter(([, lock]) => lock.expiresAt < now);
  
  expiredLocks.forEach(([lockKey, lock]) => {
    fieldLocks.delete(lockKey);
    const [tripId, fieldPath] = lockKey.split(':');
    io.to(tripId).emit('field-unlocked', { fieldPath });
    console.log(`Auto-unlocked expired field: ${fieldPath}`);
  });
}, 60000);

// API endpoint for health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeRooms: activeRooms.size,
    connectedUsers: userConnections.size,
    activeLocks: fieldLocks.size,
    timestamp: new Date()
  });
});

// API endpoint to get room status
app.get('/api/room/:tripId/status', (req, res) => {
  const { tripId } = req.params;
  const participants = activeRooms.get(tripId) || new Set();
  const locks = Array.from(fieldLocks.entries())
    .filter(([key]) => key.startsWith(tripId))
    .map(([key, lock]) => ({
      fieldPath: key.replace(`${tripId}:`, ''),
      ...lock
    }));
  
  res.json({
    tripId,
    participants: Array.from(participants),
    activeLocks: locks,
    participantCount: participants.size
  });
});

const PORT = process.env.SOCKET_PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
  console.log(`🌐 Accepting connections from ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`);
});