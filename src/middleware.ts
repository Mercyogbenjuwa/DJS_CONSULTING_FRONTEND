import { NextRequest, NextResponse } from "next/server";

// List of protected routes
const protectedRoutes = [{ path: "/add-post" }];
const authRoutes = ["/login", "/sign-up"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const tokenCookie = req.cookies.get("blog_admin_access_token");
  const token = tokenCookie ? tokenCookie.value : null;

  const protectedRoute = protectedRoutes.find((route) =>
    url.pathname.startsWith(route.path)
  );

  if (protectedRoute) {
    if (!token) {
      url.pathname = "/home";
      const response = NextResponse.redirect(url);
      response.cookies.set(
        "redirectMessage",
        "You do not have access to that page",
        { path: "/home" }
      );
      return response;
    }
  }

  if (authRoutes.some((route) => url.pathname.startsWith(route))) {
    if (token) {
      let Url = "/home";

      const response = NextResponse.redirect(new URL(Url, url));
      response.cookies.set(
        "redirectMessage",
        "You are already logged in. Please log out first",
        {
          path: "/home",
        }
      );
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-post", "/login", "/sign-up"],
};
