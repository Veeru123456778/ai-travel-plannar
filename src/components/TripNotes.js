'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { 
  ChatBubbleLeftRightIcon, 
  MicrophoneIcon, 
  PhoneIcon, 
  PhoneXMarkIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
  UserIcon,
  LockClosedIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { MicrophoneIcon as MicrophoneSolidIcon } from '@heroicons/react/24/solid';

export default function TripNotes({ tripId }) {
  const { user } = useUser();
  const { socket, participants, sendNoteUpdate } = useSocket();
  
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voiceChat, setVoiceChat] = useState({
    isActive: false,
    isMuted: false,
    isConnecting: false,
    connectedUsers: []
  });
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRefs = useRef({});
  const peerConnections = useRef({});
  const localStream = useRef(null);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [tripId]);

  // Auto-scroll to bottom when new notes are added
  useEffect(() => {
    scrollToBottom();
  }, [notes]);

  // Socket event listeners for real-time notes
  useEffect(() => {
    if (!socket) return;

    const handleNoteUpdated = (data) => {
      const { noteId, content, action, author, timestamp } = data;
      
      if (action === 'create') {
        const newNote = {
          id: noteId,
          content,
          author,
          createdAt: timestamp,
          updatedAt: timestamp,
          isPrivate: false,
          mentions: [],
          attachments: []
        };
        setNotes(prev => [newNote, ...prev]);
        toast.success(`${author.name} added a note`);
      } else if (action === 'update') {
        setNotes(prev => prev.map(note => 
          note.id === noteId ? { ...note, content, updatedAt: timestamp } : note
        ));
      } else if (action === 'delete') {
        setNotes(prev => prev.filter(note => note.id !== noteId));
      }
    };

    // Voice chat WebRTC signaling
    const handleVoiceOffer = async (data) => {
      const { fromUserId, fromUserName, offer } = data;
      
      try {
        const peerConnection = createPeerConnection(fromUserId);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        socket.emit('voice-answer', {
          targetUserId: fromUserId,
          answer: answer
        });
        
        toast.success(`Voice call from ${fromUserName}`);
      } catch (error) {
        console.error('Error handling voice offer:', error);
        toast.error('Failed to connect voice call');
      }
    };

    const handleVoiceAnswer = async (data) => {
      const { fromUserId, answer } = data;
      
      try {
        const peerConnection = peerConnections.current[fromUserId];
        if (peerConnection) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (error) {
        console.error('Error handling voice answer:', error);
      }
    };

    const handleIceCandidate = async (data) => {
      const { fromUserId, candidate } = data;
      
      try {
        const peerConnection = peerConnections.current[fromUserId];
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    };

    socket.on('note-updated', handleNoteUpdated);
    socket.on('voice-offer', handleVoiceOffer);
    socket.on('voice-answer', handleVoiceAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('note-updated', handleNoteUpdated);
      socket.off('voice-offer', handleVoiceOffer);
      socket.off('voice-answer', handleVoiceAnswer);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, [socket]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}/notes`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(`/api/trips/${tripId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNote.trim(),
          isPrivate
        })
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(prev => [data.note, ...prev]);
        setNewNote('');
        
        // Send real-time update
        sendNoteUpdate(data.note.id, data.note.content, 'create');
        
        toast.success('Note added');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add note');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to add note');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      createNote();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // WebRTC voice chat functions
  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          targetUserId: userId,
          candidate: event.candidate
        });
      }
    };

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteAudioRefs.current[userId]) {
        remoteAudioRefs.current[userId].srcObject = remoteStream;
      }
    };

    peerConnections.current[userId] = peerConnection;
    return peerConnection;
  };

  const startVoiceChat = async () => {
    try {
      setVoiceChat(prev => ({ ...prev, isConnecting: true }));
      
      // Get user media
      localStream.current = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      });
      
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = localStream.current;
      }

      // Create peer connections for all participants
      const promises = participants
        .filter(p => p.userId !== user.id)
        .map(async (participant) => {
          const peerConnection = createPeerConnection(participant.userId);
          
          // Add local stream to peer connection
          localStream.current.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream.current);
          });

          // Create and send offer
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          
          socket.emit('voice-offer', {
            targetUserId: participant.userId,
            offer: offer
          });
        });

      await Promise.all(promises);
      
      setVoiceChat(prev => ({ 
        ...prev, 
        isActive: true, 
        isConnecting: false,
        connectedUsers: participants.filter(p => p.userId !== user.id)
      }));
      
      toast.success('Voice chat started');
    } catch (error) {
      console.error('Error starting voice chat:', error);
      toast.error('Failed to start voice chat. Please check microphone permissions.');
      setVoiceChat(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const endVoiceChat = () => {
    // Close all peer connections
    Object.values(peerConnections.current).forEach(pc => pc.close());
    peerConnections.current = {};
    
    // Stop local stream
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    
    setVoiceChat({
      isActive: false,
      isMuted: false,
      isConnecting: false,
      connectedUsers: []
    });
    
    toast.success('Voice chat ended');
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = voiceChat.isMuted;
        setVoiceChat(prev => ({ ...prev, isMuted: !prev.isMuted }));
        toast.success(voiceChat.isMuted ? 'Unmuted' : 'Muted');
      }
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900">Trip Notes</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {notes.length} notes
          </span>
        </div>
        
        {/* Voice chat controls */}
        <div className="flex items-center space-x-2">
          {participants.length > 1 && (
            <>
              {voiceChat.isActive ? (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={toggleMute}
                    className={`p-2 rounded-full ${
                      voiceChat.isMuted 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    title={voiceChat.isMuted ? 'Unmute' : 'Mute'}
                  >
                    <MicrophoneIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={endVoiceChat}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    title="End voice chat"
                  >
                    <PhoneXMarkIcon className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-500">
                    {voiceChat.connectedUsers.length} connected
                  </span>
                </div>
              ) : (
                <button
                  onClick={startVoiceChat}
                  disabled={voiceChat.isConnecting}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 disabled:opacity-50"
                  title="Start voice chat"
                >
                  {voiceChat.isConnecting ? (
                    <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full" />
                  ) : (
                    <PhoneIcon className="h-4 w-4" />
                  )}
                  <span className="text-sm">Voice Chat</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No notes yet. Start the conversation!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`flex space-x-3 ${
                note.author.userId === user.id ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {note.author.avatar ? (
                  <img 
                    src={note.author.avatar} 
                    alt={note.author.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
              
              <div className={`flex-1 max-w-xs lg:max-w-md ${
                note.author.userId === user.id ? 'text-right' : ''
              }`}>
                <div className={`rounded-lg px-3 py-2 ${
                  note.author.userId === user.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-center space-x-1 mb-1">
                    <span className={`text-xs font-medium ${
                      note.author.userId === user.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {note.author.userId === user.id ? 'You' : note.author.name}
                    </span>
                    {note.isPrivate && (
                      <LockClosedIcon className={`h-3 w-3 ${
                        note.author.userId === user.id ? 'text-blue-200' : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                </div>
                <p className={`text-xs mt-1 ${
                  note.author.userId === user.id ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {formatTime(note.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* New note input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a note... (Ctrl+Enter to send)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Private note</span>
                  {isPrivate ? (
                    <LockClosedIcon className="h-4 w-4 text-gray-500" />
                  ) : (
                    <GlobeAltIcon className="h-4 w-4 text-gray-500" />
                  )}
                </label>
              </div>
              <button
                onClick={createNote}
                disabled={!newNote.trim()}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio elements for WebRTC */}
      <audio ref={localAudioRef} autoPlay muted />
      {participants.map(participant => (
        <audio
          key={participant.userId}
          ref={el => remoteAudioRefs.current[participant.userId] = el}
          autoPlay
        />
      ))}
    </div>
  );
}