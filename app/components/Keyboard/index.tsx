"use client";
import React, { useEffect } from "react";
import QwertyHancock from "qwerty-hancock";

interface KeyboardProps {
  onKeyDown: (note: string, freq: number) => void;
  onKeyUp: (note: string, freq?: number) => void;
}

export default function Keyboard({ onKeyDown, onKeyUp }: KeyboardProps) {
  useEffect(() => {
    const keyboard = new QwertyHancock({
      id: "keyboard",
      width: 908,
      height: 150,
      octaves: 2,
      startNote: "C4",
      activeColour: "#6495ed",
    });

    keyboard.keyDown = onKeyDown;
    keyboard.keyUp = onKeyUp;

    return () => {
      const kbDiv = document.getElementById("keyboard");
      if (kbDiv) kbDiv.innerHTML = "";
    };
  }, [onKeyDown, onKeyUp]);

  return <div id="keyboard" />;
}
