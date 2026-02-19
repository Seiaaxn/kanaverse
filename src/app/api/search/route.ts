import { NextRequest, NextResponse } from "next/server";
import { searchAnime, searchKomik } from "@/lib/api-client";

export const dynamic = "force-dynamic";

interface SearchResult {
  type: "anime" | "komik";
  id: string;
  title: string;
  thumbnail: string | null | undefined;
  rating: string | number | null;
  status: string | null;
  genres: string[];
  urlId?: string;
  mangaId?: string;
}

/**
 * GET /api/search?q=query&type=anime|komik&limit=20
 * Search via external API
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  if (query.length < 2) {
    return NextResponse.json({
      results: [],
      message: "Query must be at least 2 characters",
    });
  }

  try {
    const results: SearchResult[] = [];

    // Search anime
    if (!type || type === "anime") {
      const anime = await searchAnime(query);
      const animeResults = anime.slice(0, type === "anime" ? limit : Math.floor(limit / 2));

      results.push(
        ...animeResults.map((a) => ({
          type: "anime" as const,
          id: a.urlId,
          urlId: a.urlId,
          title: a.title,
          thumbnail: a.thumbnail,
          rating: a.rating ?? null,
          status: a.status ?? null,
          genres: a.genres || [],
        }))
      );
    }

    // Search komik
    if (!type || type === "komik") {
      const komik = await searchKomik(query);
      const komikResults = komik.slice(0, type === "komik" ? limit : Math.floor(limit / 2));

      results.push(
        ...komikResults.map((k) => ({
          type: "komik" as const,
          id: k.manga_id,
          mangaId: k.manga_id,
          title: k.title,
          thumbnail: k.thumbnail,
          rating: k.rating ?? null,
          status: k.status ?? null,
          genres: k.genres || [],
        }))
      );
    }

    return NextResponse.json({
      query,
      type: type || "all",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed", results: [] }, { status: 500 });
  }
            }
