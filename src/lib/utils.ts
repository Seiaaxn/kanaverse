import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getImageUrl(url: string): string {
  // Handle different image URL formats from API
  if (!url || url === "undefined" || url === "null") {
    return "https://placehold.co/300x450/1a1a2e/ffffff?text=No+Image";
  }
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}
