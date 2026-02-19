// Check if Clerk is properly configured
export function isClerkConfigured(): boolean {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Check if key exists and is not a placeholder/dummy
  if (!publishableKey) return false;
  if (publishableKey === "pk_test_placeholder") return false;
  if (publishableKey === "pk_test_dummy") return false;
  if (!publishableKey.startsWith("pk_")) return false;

  // Clerk keys have a specific format: pk_test_xxx or pk_live_xxx
  // The third segment should be a base64-like string, not "dummy" or "placeholder"
  const parts = publishableKey.split("_");
  if (parts.length < 3) return false;
  if (parts[2] === "dummy" || parts[2] === "placeholder") return false;

  return true;
}

// Export for use in components
export const CLERK_ENABLED = typeof process !== "undefined" && isClerkConfigured();
