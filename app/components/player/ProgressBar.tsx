"use client";

import { usePlayerStore } from "@/store/playerStore";
import { useRef } from "react";

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function ProgressBar() {
  const { progress, currentTrack } = usePlayerStore();
  const track = currentTrack();
  const barRef = useRef<HTMLDivElement>(null);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!barRef.current || !track) return;
    const rect = barRef.current.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    const targetMs = fraction * track.durationMs;

    usePlayerStore.getState().seekTo(targetMs);
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs text-zinc-500 tabular-nums w-10 text-right hidden">
        {formatTime(progress.position)}
      </span>
      {/* Track */}
      <div
        ref={barRef}
        onClick={handleClick}
        className="flex-1 h-0.5 bg-zinc-700 cursor-pointer group relative"
      >
        {/* Buffered */}
        <div
          className="absolute inset-y-0 left-0 bg-zinc-600"
          style={{ width: `${progress.buffered * 100}%` }}
        />
        {/* Played */}
        <div
          className="absolute inset-y-0 left-0 bg-white "
          style={{ width: `${progress.relative * 100}%` }}
        />
        {/* Thumb — only visible on hover */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white
                     rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                     -translate-x-1/2"
          style={{ left: `${progress.relative * 100}%` }}
        />
      </div>
      <span className="text-xs text-zinc-500 tabular-nums w-10 hidden">
        {track ? formatTime(track.durationMs) : "--:--"}
      </span>
    </div>
  );
}
