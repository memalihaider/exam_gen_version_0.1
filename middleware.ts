import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/generate-paper/:path*",
    "/saved-papers/:path*",
    "/past-papers/:path*",
    "/teachers/:path*",
    "/papers-history/:path*",
    "/login-history/:path*",
    "/default-paper-setting/:path*",
  ],
};