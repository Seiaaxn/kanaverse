import { getAnimeLatest, getAnimeMovie, getAnimeRecommended } from "@/lib/api-client";
import { Card, SearchBar, Pagination } from "@/components/ui";
import { Film, Sparkles, Clapperboard } from "lucide-react";
import type { Metadata } from "next";
import type { Anime } from "@/types";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anime",
  description: "Nonton anime subtitle Indonesia terlengkap dengan update terbaru",
};

interface AnimePageProps {
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export default async function AnimePage({ searchParams }: AnimePageProps) {
  const params = await searchParams;
  const sort = params.sort || "latest";
  const page = parseInt(params.page || "1", 10);

  const [latestAnime, recommendedAnime, movieAnime] = await Promise.all([
    getAnimeLatest().catch(() => []),
    getAnimeRecommended(page).catch(() => []),
    getAnimeMovie().catch(() => []),
  ]);

  const displayAnime =
    sort === "recommended" ? recommendedAnime : sort === "movie" ? movieAnime : latestAnime;

  const filters = [
    { label: "Terbaru", value: "latest", href: "/anime", icon: Sparkles },
    { label: "Rekomendasi", value: "recommended", href: "/anime?sort=recommended", icon: Sparkles },
    { label: "Movie", value: "movie", href: "/anime?sort=movie", icon: Clapperboard },
  ];

  // Build current URL for pagination
  const buildPaginationUrl = () => {
    const urlParams = new URLSearchParams();
    if (sort !== "latest") urlParams.set("sort", sort);
    return `/anime?${urlParams.toString()}`;
  };

  // Estimated total pages for recommended
  const estimatedTotalPages = sort === "recommended" ? 10 : 1;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Film className="text-primary h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Anime</h1>
            <p className="text-muted-foreground">Nonton anime subtitle Indonesia terlengkap</p>
          </div>
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Cari judul anime..."
          searchPath="/anime/search"
          className="max-w-xl"
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.value}
                href={f.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  sort === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          {sort === "movie" ? (
            <Clapperboard className="text-primary h-5 w-5" />
          ) : (
            <Sparkles className="text-primary h-5 w-5" />
          )}
          <h2 className="text-xl font-bold">
            {sort === "recommended"
              ? "Anime Rekomendasi"
              : sort === "movie"
                ? "Anime Movie"
                : "Anime Terbaru"}
          </h2>
          {sort === "recommended" && (
            <span className="text-muted-foreground ml-2 text-sm">Halaman {page}</span>
          )}
        </div>

        {displayAnime.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {displayAnime.map((anime: Anime, index: number) => (
                <Card key={anime.urlId} item={anime} type="anime" index={index} />
              ))}
            </div>

            {/* Pagination for recommended */}
            {sort === "recommended" && (
              <Pagination
                currentPage={page}
                totalPages={estimatedTotalPages}
                baseUrl={buildPaginationUrl()}
                className="mt-8"
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Film className="text-muted-foreground/50 mb-4 h-16 w-16" />
            <p className="text-lg font-medium">Tidak ada anime ditemukan</p>
            <p className="text-muted-foreground text-sm">Coba filter atau pencarian yang berbeda</p>
          </div>
        )}
      </section>

      {/* Movie Section (if not already showing movies) */}
      {sort !== "movie" && movieAnime.length > 0 && (
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clapperboard className="text-primary h-5 w-5" />
              <h2 className="text-xl font-bold">Anime Movie</h2>
            </div>
            <Link href="/anime?sort=movie" className="text-primary text-sm hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movieAnime.slice(0, 6).map((anime: Anime, index: number) => (
              <Card key={anime.urlId} item={anime} type="anime" index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended Section (if not already showing recommended) */}
      {sort !== "recommended" && recommendedAnime.length > 0 && (
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              <h2 className="text-xl font-bold">Rekomendasi</h2>
            </div>
            <Link href="/anime?sort=recommended" className="text-primary text-sm hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {recommendedAnime.slice(0, 6).map((anime: Anime, index: number) => (
              <Card key={anime.urlId} item={anime} type="anime" index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
