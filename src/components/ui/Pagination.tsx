"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
}

export function Pagination({ currentPage, totalPages, baseUrl, className }: PaginationProps) {
  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsisThreshold = 7;

    if (totalPages <= showEllipsisThreshold) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const buildUrl = (page: number) => {
    const url = new URL(baseUrl, "http://localhost");
    url.searchParams.set("page", page.toString());
    return `${url.pathname}${url.search}`;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      {/* Previous button */}
      <Link
        href={currentPage > 1 ? buildUrl(currentPage - 1) : "#"}
        className={cn(
          "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          currentPage > 1
            ? "hover:bg-accent text-foreground"
            : "text-muted-foreground pointer-events-none opacity-50"
        )}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Prev</span>
      </Link>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="text-muted-foreground flex h-10 w-10 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Link
              key={page}
              href={buildUrl(page)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next button */}
      <Link
        href={currentPage < totalPages ? buildUrl(currentPage + 1) : "#"}
        className={cn(
          "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          currentPage < totalPages
            ? "hover:bg-accent text-foreground"
            : "text-muted-foreground pointer-events-none opacity-50"
        )}
        aria-disabled={currentPage >= totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}

// Load More Button for infinite scroll
interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  className?: string;
}

export function LoadMoreButton({ onClick, isLoading, hasMore, className }: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className={cn("flex justify-center py-8", className)}>
      <button
        onClick={onClick}
        disabled={isLoading}
        className={cn(
          "rounded-lg px-6 py-3 font-medium transition-all",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isLoading && "animate-pulse"
        )}
      >
        {isLoading ? "Memuat..." : "Muat Lebih Banyak"}
      </button>
    </div>
  );
        }
        
