"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bookmark, History } from "@/types";

interface AppState {
  // Bookmarks (local storage for now, will sync with DB when user is logged in)
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, "id" | "createdAt" | "userId">) => void;
  removeBookmark: (type: string, itemId: string) => void;
  isBookmarked: (type: string, itemId: string) => boolean;

  // History
  history: History[];
  addToHistory: (item: Omit<History, "id" | "updatedAt" | "userId">) => void;
  removeFromHistory: (type: string, itemId: string) => void;
  clearHistory: () => void;
  getLastProgress: (type: string, itemId: string) => string | null;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Bookmarks
      bookmarks: [],

      addBookmark: (bookmark) => {
        const newBookmark: Bookmark = {
          ...bookmark,
          id: crypto.randomUUID(),
          userId: "local",
          createdAt: new Date(),
        };
        set((state) => ({
          bookmarks: [newBookmark, ...state.bookmarks],
        }));
      },

      removeBookmark: (type, itemId) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => !(b.type === type && b.itemId === itemId)),
        }));
      },

      isBookmarked: (type, itemId) => {
        return get().bookmarks.some((b) => b.type === type && b.itemId === itemId);
      },

      // History
      history: [],

      addToHistory: (item) => {
        set((state) => {
          // Remove existing entry if exists
          const filtered = state.history.filter(
            (h) => !(h.type === item.type && h.itemId === item.itemId)
          );

          const newHistory: History = {
            ...item,
            id: crypto.randomUUID(),
            userId: "local",
            updatedAt: new Date(),
          };

          // Add to beginning, keep max 50 items
          return {
            history: [newHistory, ...filtered].slice(0, 50),
          };
        });
      },

      removeFromHistory: (type, itemId) => {
        set((state) => ({
          history: state.history.filter((h) => !(h.type === type && h.itemId === itemId)),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },

      getLastProgress: (type, itemId) => {
        const item = get().history.find((h) => h.type === type && h.itemId === itemId);
        return item?.progress || null;
      },
    }),
    {
      name: "komikmanga-storage",
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        history: state.history,
      }),
    }
  )
);
