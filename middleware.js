import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Protect /admin → only admins
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return Response.redirect(new URL("/dashboard", req.url));
    }

    // Protect /dashboard → allow users AND admins
    if (
      pathname.startsWith("/dashboard") &&
      !["user", "admin"].includes(token?.role)
    ) {
      return Response.redirect(new URL("/", req.url)); // send to login
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
