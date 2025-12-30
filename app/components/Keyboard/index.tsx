"use client";
import React, { useEffect, useRef } from "react";
import QwertyHancock from "qwerty-hancock";
import styles from "./Keyboard.module.scss";

interface KeyboardProps {
  onKeyDown: (note: string, freq: number) => void;
  onKeyUp: (note: string, freq?: number) => void;
}

export default function Keyboard({ onKeyDown, onKeyUp }: KeyboardProps) {
  const onKeyDownRef = useRef(onKeyDown);
  const onKeyUpRef = useRef(onKeyUp);

  useEffect(() => {
    onKeyDownRef.current = onKeyDown;
    onKeyUpRef.current = onKeyUp;
  }, [onKeyDown, onKeyUp]);

  useEffect(() => {
    const keyboard = new QwertyHancock({
      id: "keyboard",
      width: 897,
      height: 152,
      octaves: 2,
      startNote: "C4",
      activeColour: "#f3a7a7",
    });

    keyboard.keyDown = (note, freq) => onKeyDownRef.current(note, freq);
    keyboard.keyUp = (note, freq) => onKeyUpRef.current(note, freq);

    return () => {
      const kbDiv = document.getElementById("keyboard");
      if (kbDiv) kbDiv.innerHTML = "";
    };
  }, []);

  return (
    <div className={styles["keyboard-container"]}>
      <div id="keyboard" />
    </div>
  );
}
