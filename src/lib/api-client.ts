/**
 * API Client with ISR Caching
 *
 * Optimized for performance with Incremental Static Regeneration.
 * Safe to use in both client and server components.
 */

import type { Anime, Komik, KomikChapter, KomikImage } from "@/types";
import { CACHE_TIMES, CACHE_TAGS } from "./cache-config";

const BASE_URL = "https://api.sansekai.my.id/api";

// ==================== RAW API TYPES ====================

interface RawAnimeListItem {
  urlId?: string;
  url_id?: string;
  url?: string;
  title?: string;
  judul?: string;
  thumbnail?: string;
  image?: string;
  cover?: string;
  synopsis?: string;
  sinopsis?: string;
  description?: string;
  rating?: string | number;
  type?: string;
  status?: string;
  genres?: string[];
  genre?: string[];
  episodes?: RawEpisode[];
  chapter?: RawEpisode[];
  total_episodes?: number;
  totalEpisodes?: number;
}

interface RawEpisode {
  id?: number;
  url?: string;
  ch?: string;
  title?: string;
  date?: string;
}

interface RawKomikItem {
  manga_id?: string;
  title?: string;
  thumbnail?: string;
  cover?: string;
  cover_image_url?: string;
  type?: string;
  status?: number | string;
  rating?: string | number;
  user_rate?: number;
  description?: string;
  synopsis?: string;
  author?: string;
  artist?: string;
  genres?: string[];
  chapters?: RawKomikChapterItem[];
  latest_chapter?: string;
  latestChapter?: string;
  updated_at?: string;
  updatedAt?: string;
  taxonomy?: {
    Genre?: Array<{ name: string }>;
    Author?: Array<{ name: string }>;
    Artist?: Array<{ name: string }>;
  };
}

interface RawKomikChapterItem {
  chapter_id?: string;
  id?: string;
  title?: string;
  chapter?: number;
  chapter_number?: number;
  date?: string;
  created_at?: string;
}

interface AnimeDetailResponse {
  data?: RawAnimeListItem[];
}

interface KomikListResponse {
  data?: RawKomikItem[];
  retcode?: number;
}

interface KomikDetailResponse {
  data?: RawKomikItem;
}

interface KomikImageResponse {
  data?: {
    chapter?: {
      data?: string[];
    };
  };
}

// ==================== HELPER FUNCTIONS ====================

