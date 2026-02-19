import type { Anime, AnimeEpisode, Komik, KomikChapter } from "./index";
import type {
  RawKomik,
  RawKomikChapter,
  RawAnimeList,
  RawAnimeDetail,
  RawAnimeChapter,
} from "./api-raw";

// ==================== KOMIK TRANSFORMERS ====================

export function transformKomik(raw: RawKomik): Komik {
  return {
    manga_id: raw.manga_id,
    title: raw.title,
    thumbnail: raw.cover_portrait_url || raw.cover_image_url,
    cover: raw.cover_image_url,
    type: raw.taxonomy?.Format?.[0]?.name,
    status: raw.status === 1 ? "Ongoing" : "Completed",
    rating: raw.user_rate,
    description: raw.description,
    author: raw.taxonomy?.Author?.map((a) => a.name).join(", "),
    artist: raw.taxonomy?.Artist?.map((a) => a.name).join(", "),
    genres: raw.taxonomy?.Genre?.map((g) => g.name) || [],
    latestChapter: raw.latest_chapter_number?.toString(),
    updatedAt: raw.updated_at || raw.latest_chapter_time,
  };
}

export function transformKomikChapter(raw: RawKomikChapter): KomikChapter {
  return {
    chapter_id: raw.chapter_id,
    title: raw.chapter_title || `Chapter ${raw.chapter_number}`,
    chapter: raw.chapter_number,
    url: raw.chapter_id,
    date: raw.release_date,
  };
}

// ==================== ANIME TRANSFORMERS ====================

export function transformAnimeList(raw: RawAnimeList): Anime {
  return {
    urlId: raw.url,
    title: raw.judul,
    thumbnail: raw.cover,
    cover: raw.cover,
    type: "TV", // Default, will be updated in detail
    status: raw.status,
    score: raw.score,
    rating: raw.score,
    genres: raw.genre || [],
    totalEpisodes: raw.total_episode,
    studio: raw.studio,
  };
}

export function transformAnimeDetail(raw: RawAnimeDetail): Anime {
  const episodes: AnimeEpisode[] =
    raw.chapter?.map((ch) => ({
      episodeId: ch.url,
      url: ch.url,
      title: `Episode ${ch.ch || ch.id}`,
      episode: ch.ch || ch.id,
      date: ch.date,
    })) || [];

  return {
    urlId: raw.series_id,
    title: raw.judul,
    thumbnail: raw.cover,
    cover: raw.cover,
    poster: raw.cover,
    type: raw.type,
    status: raw.status,
    rating: raw.rating,
    score: raw.rating,
    description: raw.sinopsis,
    synopsis: raw.sinopsis,
    genres: raw.genre || [],
    episodes: episodes,
    chapter: episodes, // API uses 'chapter' for episodes
    totalEpisodes: raw.chapter?.length,
    studio: raw.author, // Author field contains studio name
    updatedAt: raw.published,
  };
}

export function transformAnimeChapter(raw: RawAnimeChapter): AnimeEpisode {
  return {
    episodeId: raw.url,
    url: raw.url,
    title: `Episode ${raw.ch || raw.id}`,
    episode: raw.ch || raw.id,
    date: raw.date,
  };
    }
    
