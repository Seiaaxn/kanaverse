import { getKomikChapterList, getKomikDetail } from "@/lib/api-client";
import { getImageUrl, truncate } from "@/lib/utils";
import { Book, BookOpen, Clock, Star, User, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface DetailPageProps {
  params: Promise<{ mangaId: string }>;
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { mangaId } = await params;

  try {
    const komik = await getKomikDetail(mangaId);

    if (!komik) {
      return { title: "Komik tidak ditemukan" };
    }

    return {
      title: komik.title,
      description: truncate(komik.description || `Baca ${komik.title} secara gratis`, 160),
      openGraph: {
        images: komik.thumbnail ? [komik.thumbnail] : [],
      },
    };
  } catch {
    return { title: "Komik tidak ditemukan" };
  }
}

export default async function KomikDetailPage({ params }: DetailPageProps) {
  const { mangaId } = await params;

  let komik;
  let chapters: Awaited<ReturnType<typeof getKomikChapterList>> = [];

  try {
    [komik, chapters] = await Promise.all([getKomikDetail(mangaId), getKomikChapterList(mangaId)]);
  } catch (error) {
    console.error("Error fetching komik detail:", error);
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertTriangle className="mb-4 h-16 w-16 text-yellow-500" />
          <h1 className="mb-2 text-2xl font-bold">Gagal Memuat Data</h1>
          <p className="text-muted-foreground mb-6">
            Terjadi kesalahan saat memuat detail komik. Silakan coba lagi nanti.
          </p>
          <Link href="/komik" className="text-primary hover:underline">
            Kembali ke Daftar Komik
          </Link>
        </div>
      </div>
    );
  }

  if (!komik) {
    notFound();
  }

  const thumbnail = komik.thumbnail || komik.cover || "";

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
          {/* Cover */}
          <div className="mx-auto flex-shrink-0 md:mx-0">
            <div className="relative aspect-[2/3] w-48 overflow-hidden rounded-lg shadow-2xl md:w-56">
              <Image
                src={getImageUrl(thumbnail)}
                alt={komik.title}
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
            {komik.type && (
              <span className="bg-primary/90 text-primary-foreground mx-auto mb-3 inline-flex w-fit rounded px-3 py-1 text-xs font-medium capitalize md:mx-0">
                {komik.type}
              </span>
            )}

            <h1 className="mb-3 text-2xl font-bold md:text-4xl">{komik.title}</h1>

            {/* Meta info */}
            <div className="text-muted-foreground mb-4 flex flex-wrap items-center justify-center gap-4 text-sm md:justify-start">
              {komik.author && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {komik.author}
                </span>
              )}
              {komik.status && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {komik.status}
                </span>
              )}
              {komik.rating && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-yellow-500" />
                  {komik.rating}
                </span>
              )}
            </div>

            {/* Genres */}
            {komik.genres && komik.genres.length > 0 && (
              <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
                {komik.genres.map((genre) => (
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
            {komik.description && (
              <p className="text-muted-foreground line-clamp-4 max-w-2xl text-sm">
                {komik.description}
              </p>
            )}

            {/* Action buttons */}
            {chapters.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                <Link
                  href={`/komik/${mangaId}/${chapters[0].chapter_id}`}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Baca Chapter Pertama
                </Link>
                <Link
                  href={`/komik/${mangaId}/${chapters[chapters.length - 1].chapter_id}`}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors"
                >
                  <Book className="h-4 w-4" />
                  Chapter Terbaru
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <Book className="text-primary h-5 w-5" />
          <h2 className="text-xl font-bold">Daftar Chapter</h2>
          <span className="text-muted-foreground text-sm">({chapters.length} chapter)</span>
        </div>

        {chapters.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter) => (
              <Link
                key={chapter.chapter_id}
                href={`/komik/${mangaId}/${chapter.chapter_id}`}
                className="border-border bg-card hover:border-primary/50 hover:bg-accent group flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="line-clamp-1 font-medium">{chapter.title}</p>
                    {chapter.date && (
                      <p className="text-muted-foreground text-xs">{chapter.date}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <Book className="text-muted-foreground/50 mb-4 h-12 w-12" />
            <p className="text-lg font-medium">Belum ada chapter</p>
            <p className="text-muted-foreground text-sm">Chapter akan segera ditambahkan</p>
          </div>
        )}
      </section>
    </div>
  );
            }
        
