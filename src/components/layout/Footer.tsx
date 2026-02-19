import { Book } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-border bg-card/50 border-t backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="bg-primary shadow-primary/25 flex h-9 w-9 items-center justify-center rounded-xl shadow-lg">
                <Book className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary">Komik</span>
                <span>Manga</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm">
              Baca komik dan nonton anime favorit kamu secara gratis. Koleksi terlengkap dengan
              update terbaru setiap hari.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-semibold">Navigasi</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/komik" className="hover:text-primary transition-colors">
                  Komik
                </Link>
              </li>
              <li>
                <Link href="/anime" className="hover:text-primary transition-colors">
                  Anime
                </Link>
              </li>
              <li>
                <Link href="/bookmark" className="hover:text-primary transition-colors">
                  Bookmark
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-primary transition-colors">
                  History
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-semibold">Kategori Komik</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/komik?type=manhwa" className="hover:text-primary transition-colors">
                  Manhwa
                </Link>
              </li>
              <li>
                <Link href="/komik?type=manhua" className="hover:text-primary transition-colors">
                  Manhua
                </Link>
              </li>
              <li>
                <Link href="/komik?type=manga" className="hover:text-primary transition-colors">
                  Manga
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-border mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} KanaVerse. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Powered by{" "}
            <a
              href="https://xenzee.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              KanaVerse Team
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
                  }
