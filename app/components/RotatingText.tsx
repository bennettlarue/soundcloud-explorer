"use client";

import React, { useEffect, useState } from "react";

type Props = { text: string; maxWidth: number };

export default function RotatingText({ text, maxWidth }: Props) {
  const gap = 30;

  const [textWidth, setTextWidth] = useState<number | null>(null);
  const isOverflowing = textWidth !== null && textWidth > maxWidth;

  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:absolute;visibility:hidden;white-space:nowrap;font:inherit;";
    probe.textContent = text;
    document.body.appendChild(probe);
    setTextWidth(probe.scrollWidth);
    document.body.removeChild(probe);
  }, [text]);

  return (
    <>
      <style>
        {`
        @keyframes rotateText {
          0% {
            transform: translateX(0);
          }

          20% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-${(textWidth ?? 0) + gap}px);
          }
        }

        .move-inside {
          animation: rotateText ${((textWidth ?? 0) + gap) / 30}s linear infinite;
        }
        `}
      </style>
      {/* Outer div: fixed width + mask fade — must NOT have overflow:hidden or the mask gets clipped */}
      <div
        style={{
          width: maxWidth,
          maskImage: isOverflowing
            ? "linear-gradient(to right, transparent, black 8%, black 92%, transparent)"
            : undefined,
        }}
      >
        {/* Inner div: clips the scrolling content */}
        <div className="overflow-hidden text-nowrap">
          <div
            className={isOverflowing ? "flex move-inside" : undefined}
            style={{ gap }}
          >
            <div>{text}</div>
            {isOverflowing && <div>{text}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
