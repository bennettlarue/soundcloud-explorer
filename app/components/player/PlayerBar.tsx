"use client";
import { usePlayerStore } from "@/store/playerStore";
import { tracks } from "@/data/tracks";
import { ProgressBar } from "./ProgressBar";
import SwipeableTrackTitle from "../SwipeableTrackTitle";

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    isShuffled,
    queue,
    setQueue,
    togglePlay,
    playNext,
    playPrev,
    toggleShuffle,
    currentIndex,
  } = usePlayerStore();

  const track = currentTrack();
  if (!track)
    return (
      <div>
        <p>no track playing. click the button to set a track.</p>
        <button
          className="bg-amber-500 p-1 rounded cursor-pointer hover:bg-amber-200 text-black"
          onClick={() => setQueue(tracks, 0)}
        >
          Click Here
        </button>
      </div>
    );

  return (
    <div className="flex flex-col bg-amber-400/30 px-3 rounded-lg">
      <div className="flex justify-between py-2">
        <div className="max-w-[250px]">
          <SwipeableTrackTitle />
        </div>
        <div className="flex gap-3 min-w-fit z-50">
          <div className="hidden" onClick={playPrev}>
            <img src="back.svg" />
          </div>
          <div onClick={togglePlay}>
            {isPlaying ? <img src={"pause.svg"} /> : <img src={"play.svg"} />}
          </div>
          <div className="hidden" onClick={playNext}>
            <img src="fwd.svg" />
          </div>
        </div>
      </div>
      <ProgressBar />
    </div>
  );
}
