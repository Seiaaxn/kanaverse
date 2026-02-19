// ==================== RAW API RESPONSE TYPES ====================
// These types match the actual API responses from api.sansekai.my.id

// Common Meta structure for Komik API
export interface ApiMeta {
  request_id: string;
  timestamp: number;
  process_time: string;
  page?: number;
  page_size?: number;
  total_page?: number;
  total_record?: number;
}

// Common response wrapper for Komik API
export interface SansekaiResponse<T> {
  retcode: number;
  message: string;
  meta?: ApiMeta;
  data: T;
}

// ==================== KOMIK RAW TYPES ====================

export interface RawKomikTaxonomy {
  Artist?: Array<{ name: string; slug: string; taxonomy_id?: number }>;
  Author?: Array<{ name: string; slug: string; taxonomy_id?: number }>;
  Format?: Array<{ name: string; slug: string; taxonomy_id?: number }>;
  Genre?: Array<{ name: string; slug: string; taxonomy_id?: number }>;
  Type?: Array<{ name: string; slug: string; taxonomy_id?: number }>;
}

export interface RawKomik {
  manga_id: string;
  title: string;
  alternative_title?: string;
  description?: string;
  cover_image_url?: string;
  cover_portrait_url?: string;
  release_year?: string;
  status?: number; // 1 = ongoing
  user_rate?: number;
  view_count?: number;
  bookmark_count?: number;
  latest_chapter_id?: string;
  latest_chapter_number?: number;
  latest_chapter_time?: string;
  country_id?: string;
  rank?: number;
  is_recommended?: boolean;
  taxonomy?: RawKomikTaxonomy;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  chapters?: RawKomikChapterInList[];
}

export interface RawKomikChapterInList {
  chapter_id: string;
  chapter_number: number;
  created_at: string;
}

export interface RawKomikChapter {
  chapter_id: string;
  manga_id: string;
  chapter_title?: string;
  chapter_number: number;
  thumbnail_image_url?: string;
  view_count?: number;
  release_date?: string;
}

// Komik getimage response structure
export interface RawKomikImageResponse {
  chapter_id: string;
  manga_id: string;
  chapter_number: number;
  chapter_title?: string;
  base_url: string;
  base_url_low?: string;
  chapter: {
    data: string[]; // Array of image URLs
  };
  thumbnail_image_url?: string;
  view_count?: number;
  prev_chapter_id?: string | null;
  prev_chapter_number?: number | null;
  next_chapter_id?: string | null;
  next_chapter_number?: number | null;
  release_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RawKomikImage {
  image_url: string;
  page_number?: number;
}

// ==================== ANIME RAW TYPES ====================
// Note: Anime API returns ARRAY DIRECTLY for list endpoints

export interface RawAnimeList {
  id: number | string;
  url: string;
  judul: string;
  cover: string;
  lastch?: string;
  lastup?: string;
  genre?: string[];
  sinopsis?: string;
  studio?: string;
  score?: string;
  status?: string;
  rilis?: string;
  total_episode?: number;
}

export interface RawAnimeChapter {
  id: number;
  ch?: string;
  url: string;
  date?: string;
  history?: string;
  lastDurasi?: number | null;
  fullDurasi?: number | null;
}

export interface RawAnimeDetail {
  id: number;
  series_id: string;
  bookmark?: string | null;
  cover: string;
  judul: string;
  type?: string;
  countdown?: string | null;
  status?: string;
  rating?: string;
  published?: string;
  author?: string;
  genre?: string[];
  genreurl?: string[];
  sinopsis?: string;
  history?: string[];
  historyDurasi?: number[];
  historyDurasiFull?: number[];
  chapter?: RawAnimeChapter[];
}

// Note: Anime detail returns { data: [RawAnimeDetail] }
export interface RawAnimeDetailResponse {
  data: RawAnimeDetail[];
}

export interface RawAnimeVideoStream {
  reso: string;
  link: string;
  provide: number;
  id: number;
}

export interface RawAnimeVideoDetail {
  episode_id: number;
  likeCount: number;
  dislikeCount: number;
  userLikeStatus: number;
  reso: string[]; // Available resolutions
  stream: RawAnimeVideoStream[];
}

export interface RawAnimeVideoResponse {
  data: RawAnimeVideoDetail[];
}

export interface RawAnimeVideo {
  url: string;
  quality?: string;
}

// Anime video might return direct string or object
export type RawAnimeVideoData = string | RawAnimeVideo;
  
