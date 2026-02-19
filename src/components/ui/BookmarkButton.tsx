"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface BookmarkButtonProps {
  type: "komik" | "anime";
  itemId: string;
  title: string;
  thumbnail?: string;
  className?: string;
  variant?: "default" | "icon";
}

export function BookmarkButton({
  type,
  itemId,
  title,
  thumbnail,
  className,
  variant = "default",
}: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useAppStore();
  const bookmarked = isBookmarked(type, itemId);

  const handleToggle = () => {
    if (bookmarked) {
      removeBookmark(type, itemId);
    } else {
      addBookmark({ type, itemId, title, thumbnail });
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
          bookmarked
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground",
          className
        )}
        title={bookmarked ? "Hapus dari bookmark" : "Tambah ke bookmark"}
      >
        {bookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        bookmarked
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        className
      )}
    >
      {bookmarked ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          Tersimpan
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          Bookmark
        </>
      )}
    </button>
  );
}
