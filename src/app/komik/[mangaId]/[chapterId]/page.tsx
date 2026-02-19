import { getKomikChapterList, getKomikDetail, getKomikImages } from "@/lib/api-client";
import { getImageUrl, truncate } from "@/lib/utils";
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, Home, List } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HistoryTracker } from "@/components/komik/HistoryTracker";

interface ReaderPageProps {
  params: Promise<{ mangaId: string; chapterId: string }>;
}

export async function generateMetadata({ params }: ReaderPageProps): Promise<Metadata> {
  const { mangaId } = await params;
  const komik = await getKomikDetail(mangaId);

  if (!komik) {
    return { title: "Komik tidak ditemukan" };
  }

  return {
    title: `Baca ${komik.title}`,
    description: truncate(`Baca ${komik.title} secara gratis di KomikManga`, 160),
  };
}

export default async function KomikReaderPage({ params }: ReaderPageProps) {
  const { mangaId, chapterId } = await params;

  const [komik, chapters, images] = await Promise.all([
    getKomikDetail(mangaId),
    getKomikChapterList(mangaId),
    getKomikImages(chapterId),
  ]);

  if (!komik || !images || images.length === 0) {
    notFound();
  }

  // Find current, prev, next chapter
  const currentIndex = chapters.findIndex((ch) => ch.chapter_id === chapterId);
  const currentChapter = chapters[currentIndex];
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  // Get image URLs
  const imageUrls = images.map((img) => {
    if (typeof img === "string") return img;
    return img.url;
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Track reading history */}
      <HistoryTracker
        type="komik"
        itemId={mangaId}
        title={komik.title}
        thumbnail={komik.thumbnail || komik.cover}
        progress={chapterId}
        progressTitle={currentChapter?.title || `Chapter ${chapterId}`}
      />
      {/* Header */}
      <header className="bg-background/95 border-border sticky top-0 z-50 border-b backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Back button */}
            <Link
              href={`/komik/${mangaId}`}
              className="hover:text-primary flex items-center gap-2 text-sm transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>

            {/* Title */}
            <div className="flex-1 px-4 text-center">
              <h1 className="truncate text-sm font-medium">{komik.title}</h1>
              <p className="text-muted-foreground truncate text-xs">
                {currentChapter?.title || `Chapter ${chapterId}`}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hover:bg-accent flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              >
                <Home className="h-4 w-4" />
              </Link>
              <Link
                href={`/komik/${mangaId}`}
                className="hover:bg-accent flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              >
                <List className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation (top) */}
      <nav className="bg-background border-border border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {prevChapter ? (
              <Link
                href={`/komik/${mangaId}/${prevChapter.chapter_id}`}
                className="text-primary flex items-center gap-2 text-sm hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Prev
              </Link>
            ) : (
              <span className="text-muted-foreground text-sm">
                <ArrowLeft className="mr-1 inline h-4 w-4" />
                Prev
              </span>
            )}

            <span className="text-sm font-medium">{currentChapter?.title || "Loading..."}</span>

            {nextChapter ? (
              <Link
                href={`/komik/${mangaId}/${nextChapter.chapter_id}`}
                className="text-primary flex items-center gap-2 text-sm hover:underline"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="text-muted-foreground text-sm">
                Next
                <ArrowRight className="ml-1 inline h-4 w-4" />
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Images */}
      <main className="flex flex-col items-center bg-black py-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative w-full max-w-4xl">
            <Image
              src={getImageUrl(url)}
              alt={`Page ${index + 1}`}
              width={1000}
              height={1500}
              className="h-auto w-full"
              priority={index < 3}
              unoptimized
            />
          </div>
        ))}
      </main>

      {/* Navigation (bottom) */}
      <nav className="bg-background border-border sticky bottom-0 border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {prevChapter ? (
              <Link
                href={`/komik/${mangaId}/${prevChapter.chapter_id}`}
                className="bg-secondary hover:bg-secondary/80 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Chapter Sebelumnya
              </Link>
            ) : (
              <div />
            )}

            {nextChapter ? (
              <Link
                href={`/komik/${mangaId}/${nextChapter.chapter_id}`}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Chapter Selanjutnya
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href={`/komik/${mangaId}`}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Kembali ke Detail
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
  }
      
