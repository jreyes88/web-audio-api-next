"use client";

import React, { useRef, useState, useEffect } from "react";
import Oscillator from "../constructors/Oscillator";
import { FilterSettings, SynthSettings } from "../types/types";

export function useSynthEngine(
  settingsRef: React.MutableRefObject<SynthSettings>
) {
  const audioCtx = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const activeNotes = useRef(new Map());

  const [analyserInstance, setAnalyserInstance] = useState<AnalyserNode | null>(
    null
  );

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

      const compressor = audioCtx.current.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-12, audioCtx.current.currentTime);
      compressor.knee.setValueAtTime(30, audioCtx.current.currentTime);
      compressor.ratio.setValueAtTime(12, audioCtx.current.currentTime);
      compressor.attack.setValueAtTime(0.003, audioCtx.current.currentTime);
      compressor.release.setValueAtTime(0.25, audioCtx.current.currentTime);

      const analyser = audioCtx.current.createAnalyser();
      analyser.fftSize = 2048;

      masterGain.current.connect(compressor);
      compressor.connect(analyser);
      analyser.connect(audioCtx.current.destination);

      setAnalyserInstance(analyser);
    }
    return () => {
      audioCtx.current?.close();
      audioCtx.current = null;
    };
  }, []);

  const playNote = (note: string, frequency: number) => {
    const ctx = audioCtx.current;
    if (!ctx || !masterGain.current) return;
    if (ctx.state === "suspended") ctx.resume();

    const s = settingsRef.current;

    masterGain.current.gain.value = s.masterVolume ?? 1;

    const oscs = [
      new Oscillator({
        ...s.osc1,
        audioContext: ctx,
        type: s.osc1.type,
        frequency: octaveToFrequency(frequency, s.osc1.octave),
        detune: s.osc1.detune,
        envelopeSettings: s.envelopeSettings,
        volume: s.osc1.volume / 3,
        filterSettings: s.filterSettings,
        connection: masterGain.current,
        easing: s.easing,
        version: 1,
        isMuted: s.osc1.isMuted,
        lfoSettings: s.lfoSettings,
      }),
      new Oscillator({
        ...s.osc2,
        audioContext: ctx,
        type: s.osc2.type,
        frequency: octaveToFrequency(frequency, s.osc2.octave),
        detune: s.osc2.detune,
        envelopeSettings: s.envelopeSettings,
        volume: s.osc2.volume / 3,
        filterSettings: s.filterSettings,
        connection: masterGain.current,
        easing: s.easing,
        version: 2,
        isMuted: s.osc2.isMuted,
        lfoSettings: s.lfoSettings,
      }),
      new Oscillator({
        ...s.osc3,
        audioContext: ctx,
        type: s.osc3.type,
        frequency: octaveToFrequency(frequency, s.osc3.octave),
        detune: s.osc3.detune,
        envelopeSettings: s.envelopeSettings,
        volume: s.osc3.volume / 3,
        filterSettings: s.filterSettings,
        connection: masterGain.current,
        easing: s.easing,
        version: 3,
        isMuted: s.osc3.isMuted,
        lfoSettings: s.lfoSettings,
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
    const ctx = audioCtx.current;
    if (!ctx) return;
    const { currentTime } = ctx;

    activeNotes.current.forEach((oscs: Oscillator[]) => {
      oscs.forEach((osc) => {
        if (osc.filterNode) {
          const safeFreq = Math.min(Math.max(settings.frequency, 20), 18000);

          osc.filterNode.type = settings.type;
          osc.filterNode.Q.setTargetAtTime(settings.Q, currentTime, 0.02);
          osc.filterNode.gain.setTargetAtTime(settings.gain, currentTime, 0.02);

          osc.filterNode.frequency.setTargetAtTime(safeFreq, currentTime, 0.02);
        }
      });
    });
  };

  const updateMasterVolume = (val: number) => {
    if (masterGain.current) {
      masterGain.current.gain.value = val;
    }
  };

  return {
    playNote,
    stopNote,
    updateFilter,
    updateMasterVolume,
    analyser: analyserInstance,
  };
}
