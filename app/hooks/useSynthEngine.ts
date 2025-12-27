"use client";

import React, { useRef, useEffect } from "react";
import Oscillator from "../constructors/Oscillator";
import { FilterSettings, SynthSettings } from "../types/types";

export function useSynthEngine(
  settingsRef: React.MutableRefObject<SynthSettings>
) {
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
    return baseFreq * (multipliers[octave] || 1);
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
    masterGain.current.gain.value = s.masterVolume ?? 1;

    const oscs = [
      new Oscillator({
        ...s.osc1,
        audioContext: ctx,
        type: s.osc1.type,
        frequency: octaveToFrequency(frequency, s.osc1.octave),
        detune: s.osc1.detune,
        envelope: s.envelope,
        volume: s.osc1.volume,
        connection: masterGain.current,
        easing: s.easing,
        version: 1,
      }),
      new Oscillator({
        ...s.osc2,
        audioContext: ctx,
        type: s.osc2.type,
        frequency: octaveToFrequency(frequency, s.osc2.octave),
        detune: s.osc2.detune,
        envelope: s.envelope,
        volume: s.osc2.volume,
        connection: masterGain.current,
        easing: s.easing,
        version: 2,
      }),
      new Oscillator({
        ...s.osc3,
        audioContext: ctx,
        type: s.osc3.type,
        frequency: octaveToFrequency(frequency, s.osc3.octave),
        detune: s.osc3.detune,
        envelope: s.envelope,
        volume: s.osc3.volume,
        connection: masterGain.current,
        easing: s.easing,
        version: 3,
      }),
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

  const updateFilter = (settings: FilterSettings) => {
    if (!filterNode.current) return;
    const ctx = audioCtx.current;
    const { currentTime } = ctx;
    filterNode.current.type = settings.type;
    filterNode.current.frequency.setTargetAtTime(
      settings.frequency,
      currentTime,
      0.005
    );
    filterNode.current.detune.setTargetAtTime(
      settings.detune,
      currentTime,
      0.005
    );
    filterNode.current.Q.setTargetAtTime(settings.Q, currentTime, 0.005);
    filterNode.current.gain.setTargetAtTime(settings.gain, currentTime, 0.005);
  };

  const updateMasterVolume = (val: number) => {
    if (masterGain.current) {
      masterGain.current.gain.value = val;
    }
  };

  return { playNote, stopNote, updateFilter, updateMasterVolume };
}
