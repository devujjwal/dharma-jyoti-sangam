import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Music } from "lucide-react";
import type { Bhajan } from "@/hooks/use-bhajans";

interface BhajanPlayerState {
  queue: Bhajan[];
  currentIndex: number;
  isPlaying: boolean;
}

let globalState: BhajanPlayerState = { queue: [], currentIndex: -1, isPlaying: false };
let listeners: Set<() => void> = new Set();

function notify() {
  listeners.forEach((l) => l());
}

export function playBhajan(bhajan: Bhajan, queue?: Bhajan[]) {
  if (queue) {
    globalState.queue = queue;
    globalState.currentIndex = queue.findIndex((b) => b.id === bhajan.id);
  } else {
    const idx = globalState.queue.findIndex((b) => b.id === bhajan.id);
    if (idx >= 0) {
      globalState.currentIndex = idx;
    } else {
      globalState.queue = [bhajan];
      globalState.currentIndex = 0;
    }
  }
  globalState.isPlaying = true;
  notify();
}

export function stopPlayer() {
  globalState = { queue: [], currentIndex: -1, isPlaying: false };
  notify();
}

function useBhajanPlayer() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const cb = () => setTick((t) => t + 1);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);
  return globalState;
}

const BhajanPlayer = forwardRef<HTMLDivElement>((_, ref) => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const state = useBhajanPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  const current = state.currentIndex >= 0 ? state.queue[state.currentIndex] : null;

  // Sync audio element
  useEffect(() => {
    if (!current?.audio_url) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = current.audio_url;
    audio.volume = muted ? 0 : volume;
    if (state.isPlaying) {
      audio.play().catch(() => {});
    }
  }, [current?.id, current?.audio_url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (state.isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [state.isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    }
  }, []);

  const handleEnded = useCallback(() => {
    if (state.currentIndex < state.queue.length - 1) {
      globalState.currentIndex++;
      notify();
    } else {
      globalState.isPlaying = false;
      notify();
    }
  }, [state.currentIndex, state.queue.length]);

  const togglePlay = () => {
    globalState.isPlaying = !globalState.isPlaying;
    notify();
  };

  const prev = () => {
    if (state.currentIndex > 0) {
      globalState.currentIndex--;
      globalState.isPlaying = true;
      notify();
    }
  };

  const next = () => {
    if (state.currentIndex < state.queue.length - 1) {
      globalState.currentIndex++;
      globalState.isPlaying = true;
      notify();
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = pct * duration;
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!current) return null;

  const hasAudio = !!current.audio_url;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />
      <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-md shadow-2xl">
        <div className="container mx-auto px-4">
          {/* Progress bar */}
          {hasAudio && duration > 0 && (
            <div className="h-1 -mt-px cursor-pointer group" onClick={seek}>
              <div className="h-full bg-muted relative">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(progress / duration) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 py-2.5">
            {/* Track info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-devanagari font-semibold text-foreground truncate">
                  {isHi ? current.title_hi : current.title_en}
                </p>
                <p className="text-xs text-muted-foreground font-devanagari truncate">
                  {isHi ? current.deity_hi : current.deity_en}
                  {hasAudio && duration > 0 && ` · ${formatTime(progress)} / ${formatTime(duration)}`}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={prev}
                disabled={state.currentIndex <= 0}
                className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-30"
              >
                <SkipBack className="w-4 h-4 text-foreground" />
              </button>

              {hasAudio ? (
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-full text-primary-foreground transition-colors"
                  style={{ background: "var(--gradient-saffron)" }}
                >
                  {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              ) : (
                <div className="px-3 py-1.5 rounded-full bg-muted text-xs font-devanagari text-muted-foreground">
                  {isHi ? "जल्द आ रहा है" : "Coming Soon"}
                </div>
              )}

              <button
                onClick={next}
                disabled={state.currentIndex >= state.queue.length - 1}
                className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-30"
              >
                <SkipForward className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Volume & Close */}
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => setMuted(!muted)} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                {muted ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-muted-foreground" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                className="w-16 h-1 accent-primary"
              />
            </div>
            <button onClick={stopPlayer} className="p-1.5 rounded-full hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

BhajanPlayer.displayName = "BhajanPlayer";

export default BhajanPlayer;
