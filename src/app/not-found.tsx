import { Book, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex flex-col items-center">
        <div className="text-primary mb-6 text-9xl font-bold tracking-tighter">404</div>
        <div className="bg-primary/10 rounded-full p-6">
          <Search className="text-primary h-16 w-16" />
        </div>
      </div>
      <h2 className="mb-4 text-3xl font-bold">Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground mb-10 max-w-md text-lg">
        Maaf, halaman yang Anda cari tidak ditemukan. Mungkin telah dihapus, namanya telah diubah,
        atau sementara tidak tersedia.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-medium shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <Home className="h-5 w-5" />
          Kembali ke Beranda
        </Link>
        <Link
          href="/komik"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-medium shadow-md transition-all hover:scale-105"
        >
          <Book className="h-5 w-5" />
          Jelajahi Komik
        </Link>
      </div>
    </div>
  );
}
