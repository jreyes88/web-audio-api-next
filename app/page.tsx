"use client";
import React, { useEffect, useRef, useState } from "react";
import QwertyHancock from "qwerty-hancock";
import Oscillator from "./context/Oscillator";

export default function Keyboard() {
  const [filterFreq, setFilterFreq] = useState(350);

  // 1. Audio Engine Refs (These stay alive for the life of the component)
  const audioCtx = useRef(null);
  const masterGain = useRef(null);
  const filterNode = useRef(null);
  const activeNotes = useRef(new Map());

  // 2. The "Bridge" Ref: This allows audio logic to access UI state
  // without triggering a useEffect re-run.
  const settingsRef = useRef({
    filterFreq: 350,
    envelope: { attack: 0.1, decay: 0.24, sustain: 0.44, release: 0.56 },
    osc1: { type: "square", octave: "8", detune: 0, volume: 1 },
    osc2: { type: "sawtooth", octave: 4, detune: 0, volume: 1 },
    osc3: { type: "triangle", octave: 16, detune: 0, volume: 1 },
    easing: 0.005,
  });

  // Keep the ref in sync with the slider
  useEffect(() => {
    settingsRef.current.filterFreq = filterFreq;
    // Update the actual audio node immediately if it exists
    if (filterNode.current) {
      filterNode.current.frequency.setTargetAtTime(
        filterFreq,
        audioCtx.current.currentTime,
        0.03
      );
    }
  }, [filterFreq]);

  const octaveToFrequency = (baseFreq, octave) => {
    const map = { "2": 4, "4": 2, "16": 0.5, "32": 0.25, "64": 0.125 };
    return baseFreq * (map[octave] || 1);
  };

  useEffect(() => {
    // Only initialize ONCE
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      masterGain.current = audioCtx.current.createGain();
      filterNode.current = audioCtx.current.createBiquadFilter();

      filterNode.current.type = "lowpass";
      masterGain.current.connect(filterNode.current);
      filterNode.current.connect(audioCtx.current.destination);
    }

    const keyboard = new QwertyHancock({
      id: "keyboard",
      width: "908",
      height: "150",
      octaves: 2,
      startNote: "C4",
      activeColour: "#6495ed",
    });

    keyboard.keyDown = (note, frequency) => {
      const ctx = audioCtx.current;
      if (ctx.state === "suspended") ctx.resume();

      // Access settings via Ref (so we don't need to re-bind this function)
      const s = settingsRef.current;

      const oscs = [
        new Oscillator(
          ctx,
          s.osc1.type,
          octaveToFrequency(frequency, s.osc1.octave),
          s.osc1.detune,
          s.envelope,
          s.osc1.volume,
          masterGain.current,
          s.easing,
          1
        ),
        new Oscillator(
          ctx,
          s.osc2.type,
          octaveToFrequency(frequency, s.osc2.octave),
          s.osc2.detune,
          s.envelope,
          s.osc2.volume,
          masterGain.current,
          s.easing,
          2
        ),
        new Oscillator(
          ctx,
          s.osc3.type,
          octaveToFrequency(frequency, s.osc3.octave),
          s.osc3.detune,
          s.envelope,
          s.osc3.volume,
          masterGain.current,
          s.easing,
          3
        ),
      ];

      activeNotes.current.set(note, oscs);
    };

    keyboard.keyUp = (note) => {
      const voice = activeNotes.current.get(note);
      if (voice) {
        voice.forEach((osc) => osc.stopOscillatorConstructor());
        activeNotes.current.delete(note);
      }
    };

    return () => {
      // Cleanup to prevent "ghost" notes or multiple contexts
      if (audioCtx.current) {
        audioCtx.current.close();
        audioCtx.current = null;
      }
      // Clear the div so QwertyHancock can re-init if needed
      const kbDiv = document.getElementById("keyboard");
      if (kbDiv) kbDiv.innerHTML = "";
    };
  }, []); // EMPTY dependency array is crucial!

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <label>Filter Cutoff: {filterFreq}Hz</label>
        <br />
        <input
          type="range"
          min="50"
          max="5000"
          value={filterFreq}
          onChange={(e) => setFilterFreq(parseInt(e.target.value))}
        />
      </div>
      <div id="keyboard" />
    </div>
  );
}
