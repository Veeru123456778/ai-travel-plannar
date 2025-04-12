import { AuthProvider } from "../context/AuthContext.js";
import { TripProvider } from "../context/TripContext.js";
import { ThemeProvider } from "../context/ThemeContext.js";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body>
    <AuthProvider>
      <TripProvider>
        <ThemeProvider>
            {children}
        </ThemeProvider>
      </TripProvider>
    </AuthProvider>
    </body>
    </html>
  );
}
