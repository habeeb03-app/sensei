import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const path = req.nextUrl.pathname;
      if (path.startsWith("/login") || path.startsWith("/register") || path.startsWith("/api/auth") || path.startsWith("/api/register")) {
        return true;
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/((?!api/auth|api/register|_next/static|_next/image|favicon.ico).*)",
  ],
};
