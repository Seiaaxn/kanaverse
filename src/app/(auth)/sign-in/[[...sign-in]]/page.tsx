import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/auth-config";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

function AuthNotConfigured() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
          <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-bold">Authentication Not Configured</h1>
          <p className="text-muted-foreground">
            Clerk authentication is not yet configured. You can still use the app with local storage
            for bookmarks and history.
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-left text-sm">
          <p className="text-foreground mb-2 font-medium">To enable authentication:</p>
          <ol className="text-muted-foreground list-inside list-decimal space-y-1">
            <li>Create a Clerk account at clerk.com</li>
            <li>Get your API keys from the dashboard</li>
            <li>Add them to your .env file</li>
            <li>Restart the development server</li>
          </ol>
        </div>
        <Link
          href="/"
          className="text-primary hover:text-primary/80 inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  const clerkEnabled = isClerkConfigured();

  if (!clerkEnabled) {
    return <AuthNotConfigured />;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
            card: "bg-card border border-border shadow-lg",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton:
              "bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-background border-input text-foreground focus:ring-ring",
            footerActionLink: "text-primary hover:text-primary/90",
          },
        }}
      />
    </div>
  );
}
