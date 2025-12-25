"use client";

import { useRef, useEffect } from "react";
import Oscillator from "../context/Oscillator";

export function useSynthEngine(settingsRef) {
  const audioCtx = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const filterNode = useRef<BiquadFilterNode | null>(null);
  const activeNotes = useRef(new Map());

  const octaveToFrequency = (baseFreq: number, octave: number) => {
    const multipliers: Record<number, number> = {
      2: 4,
      4: 2,
      8: 1,
      16: 0.5,
      32: 0.25,
      64: 0.125,
    };
    return baseFreq * (multipliers[octave] || 10);
  };

  useEffect(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      masterGain.current = audioCtx.current.createGain();
      filterNode.current = audioCtx.current.createBiquadFilter();
      filterNode.current.type = "lowpass";

      masterGain.current.connect(filterNode.current);
      filterNode.current.connect(audioCtx.current.destination);
    }
    return () => {
      audioCtx.current?.close();
      audioCtx.current = null;
    };
  }, []);

  const playNote = (note: string, frequency: number) => {
    const ctx = audioCtx.current;
    if (!ctx || !masterGain.current || !filterNode.current) return;
    if (ctx.state === "suspended") ctx.resume();

    const s = settingsRef.current;

    filterNode.current.frequency.setTargetAtTime(
      s.filterFreq,
      ctx.currentTime,
      0.03
    );
    masterGain.current.gain.value = s.masterVolume || 1;

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

  const stopNote = (note: string) => {
    const voice = activeNotes.current.get(note);
    if (voice) {
      voice.forEach((osc: any) => osc.stopOscillatorConstructor());
      activeNotes.current.delete(note);
    }
  };

  return { playNote, stopNote };
}
