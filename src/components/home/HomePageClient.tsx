"use client";

import { Card, SearchBar } from "@/components/ui";
import { ArrowRight, Book, Film, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Anime, Komik } from "@/types";

interface HomePageClientProps {
  komikLatest: Komik[];
  komikPopular: Komik[];
  animeLatest: Anime[];
  animeRecommended: Anime[];
}

export function HomePageClient({
  komikLatest,
  komikPopular,
  animeLatest,
  animeRecommended,
}: HomePageClientProps) {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="from-primary/5 via-background to-background relative overflow-hidden bg-gradient-to-b py-16 md:py-24">
        <div className="bg-grid-pattern absolute inset-0 opacity-5" />
        <div className="relative container mx-auto px-4">
          <motion.div
            className="mx-auto flex max-w-3xl flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h1
              className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Baca Komik & Nonton Anime <span className="gradient-text">Favorit Kamu</span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground mb-8 max-w-xl text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Koleksi terlengkap manhwa, manhua, manga, dan anime dengan subtitle Indonesia. Update
              setiap hari, gratis selamanya!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-lg"
            >
              <SearchBar className="w-full" />
            </motion.div>
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/komik"
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all hover:scale-105"
              >
                <Book className="h-4 w-4" />
                Jelajahi Komik
              </Link>
              <Link
                href="/anime"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all hover:scale-105"
              >
                <Film className="h-4 w-4" />
                Jelajahi Anime
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Komik Terbaru */}
      <Section
        title="Komik Terbaru"
        description="Update chapter terbaru hari ini"
        icon={<Sparkles className="text-primary h-5 w-5" />}
        href="/komik"
        linkText="Lihat Semua"
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {komikLatest.slice(0, 12).map((komik, index) => (
            <Card key={komik.manga_id} item={komik} type="komik" index={index} />
          ))}
        </div>
      </Section>

      {/* Anime Terbaru */}
      <Section
        title="Anime Terbaru"
        description="Episode terbaru yang baru rilis"
        icon={<Film className="text-primary h-5 w-5" />}
        href="/anime"
        linkText="Lihat Semua"
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {animeLatest.slice(0, 12).map((anime, index) => (
            <Card key={anime.urlId} item={anime} type="anime" index={index} />
          ))}
        </div>
      </Section>

      {/* Komik Populer */}
      <Section
        title="Komik Populer"
        description="Komik paling banyak dibaca"
        icon={<TrendingUp className="text-primary h-5 w-5" />}
        href="/komik?sort=popular"
        linkText="Lihat Semua"
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {komikPopular.slice(0, 12).map((komik, index) => (
            <Card key={komik.manga_id} item={komik} type="komik" index={index} />
          ))}
        </div>
      </Section>

      {/* Anime Rekomendasi */}
      <Section
        title="Anime Rekomendasi"
        description="Pilihan anime terbaik untuk kamu"
        icon={<Sparkles className="text-primary h-5 w-5" />}
        href="/anime?sort=recommended"
        linkText="Lihat Semua"
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {animeRecommended.slice(0, 12).map((anime, index) => (
            <Card key={anime.urlId} item={anime} type="anime" index={index} />
          ))}
        </div>
      </Section>
    </div>
  );
}

interface SectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  linkText: string;
  children: React.ReactNode;
}

function Section({ title, description, icon, href, linkText, children }: SectionProps) {
  return (
    <motion.section
      className="py-8 md:py-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-6 flex items-center justify-between"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
          </div>
          <Link
            href={href}
            className="text-primary group flex items-center gap-1 text-sm hover:underline"
          >
            {linkText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
        {children}
      </div>
    </motion.section>
  );
                }
        
