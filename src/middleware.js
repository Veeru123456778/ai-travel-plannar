import { NextResponse } from "next/server";

export function middleware(request) {
//   const isAuthenticated = request.cookies.get("authToken");

//   if (!isAuthenticated) {
//     return NextResponse.redirect(new URL("/auth", request.url));
//   }

//   return NextResponse.next();
}

// Only apply middleware to specific routes (e.g., dashboard and trip pages)
export const config = {
  matcher: ["/dashboard/:path*", "/trip/:path*"],
};
