import { getAnimeDetail } from "@/lib/api-client";
import { getImageUrl, truncate } from "@/lib/utils";
import { Calendar, Clock, Film, Play, Star, Tv, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface DetailPageProps {
  params: Promise<{ urlId: string }>;
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { urlId } = await params;

  try {
    const anime = await getAnimeDetail(urlId);

    if (!anime) {
      return { title: "Anime tidak ditemukan" };
    }

    return {
      title: anime.title,
      description: truncate(
        anime.description || anime.synopsis || `Nonton ${anime.title} secara gratis`,
        160
      ),
      openGraph: {
        images: anime.thumbnail || anime.poster ? [anime.thumbnail || anime.poster || ""] : [],
      },
    };
  } catch {
    return { title: "Anime tidak ditemukan" };
  }
}

export default async function AnimeDetailPage({ params }: DetailPageProps) {
  const { urlId } = await params;

  let anime;
  try {
    anime = await getAnimeDetail(urlId);
  } catch (error) {
    console.error("Error fetching anime detail:", error);
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertTriangle className="mb-4 h-16 w-16 text-yellow-500" />
          <h1 className="mb-2 text-2xl font-bold">Gagal Memuat Data</h1>
          <p className="text-muted-foreground mb-6">
            Terjadi kesalahan saat memuat detail anime. Silakan coba lagi nanti.
          </p>
          <Link href="/anime" className="text-primary hover:underline">
            Kembali ke Daftar Anime
          </Link>
        </div>
      </div>
    );
  }

  if (!anime) {
    notFound();
  }

  const thumbnail = anime.thumbnail || anime.poster || anime.cover || "";
  const episodes = Array.isArray(anime.episodes)
    ? anime.episodes
    : Array.isArray(anime.chapter)
      ? anime.chapter
      : [];
  const description = anime.description || anime.synopsis || "";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-8 overflow-hidden rounded-xl">
        {/* Background blur */}
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(thumbnail)}
            alt=""
            fill
            className="object-cover opacity-30 blur-2xl"
            unoptimized
          />
          <div className="from-background via-background/80 to-background/40 absolute inset-0 bg-gradient-to-t" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:p-8">
          {/* Poster */}
          <div className="mx-auto flex-shrink-0 md:mx-0">
            <div className="relative aspect-[2/3] w-48 overflow-hidden rounded-lg shadow-2xl md:w-56">
              <Image
                src={getImageUrl(thumbnail)}
                alt={anime.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-end text-center md:text-left">
            {/* Type badge */}
            {anime.type && (
              <span className="bg-primary/90 text-primary-foreground mx-auto mb-3 inline-flex w-fit rounded px-3 py-1 text-xs font-medium capitalize md:mx-0">
                {anime.type}
              </span>
            )}

            <h1 className="mb-3 text-2xl font-bold md:text-4xl">{anime.title}</h1>

            {/* Meta info */}
            <div className="text-muted-foreground mb-4 flex flex-wrap items-center justify-center gap-4 text-sm md:justify-start">
              {anime.studio && (
                <span className="flex items-center gap-1">
                  <Tv className="h-4 w-4" />
                  {anime.studio}
                </span>
              )}
              {anime.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {anime.duration}
                </span>
              )}
              {(anime.year || anime.season) && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {anime.season} {anime.year}
                </span>
              )}
              {(anime.rating || anime.score) && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-yellow-500" />
                  {anime.rating || anime.score}
                </span>
              )}
            </div>

            {/* Status */}
            {anime.status && (
              <div className="mb-4 flex justify-center md:justify-start">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    anime.status.toLowerCase().includes("ongoing")
                      ? "bg-green-500/20 text-green-500"
                      : "bg-blue-500/20 text-blue-500"
                  }`}
                >
                  {anime.status}
                </span>
              </div>
            )}

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
                {anime.genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-secondary rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-muted-foreground line-clamp-4 max-w-2xl text-sm">{description}</p>
            )}

            {/* Action buttons */}
            {episodes.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                <Link
                  href={`/anime/watch/${episodes[0].url || episodes[0].episodeId}?animeId=${encodeURIComponent(urlId)}&title=${encodeURIComponent(anime.title)}`}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Tonton Episode Pertama
                </Link>
                {episodes.length > 1 && (
                  <Link
                    href={`/anime/watch/${episodes[episodes.length - 1].url || episodes[episodes.length - 1].episodeId}?animeId=${encodeURIComponent(urlId)}&title=${encodeURIComponent(anime.title)}`}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors"
                  >
                    <Film className="h-4 w-4" />
                    Episode Terbaru
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Episode List */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <Film className="text-primary h-5 w-5" />
          <h2 className="text-xl font-bold">Daftar Episode</h2>
          <span className="text-muted-foreground text-sm">({episodes.length} episode)</span>
        </div>

        {episodes.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {episodes.map((episode, index) => (
              <Link
                key={episode.url || episode.episodeId || index}
                href={`/anime/watch/${episode.url || episode.episodeId}?animeId=${encodeURIComponent(urlId)}&title=${encodeURIComponent(anime.title)}`}
                className="border-border bg-card hover:border-primary/50 hover:bg-accent group flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <p className="line-clamp-1 font-medium">{episode.title}</p>
                    {episode.date && (
                      <p className="text-muted-foreground text-xs">{episode.date}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <Film className="text-muted-foreground/50 mb-4 h-12 w-12" />
            <p className="text-lg font-medium">Belum ada episode</p>
            <p className="text-muted-foreground text-sm">Episode akan segera ditambahkan</p>
          </div>
        )}
      </section>
    </div>
  );
            }
              
