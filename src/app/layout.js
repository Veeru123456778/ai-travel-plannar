import { AuthProvider } from "../context/AuthContext.js";
import { TripProvider } from "../context/TripContext.js";
import { ThemeProvider } from "../context/ThemeContext.js";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body>
    <ClerkProvider>
      <TripProvider>
        <ThemeProvider>
            {children}
        </ThemeProvider>
      </TripProvider>
    </ClerkProvider>
    </body>
    </html>
  );
}
