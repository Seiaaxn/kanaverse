"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { type ReactNode } from "react";
import { useMounted } from "@/hooks/useMounted";

interface AuthProviderProps {
  children: ReactNode;
  clerkEnabled: boolean;
}

function ClerkProviderWithTheme({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  // Always wrap in ClerkProvider, but only apply theme after mount
  // This ensures SignedIn/SignedOut components always have a ClerkProvider parent
  return (
    <ClerkProvider
      appearance={{
        baseTheme: mounted && resolvedTheme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "hsl(263 70% 50%)",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function AuthProvider({ children, clerkEnabled }: AuthProviderProps) {
  // If Clerk is not configured, just render children without auth
  if (!clerkEnabled) {
    return <>{children}</>;
  }

  return <ClerkProviderWithTheme>{children}</ClerkProviderWithTheme>;
}
