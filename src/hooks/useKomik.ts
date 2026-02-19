"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getKomikLatest,
  getKomikRecommended,
  getKomikPopular,
  searchKomik,
  getKomikDetail,
  getKomikChapterList,
  getKomikImages,
} from "@/lib/api-client";

// Komik type for recommendations
export type KomikType = "manhwa" | "manhua" | "manga";
export type LatestType = "project" | "mirror";

// Query keys for cache management
export const komikKeys = {
  all: ["komik"] as const,
  latest: (type?: LatestType) => [...komikKeys.all, "latest", type] as const,
  recommended: (type: KomikType) => [...komikKeys.all, "recommended", type] as const,
  popular: (page: number) => [...komikKeys.all, "popular", page] as const,
  popularInfinite: () => [...komikKeys.all, "popular", "infinite"] as const,
  search: (query: string) => [...komikKeys.all, "search", query] as const,
  detail: (mangaId: string) => [...komikKeys.all, "detail", mangaId] as const,
  chapters: (mangaId: string) => [...komikKeys.all, "chapters", mangaId] as const,
  images: (chapterId: string) => [...komikKeys.all, "images", chapterId] as const,
};

// Hook for fetching latest komik
export function useKomikLatest(type: LatestType = "mirror") {
  return useQuery({
    queryKey: komikKeys.latest(type),
    queryFn: () => getKomikLatest(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching recommended komik by type
export function useKomikRecommended(type: KomikType) {
  return useQuery({
    queryKey: komikKeys.recommended(type),
    queryFn: () => getKomikRecommended(type),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching popular komik with pagination
export function useKomikPopular(page: number = 1) {
  return useQuery({
    queryKey: komikKeys.popular(page),
    queryFn: () => getKomikPopular(page),
    staleTime: 10 * 60 * 1000,
  });
}

// Hook for infinite scroll popular komik
export function useKomikPopularInfinite() {
  return useInfiniteQuery({
    queryKey: komikKeys.popularInfinite(),
    queryFn: ({ pageParam = 1 }) => getKomikPopular(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Assume there's more if we got results
      if (lastPage.length > 0) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// Hook for searching komik
export function useKomikSearch(query: string) {
  return useQuery({
    queryKey: komikKeys.search(query),
    queryFn: () => searchKomik(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for fetching komik detail
export function useKomikDetail(mangaId: string) {
  return useQuery({
    queryKey: komikKeys.detail(mangaId),
    queryFn: () => getKomikDetail(mangaId),
    enabled: !!mangaId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook for fetching komik chapter list
export function useKomikChapters(mangaId: string) {
  return useQuery({
    queryKey: komikKeys.chapters(mangaId),
    queryFn: () => getKomikChapterList(mangaId),
    enabled: !!mangaId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook for fetching chapter images
export function useChapterImages(chapterId: string) {
  return useQuery({
    queryKey: komikKeys.images(chapterId),
    queryFn: () => getKomikImages(chapterId),
    enabled: !!chapterId,
    staleTime: 60 * 60 * 1000, // 1 hour (images don't change)
  });
      }
    
