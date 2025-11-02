import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Log all API requests
  if (pathname.startsWith("/api/")) {
    console.log(`[${new Date().toISOString()}] ${request.method} ${pathname}`)
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  if (pathname.startsWith("/dashboard/")) {
    const authToken =
      request.cookies.get("authToken")?.value || request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!authToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/auth/:path*"],
}
