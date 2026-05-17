"use client";
import React, { useRef, useState } from "react";
import { Track } from "@/data/tracks";
import { tracks } from "@/data/tracks";
import { usePlayerStore } from "@/store/playerStore";

const DRAG_THRESHOLD = 150;
const CARD_WIDTH = 300;

export default function SwipeableTrackTitle() {
  const {
    currentTrack,
    nextTrack,
    prevTrack,
    queue,
    currentIndex,
    playNext,
    playPrev,
  } = usePlayerStore();

  const [xOffset, setXOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [cardPositions, setCardPositions] = useState([-1, 0, 1]);
  const [disableTransition, setDisableTransition] = useState(false);
  const startX = useRef(0);

  const onDragStart = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const onDragMove = (e: React.PointerEvent) => {
    const newOffset = e.clientX - startX.current;

    if (isDragging) {
      setXOffset(newOffset);
      console.log(e.clientX - startX.current);
    }
  };

  const onDragEnd = () => {
    if (Math.abs(xOffset) >= DRAG_THRESHOLD) {
      const dir = Math.sign(xOffset);
      setCardPositions(
        cardPositions.map((e) => {
          return e + dir;
        }),
      );

      setIsDragging(false);
      setXOffset(0);

      setTimeout(() => {
        if (dir === -1) {
          playNext();
        } else {
          playPrev();
        }

        setCardPositions([-1, 0, 1]);
        setDisableTransition(true);
        requestAnimationFrame(() => {
          setDisableTransition(false);
        });
      }, 100);

      return;
    }

    startX.current = 0;
    setIsDragging(false);
    setXOffset(0);
  };

  const getCardOpacity = (xOffset: number, cardPosition: number) => {
    const cardPositionAbs = Math.abs(cardPosition);
    const xOffsetAbs = Math.abs(xOffset);
    const slotOffset = Math.abs(cardPosition) * CARD_WIDTH;
    const halfCardWidth = CARD_WIDTH / 2;
    const totalOpacityOffset =
      cardPositionAbs === 1 ? slotOffset - xOffsetAbs : slotOffset + xOffsetAbs;
    return `${((halfCardWidth - totalOpacityOffset) / halfCardWidth) * 100}%`;
  };

  return (
    <div
      className="overflow-hidden relative touch-none"
      style={{ width: CARD_WIDTH, height: "20px" }}
      onPointerDown={onDragStart}
      onPointerMove={onDragMove}
      onPointerUp={onDragEnd}
    >
      {" "}
      {[prevTrack(), currentTrack(), nextTrack()].map((track, index) => {
        const slotOffset = cardPositions[index] * CARD_WIDTH;
        const totalOffset = slotOffset + xOffset;
        return (
          <div
            key={index}
            className="font-bold text-white rounded-2xl"
            style={{
              transform: `translateX(${totalOffset}px)`,
              opacity: getCardOpacity(xOffset, cardPositions[index]),
              position: "absolute",
              transition:
                isDragging || disableTransition
                  ? "none"
                  : "transform 100ms ease-in-out",
              width: CARD_WIDTH,
            }}
          >
            {track?.title}
          </div>
        );
      })}
    </div>
  );
}
