import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Track } from "@/data/tracks";

type Progress = {
  position: number;
  relative: number;
  buffered: number;
};

type PlayerStore = {
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isShuffled: boolean;
  progress: Progress;
  shuffledQueue: Track[];
  seekTarget: number | null;

  currentTrack: () => Track | null;
  nextTrack: () => Track | null;
  prevTrack: () => Track | null;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  addToQueue: (track: Track) => void;
  playNext: () => void;
  playPrev: () => void;
  togglePlay: () => void;
  setIsPlaying: (value: boolean) => void;
  toggleShuffle: () => void;
  setProgress: (progress: Progress) => void;
  seekTo: (ms: number) => void;
};

export const usePlayerStore = create<PlayerStore>()(
  subscribeWithSelector((set, get) => ({
    queue: [],
    currentIndex: 0,
    isPlaying: false,
    isShuffled: false,
    shuffledQueue: [],
    progress: { position: 0, relative: 0, buffered: 0 },
    seekTarget: null,

    currentTrack: () => {
      const { queue, currentIndex } = get();
      return queue[currentIndex] ?? null;
    },

    nextTrack: () => {
      const { queue, currentIndex } = get();
      return queue[(currentIndex + 1) % queue.length] ?? null;
    },

    prevTrack: () => {
      const { queue, currentIndex } = get();
      return queue[(currentIndex - 1) % queue.length] ?? null;
    },

    setQueue: (tracks, startIndex = 0) =>
      set({ queue: tracks, currentIndex: startIndex, isPlaying: true }),

    addToQueue: (track) => set((s) => ({ queue: [...s.queue, track] })),

    playNext: () =>
      set((s) => ({
        currentIndex: (s.currentIndex + 1) % s.queue.length,
        isPlaying: true,
        progress: { position: 0, relative: 0, buffered: 0 },
      })),

    playPrev: () =>
      set((s) => ({
        currentIndex: (s.currentIndex - 1 + s.queue.length) % s.queue.length,
        isPlaying: true,
        progress: { position: 0, relative: 0, buffered: 0 },
      })),

    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

    setIsPlaying: (value) => set({ isPlaying: value }),

    setProgress: (progress) => set({ progress: progress }),

    toggleShuffle: () =>
      set((s) => {
        if (s.isShuffled) {
          const currentId = s.queue[s.currentIndex]?.id;
          const newIdx = s.shuffledQueue.findIndex((t) => t.id === currentId);
          return {
            isShuffled: false,
            queue: s.shuffledQueue,
            currentIndex: newIdx,
            shuffledQueue: [],
          };
        } else {
          const current = s.queue[s.currentIndex];
          const rest = s.queue.filter((_, i) => i !== s.currentIndex);
          const shuffled = [current, ...rest.sort(() => Math.random() - 0.5)];
          return {
            isShuffled: true,
            shuffledQueue: s.queue,
            queue: shuffled,
            currentIndex: 0,
          };
        }
      }),

    seekTo: (ms) => set({ seekTarget: ms }),
  })),
);
