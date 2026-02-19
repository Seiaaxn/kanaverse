"use client";

import { SearchBar } from "@/components/ui";
import { Book, Film, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="from-primary/5 via-background to-background relative overflow-hidden bg-gradient-to-b py-20 md:py-32">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full blur-3xl" />
        <div
          className="bg-accent/5 absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Platform Baca Komik Terlengkap
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Baca Komik & Nonton Anime <span className="gradient-text">Favorit Kamu</span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground mb-10 max-w-2xl text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Koleksi terlengkap manga, manhwa, dan manhua dengan subtitle Indonesia. Update setiap
            hari, 100% gratis selamanya!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-2xl"
          >
            <SearchBar className="shadow-primary/10 w-full shadow-lg" />
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/komik"
              className="bg-primary text-primary-foreground hover:bg-primary/90 group shadow-primary/25 hover:shadow-primary/30 flex items-center gap-2 rounded-full px-8 py-4 text-base font-medium shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Book className="h-5 w-5 transition-transform group-hover:scale-110" />
              Jelajahi Komik
            </Link>
            <Link
              href="/anime"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 group flex items-center gap-2 rounded-full px-8 py-4 text-base font-medium shadow-lg transition-all hover:scale-105"
            >
              <Film className="h-5 w-5 transition-transform group-hover:scale-110" />
              Jelajahi Anime
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-primary mb-1 text-3xl font-bold md:text-4xl">10K+</div>
              <div className="text-muted-foreground text-sm">Komik</div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-1 text-3xl font-bold md:text-4xl">5K+</div>
              <div className="text-muted-foreground text-sm">Anime</div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-1 text-3xl font-bold md:text-4xl">Daily</div>
              <div className="text-muted-foreground text-sm">Update</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
          }
              
