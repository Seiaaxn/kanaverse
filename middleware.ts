import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Check if Clerk is properly configured
function isClerkConfigured(): boolean {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!publishableKey || !secretKey) return false;
  if (publishableKey === "pk_test_placeholder") return false;
  if (publishableKey === "pk_test_dummy") return false;
  if (secretKey === "sk_test_placeholder") return false;
  if (secretKey === "sk_test_dummy") return false;
  if (!publishableKey.startsWith("pk_")) return false;
  if (!secretKey.startsWith("sk_")) return false;

  // Reject any key with "dummy" or "placeholder" in the third segment
  const pubParts = publishableKey.split("_");
  const secParts = secretKey.split("_");
  if (pubParts.length < 3 || secParts.length < 3) return false;
  if (
    pubParts[2] === "dummy" ||
    pubParts[2] === "placeholder" ||
    secParts[2] === "dummy" ||
    secParts[2] === "placeholder"
  )
    return false;

  return true;
}

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/bookmark(.*)",
  "/history(.*)",
  "/api/bookmarks(.*)",
  "/api/history(.*)",
]);

// Define public routes that should skip Clerk middleware entirely
const isPublicApiRoute = createRouteMatcher(["/api/webhooks(.*)"]);

// Clerk middleware handler
const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Simple pass-through middleware when Clerk is not configured
function simpleMiddleware() {
  return NextResponse.next();
}

// Export the appropriate middleware based on configuration
export default function middleware(req: NextRequest) {
  // Skip middleware for webhook routes (they have their own verification)
  if (isPublicApiRoute(req)) {
    return NextResponse.next();
  }

  if (isClerkConfigured()) {
    // @ts-expect-error - Clerk middleware has different signature
    return clerkHandler(req);
  }
  return simpleMiddleware();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
