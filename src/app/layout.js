"use client"

import { AuthProvider } from "../context/AuthContext.js";
import { TripProvider } from "../context/TripContext.js";
import { ThemeProvider } from "../context/ThemeContext.js";
import { ClerkProvider } from "@clerk/nextjs";
// import { liveblocksClient } from "@/lib/liveblocksClient.js";
import { LiveblocksProvider } from "@liveblocks/react";
import SocketProvider from "@/components/socketProvider.js";
import { NotificationProvider } from '@/context/NotificationContext';

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body>
    <NotificationProvider>
    <LiveblocksProvider  authEndpoint="/api/liveblocks-auth">
    <ClerkProvider>
    <SocketProvider>
      <TripProvider>
        <ThemeProvider>
            {children}
        </ThemeProvider>
      </TripProvider>
      </SocketProvider>
    </ClerkProvider>
    </LiveblocksProvider>
    </NotificationProvider>
    </body>
    </html>
  );
}
