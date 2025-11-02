import { type NextRequest, NextResponse } from "next/server"
import { validateSession } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  // Log all API requests
  if (request.nextUrl.pathname.startsWith("/api/")) {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname}`)
  }

  // Check authentication for dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard/")) {
    const token = request.cookies.get("authToken")?.value

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/auth/get-started", request.url))
    }

    // Validate session token
    try {
      const userId = await validateSession(token)
      if (!userId) {
        // Token invalid or expired
        return NextResponse.redirect(new URL("/auth/get-started", request.url))
      }
    } catch (error) {
      console.error("[v0] Session validation error:", error)
      return NextResponse.redirect(new URL("/auth/get-started", request.url))
    }
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  return response
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
}
