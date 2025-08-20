import { authKey } from "@/constants/storageKey";
import { USER_ROLE } from "@/constants/role";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];

const redirect = (url: string, request: NextRequest) =>
  NextResponse.redirect(new URL(url, request.url));

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = (await cookies()).get(authKey)?.value;

  // If not logged in → only allow public routes
  if (!token) {
    // Save intended path as callbackUrl (so after login we can go back)
    if (!PUBLIC_ROUTES.includes(pathname)) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Decode role
  let role: string | undefined;
  try {
    const decoded = jwtDecode<{ role: string }>(token);
    role = decoded.role;
  } catch {
    return redirect("/auth/login", request);
  }

  // If logged in and tries login/register → send to callbackUrl or home
  if (PUBLIC_ROUTES.includes(pathname)) {
    const callback = searchParams.get("callbackUrl");
    return redirect(callback || "/", request);
  }

  // Role restrictions
  if (role === USER_ROLE.USER && pathname.startsWith("/admin")) {
    return redirect("/", request);
  }

  if (role === USER_ROLE.ADMIN && pathname.startsWith("/user")) {
    return redirect("/", request);
  }

  // Course route → just require login (already checked above)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/admin/:path*",
    "/course/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
