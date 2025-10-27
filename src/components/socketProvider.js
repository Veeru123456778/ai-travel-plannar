// components/SocketProvider.js
'use client';
import { useSocket } from "@/hooks/useSocket";

export default function SocketProvider({ children }) {
  useSocket(); // Establish WebSocket once for the entire app
  return children;
}
