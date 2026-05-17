"use client";

import { useRef, useEffect } from "react";
import { useSoundCloudPlayer } from "@/hooks/useSoundCloudPlayer";

export function SoundCloudWidget() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useSoundCloudPlayer(iframeRef);

  return (
    <iframe
      ref={iframeRef}
      id="sc-widget"
      width="100%"
      height="166"
      allow="autoplay"
      className="hidden"
      src={
        "https://w.soundcloud.com/player/?" +
        new URLSearchParams({
          url: "https://soundcloud.com/user18081971/katiacid",
          auto_play: "false",
          buying: "false",
          sharing: "false",
          show_artwork: "false",
          show_comments: "false",
        }).toString()
      }
    />
  );
}
