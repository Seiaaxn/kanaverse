"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";

interface HistoryTrackerProps {
  type: "komik" | "anime";
  itemId: string;
  title: string;
  thumbnail?: string;
  progress: string;
  progressTitle?: string;
}

export function HistoryTracker({
  type,
  itemId,
  title,
  thumbnail,
  progress,
  progressTitle,
}: HistoryTrackerProps) {
  const { addToHistory } = useAppStore();

  useEffect(() => {
    if (itemId && title && progress) {
      addToHistory({ type, itemId, title, thumbnail, progress, progressTitle });
    }
  }, [type, itemId, title, thumbnail, progress, progressTitle, addToHistory]);

  return null;
}
