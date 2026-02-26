import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    // Protect everything except static files, _next internals, and auth API
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
