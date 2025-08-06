import { AuthProvider } from "../context/AuthContext.js";
import { TripProvider } from "../context/TripContext.js";
import { ThemeProvider } from "../context/ThemeContext.js";
import { SocketProvider } from "../context/SocketContext.js";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "AI Travel Planner - Collaborative Trip Planning",
  description: "Plan your perfect trip with AI assistance and real-time collaboration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <TripProvider>
            <ThemeProvider>
              <SocketProvider>
                {children}
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      theme: {
                        primary: '#4aed88',
                      },
                    },
                  }}
                />
              </SocketProvider>
            </ThemeProvider>
          </TripProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
