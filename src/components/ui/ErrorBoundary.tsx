"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
}

export function ErrorDisplay({
  title = "Terjadi Kesalahan",
  message = "Maaf, terjadi kesalahan saat memuat data. Silakan coba lagi.",
  showRetry = true,
}: ErrorDisplayProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="mb-4 h-16 w-16 text-yellow-500" />
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {showRetry && (
        <button
          onClick={() => router.refresh()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </button>
      )}
    </div>
  );
}
