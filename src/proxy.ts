/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isCandidateRoute = pathname.startsWith("/candidate");
  const isEmployerRoute = pathname.startsWith("/employer");
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = isCandidateRoute || isEmployerRoute || isAdminRoute;

  // If attempting to access a guarded dashboard route
  if (isDashboardRoute) {
    if (!accessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const decoded = parseJwt(accessToken);
    if (!decoded || !decoded.role) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = decoded.role;

    // Check permissions
    if (isCandidateRoute && role !== "candidate") {
      return NextResponse.redirect(new URL(role === "employer" ? "/employer" : "/admin", request.url));
    }
    if (isEmployerRoute && role !== "employer") {
      return NextResponse.redirect(new URL(role === "candidate" ? "/candidate" : "/admin", request.url));
    }
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL(role === "candidate" ? "/candidate" : "/employer", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  if (isAuthRoute && accessToken) {
    const decoded = parseJwt(accessToken);
    if (decoded && decoded.role) {
      const role = decoded.role;
      if (role === "candidate") {
        return NextResponse.redirect(new URL("/candidate", request.url));
      } else if (role === "employer") {
        return NextResponse.redirect(new URL("/employer", request.url));
      } else if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: [
    "/candidate/:path*",
    "/employer/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
