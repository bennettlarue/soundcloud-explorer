"use client";

import { useEffect, useRef, RefObject, use } from "react";
import { usePlayerStore } from "@/store/playerStore";

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById(id)) return resolve();
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export function useSoundCloudPlayer(
  iframeRef: RefObject<HTMLIFrameElement | null>,
) {
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const isWidgetReady = useRef(false);

  const { currentTrack, isPlaying, setIsPlaying, playNext, setProgress } =
    usePlayerStore();

  useEffect(() => {
    async function init() {
      await loadScript(
        "https://w.soundcloud.com/player/api.js",
        "sc-widget-api",
      );

      if (!iframeRef.current || !window.SC) return;

      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;

      widget.bind(window.SC.Widget.Events.READY, () => {
        isWidgetReady.current = true;

        const track = usePlayerStore.getState().currentTrack();
        if (track) {
          widget.load(track.scUrl, {
            auto_play: usePlayerStore.getState().isPlaying,
          });
        }
      });

      widget.bind(window.SC.Widget.Events.FINISH, () => {
        usePlayerStore.getState().playNext();
      });

      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        usePlayerStore.getState().setIsPlaying(false);
      });

      widget.bind(window.SC.Widget.Events.PLAY, () => {
        usePlayerStore.getState().setIsPlaying(true);
      });

      widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (data) => {
        usePlayerStore.getState().setProgress({
          position: data.currentPosition,
          relative: data.relativePosition,
          buffered: data.loadedProgress,
        });
      });
    }

    const ubsub = usePlayerStore.subscribe(
      (state) => state.seekTarget,
      (target) => {
        if (target != null && widgetRef.current) {
          widgetRef.current.seekTo(target);
        }
      },
    );

    init();
  }, []);

  const currentTrackId = currentTrack()?.id;

  useEffect(() => {
    if (!widgetRef || !isWidgetReady.current) return;
    const track = usePlayerStore.getState().currentTrack();
    if (track) {
      widgetRef.current?.load(track.scUrl, {
        auto_play: usePlayerStore.getState().isPlaying,
      });
    }
  }, [currentTrackId]);

  useEffect(() => {
    if (!widgetRef || !isWidgetReady.current) return;
    if (isPlaying) {
      widgetRef.current?.play();
    } else {
      widgetRef.current?.pause();
    }
  }, [isPlaying]);
}
