"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = { text: string };

export default function RotatingText(props: Props) {
  const { text } = props;

  const eltRef = useRef(null);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    setRotating(true);
  });

  return rotating ? (
    <div className="flex gap-10">
      <div ref={eltRef}>{text}</div>
      <div>{text}</div>
    </div>
  ) : (
    <div>
      <div ref={eltRef}>{text}</div>
    </div>
  );
}
