"use client";

import { ArrowLeft, Film, Home, Settings, Volume2, VolumeX, Maximize, Play, Pause, RotateCcw, Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppStore } from "@/stores/useAppStore";

interface VideoData {
  url: string | null;
  reso: string;
  allStreams: Array<{ reso: string; url: string }>;
  availableResos: string[];
}

async function fetchAnimeVideo(episodeId: string, reso: string): Promise<VideoData | null> {
  try {
    const res = await fetch(`/api/anime/video?chapterUrlId=${episodeId}&reso=${reso}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

interface WatchPageProps {
  params: Promise<{ episodeId: string }>;
}

export default function AnimeWatchPage({ params }: WatchPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { episodeId } = use(params);

  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hlsRef = useRef<any>(null);

  const reso = searchParams.get("reso") || "480p";
  const animeTitle = searchParams.get("title") || "";
  const animeId = searchParams.get("animeId") || "";

  const { addToHistory } = useAppStore();

  const loadVideo = useCallback(async () => {
    if (!episodeId) return;

    setLoading(true);
    setError(null);
    setIsPlaying(false);

    try {
      const data = await fetchAnimeVideo(episodeId, reso);
      setVideoData(data);
      if (!data?.url) {
        setError("Video tidak tersedia untuk resolusi ini. Coba resolusi lain.");
      }
    } catch {
      setError("Gagal memuat video. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [episodeId, reso]);

  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  // Initialize HLS.js or native video
  useEffect(() => {
    if (!videoData?.url || !videoRef.current) return;

    const video = videoRef.current;
    const url = videoData.url;

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHLS = url.includes(".m3u8") || url.includes("m3u8");

    if (isHLS) {
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
          hlsRef.current = hls;
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
          video.play().catch(() => {});
        }
      }).catch(() => {
        video.src = url;
        video.play().catch(() => {});
      });
    } else {
      video.src = url;
      video.play().catch(() => {});
    }

    // Track history
    if (animeId && animeTitle) {
      addToHistory({
        type: "anime",
        itemId: animeId,
        title: animeTitle,
        progress: episodeId,
        progressTitle: `Episode ${episodeId}`,
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoData?.url, animeId, animeTitle, episodeId, addToHistory]);

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen?.();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return "0:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const changeResolution = (newReso: string) => {
    const url = new URLSearchParams(searchParams.toString());
    url.set("reso", newReso);
    router.push(`/anime/watch/${episodeId}?${url.toString()}`);
  };

  const availableResos = videoData?.availableResos?.length
    ? videoData.availableResos
    : ["360p", "480p", "720p", "1080p"];

  const currentReso = videoData?.reso || reso;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-background/95 border-border sticky top-0 z-50 border-b backdrop-blur flex-shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="hover:text-primary flex items-center gap-2 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>

            <div className="flex-1 px-4 text-center">
              <h1 className="truncate text-sm font-medium">
                {animeTitle ? `${animeTitle} — Episode ${episodeId}` : `Episode ${episodeId}`}
              </h1>
            </div>

            <Link
              href="/"
              className="hover:bg-accent flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
            >
              <Home className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Resolution selector */}
      <div className="bg-background border-border border-b flex-shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-3 flex-wrap">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              <span>Resolusi:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {availableResos.map((r) => (
                <button
                  key={r}
                  onClick={() => changeResolution(r)}
                  className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                    currentReso === r
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <main className="flex-1 flex items-center justify-center bg-black py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-white" />
            <p className="text-lg font-medium text-white">Memuat video...</p>
            <p className="text-muted-foreground mt-2 text-sm">Mengambil stream video...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Film className="text-muted-foreground/50 mb-4 h-16 w-16" />
            <p className="text-lg font-medium text-white">{error}</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Coba resolusi yang berbeda atau refresh halaman
            </p>
            <button
              onClick={loadVideo}
              className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Coba Lagi
            </button>
          </div>
        ) : videoData?.url ? (
          <div
            className="relative w-full max-w-5xl bg-black select-none"
            style={{ aspectRatio: "16/9" }}
            onMouseMove={resetControlsTimer}
            onMouseEnter={() => setShowControls(true)}
          >
            {/* Video element */}
            <video
              ref={videoRef}
              className="w-full h-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              onDurationChange={() => setDuration(videoRef.current?.duration || 0)}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onCanPlay={() => setIsBuffering(false)}
              onVolumeChange={() => {
                setIsMuted(videoRef.current?.muted || false);
                setVolume(videoRef.current?.volume || 1);
              }}
              onClick={togglePlay}
              playsInline
            />

            {/* Buffering indicator */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Loader2 className="h-12 w-12 animate-spin text-white/80" />
              </div>
            )}

            {/* Paused overlay - center play icon */}
            {!isPlaying && !isBuffering && !loading && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={togglePlay}
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-5 hover:bg-white/30 transition-colors">
                  <Play className="h-10 w-10 text-white fill-white" />
                </div>
              </div>
            )}

            {/* Controls overlay */}
            <div
              className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="px-4 pb-4 space-y-2">
                {/* Progress bar */}
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <span className="tabular-nums">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 accent-white cursor-pointer"
                  />
                  <span className="tabular-nums">{formatTime(duration)}</span>
                </div>

                {/* Buttons row */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-white/80 transition-colors"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-white/80 transition-colors"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 accent-white cursor-pointer"
                    title="Volume"
                  />

                  <div className="flex-1" />

                  <button
                    onClick={handleFullscreen}
                    className="text-white hover:text-white/80 transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Film className="text-muted-foreground/50 mb-4 h-16 w-16" />
            <p className="text-lg font-medium text-white">Video tidak tersedia</p>
            <p className="text-muted-foreground mt-2 text-sm">Coba resolusi yang berbeda</p>
          </div>
        )}
      </main>

      {/* Footer info */}
      <div className="bg-background border-border border-t flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <p className="text-muted-foreground text-center text-xs">
            Jika video tidak bisa diputar, coba ganti resolusi atau gunakan browser lain.
          </p>
        </div>
      </div>
    </div>
  );
         }
    