async function fetchWithCache<T>(
  url: string,
  revalidate: number,
  tags?: string[],
  retries = 2
): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        next: {
          revalidate: revalidate,
          tags: tags,
        },
        headers: {
          Accept: "application/json",
        },
      } as RequestInit);

      if (res.status === 429) {
        const waitTime = Math.min(1000 * Math.pow(2, i), 10000);
        if (i < retries) {
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }
        return { data: [], retcode: -1 } as T;
      }

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      return res.json();
    } catch (error) {
      if (i === retries) {
        console.error(`Fetch failed: ${url}`, error);
        return { data: [], retcode: -1 } as T;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Failed to fetch");
}

function ensureArray<T>(data: T | T[] | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return [];
}

// ==================== ANIME API ====================

export async function getAnimeLatest(): Promise<Anime[]> {
  try {
    const res = await fetchWithCache<RawAnimeListItem[]>(
      `${BASE_URL}/anime/latest`,
      CACHE_TIMES.LATEST,
      [CACHE_TAGS.ANIME_LATEST]
    );
    return ensureArray(res).map(transformAnimeList);
  } catch {
    return [];
  }
}

export async function getAnimeRecommended(page: number = 1): Promise<Anime[]> {
  try {
    const res = await fetchWithCache<RawAnimeListItem[]>(
      `${BASE_URL}/anime/recommended?page=${page}`,
      CACHE_TIMES.POPULAR,
      [CACHE_TAGS.ANIME_RECOMMENDED]
    );
    return ensureArray(res).map(transformAnimeList);
  } catch {
    return [];
  }
}

export async function getAnimeMovie(): Promise<Anime[]> {
  try {
    const res = await fetchWithCache<RawAnimeListItem[]>(
      `${BASE_URL}/anime/movie`,
      CACHE_TIMES.POPULAR,
      [CACHE_TAGS.ANIME_MOVIE]
    );
    return ensureArray(res).map(transformAnimeList);
  } catch {
    return [];
  }
}

export async function getAnimeDetail(urlId: string): Promise<Anime | null> {
  try {
    const res = await fetchWithCache<AnimeDetailResponse>(
      `${BASE_URL}/anime/detail?urlId=${urlId}`,
      CACHE_TIMES.DETAIL,
      [CACHE_TAGS.ANIME_DETAIL, `anime-${urlId}`]
    );
    const detail = res.data?.[0];
    return detail ? transformAnimeDetail(detail) : null;
  } catch {
    return null;
  }
}

export async function searchAnime(query: string): Promise<Anime[]> {
  try {
    const res = await fetchWithCache<RawAnimeListItem[]>(
      `${BASE_URL}/anime/search?query=${encodeURIComponent(query)}`,
      CACHE_TIMES.SEARCH
    );
    return ensureArray(res).map(transformAnimeList);
  } catch {
    return [];
  }
}

export async function getAnimeVideo(
  episodeId: string,
  resolution: string = "480p"
): Promise<string | null> {
  try {
    const res = await fetch(`/api/anime/video?chapterUrlId=${episodeId}&reso=${resolution}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.url || null;
  } catch {
    return null;
  }
}

// ==================== KOMIK API ====================

export async function getKomikLatest(type: "project" | "mirror"): Promise<Komik[]> {
  try {
    const res = await fetchWithCache<KomikListResponse>(
      `${BASE_URL}/komik/latest?type=${type}`,
      CACHE_TIMES.LATEST,
      [CACHE_TAGS.KOMIK_LATEST, `komik-latest-${type}`]
    );
    return ensureArray(res.data).map(transformKomik);
  } catch {
    return [];
  }
}

export async function getKomikPopular(page: number = 1): Promise<Komik[]> {
  try {
    const res = await fetchWithCache<KomikListResponse>(
      `${BASE_URL}/komik/popular?page=${page}`,
      CACHE_TIMES.POPULAR,
      [CACHE_TAGS.KOMIK_POPULAR]
    );
    return ensureArray(res.data).map(transformKomik);
  } catch {
    return [];
  }
}

export async function getKomikRecommended(type: "manhwa" | "manhua" | "manga"): Promise<Komik[]> {
  try {
    const res = await fetchWithCache<KomikListResponse>(
      `${BASE_URL}/komik/recommended?type=${type}`,
      CACHE_TIMES.POPULAR,
      [CACHE_TAGS.KOMIK_RECOMMENDED, `komik-recommended-${type}`]
    );
    return ensureArray(res.data).map(transformKomik);
  } catch {
    return [];
  }
}

export async function getKomikDetail(mangaId: string): Promise<Komik | null> {
  try {
    const res = await fetchWithCache<KomikDetailResponse>(
      `${BASE_URL}/komik/detail?manga_id=${mangaId}`,
      CACHE_TIMES.DETAIL,
      [CACHE_TAGS.KOMIK_DETAIL, `komik-${mangaId}`]
    );
    return res.data ? transformKomik(res.data) : null;
  } catch {
    return null;
  }
}

export async function getKomikChapterList(mangaId: string): Promise<KomikChapter[]> {
  try {
    const res = await fetchWithCache<KomikListResponse>(
      `${BASE_URL}/komik/chapterlist?manga_id=${mangaId}`,
      CACHE_TIMES.DETAIL,
      [CACHE_TAGS.KOMIK_CHAPTERS, `komik-chapters-${mangaId}`]
    );
    return ensureArray(res.data).map((item) => transformKomikChapter(item as RawKomikChapterItem));
  } catch {
    return [];
  }
}

export async function searchKomik(query: string): Promise<Komik[]> {
  try {
    const res = await fetchWithCache<KomikListResponse>(
      `${BASE_URL}/komik/search?query=${encodeURIComponent(query)}`,
      CACHE_TIMES.SEARCH
    );
    return ensureArray(res.data).map(transformKomik);
  } catch {
    return [];
  }
}

export async function getKomikImages(chapterId: string): Promise<KomikImage[]> {
  try {
    const res = await fetchWithCache<KomikImageResponse>(
      `${BASE_URL}/komik/getimage?chapter_id=${chapterId}`,
      CACHE_TIMES.IMAGES,
      [CACHE_TAGS.KOMIK_IMAGES, `chapter-${chapterId}`]
    );
    const imageUrls = res.data?.chapter?.data || [];
    return imageUrls.map((url: string, index: number) => ({
      url,
      page: index + 1,
    }));
  } catch {
    return [];
  }
}

// ==================== HOMEPAGE ====================

export async function getHomepageData() {
  const [komikLatest, komikPopular, animeLatest, animeRecommended] = await Promise.all([
    getKomikLatest("mirror").catch(() => []),
    getKomikPopular(1).catch(() => []),
    getAnimeLatest().catch(() => []),
    getAnimeRecommended(1).catch(() => []),
  ]);

  return {
    komikLatest,
    komikPopular,
    animeLatest,
    animeRecommended,
  };
}

// ==================== TRANSFORMERS ====================

function transformAnimeList(raw: RawAnimeListItem): Anime {
  return {
    urlId: raw.urlId || raw.url_id || raw.url || "",
    title: raw.title || raw.judul || "",
    thumbnail: raw.thumbnail || raw.image || raw.cover || "",
    synopsis: raw.synopsis || raw.sinopsis || raw.description,
    rating: raw.rating,
    type: raw.type,
    status: raw.status,
    genres: raw.genres || raw.genre || [],
    episodes: (raw.episodes || raw.chapter || []).map((ep) => ({
      title: ep.title || ep.ch || "",
      url: ep.url,
      date: ep.date,
    })),
  };
}

function transformAnimeDetail(raw: RawAnimeListItem): Anime {
  return {
    urlId: raw.urlId || raw.url_id || raw.url || "",
    title: raw.title || raw.judul || "",
    thumbnail: raw.thumbnail || raw.image || raw.cover || "",
    cover: raw.cover || raw.thumbnail || raw.image,
    synopsis: raw.synopsis || raw.sinopsis || raw.description,
    rating: raw.rating,
    type: raw.type,
    status: raw.status,
    genres: raw.genres || raw.genre || [],
    episodes: (raw.episodes || raw.chapter || []).map((ep) => ({
      title: ep.title || ep.ch || "",
      url: ep.url,
      date: ep.date,
    })),
    totalEpisodes: raw.total_episodes || raw.totalEpisodes,
  };
}

function transformKomik(raw: RawKomikItem): Komik {
  return {
    manga_id: raw.manga_id || "",
    title: raw.title || "",
    thumbnail: raw.thumbnail || raw.cover || raw.cover_image_url || "",
    cover: raw.cover || raw.thumbnail || raw.cover_image_url,
    type: raw.type,
    status:
      typeof raw.status === "number" ? (raw.status === 1 ? "Ongoing" : "Completed") : raw.status,
    rating: raw.rating || raw.user_rate,
    description: raw.description || raw.synopsis,
    author: raw.author || raw.taxonomy?.Author?.[0]?.name,
    artist: raw.artist || raw.taxonomy?.Artist?.[0]?.name,
    genres: raw.genres || raw.taxonomy?.Genre?.map((g) => g.name) || [],
    chapters: (raw.chapters || []).map((ch) => ({
      chapter_id: ch.chapter_id || ch.id || "",
      title: ch.title || `Chapter ${ch.chapter || ch.chapter_number}`,
      chapter: ch.chapter || ch.chapter_number,
      date: ch.date || ch.created_at,
    })),
    latestChapter: raw.latest_chapter || raw.latestChapter,
    updatedAt: raw.updated_at || raw.updatedAt,
  };
}

function transformKomikChapter(raw: RawKomikChapterItem): KomikChapter {
  return {
    chapter_id: raw.chapter_id || raw.id || "",
    title: raw.title || `Chapter ${raw.chapter || raw.chapter_number}`,
    chapter: raw.chapter || raw.chapter_number || 0,
    date: raw.date || raw.created_at,
  };
}
