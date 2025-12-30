"use client";

import React, { useRef, useState, useEffect } from "react";
import Oscillator from "../constructors/Oscillator";
import { FilterSettings, SynthSettings } from "../types/types";

export function useSynthEngine(
  settingsRef: React.MutableRefObject<SynthSettings>
) {
  const audioCtx = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const filterNode = useRef<BiquadFilterNode | null>(null);
  const analyserNode = useRef<AnalyserNode | null>(null);
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
      filterNode.current = audioCtx.current.createBiquadFilter();
      filterNode.current.type = "lowpass";

      const compressor = audioCtx.current.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-12, audioCtx.current.currentTime);
      compressor.knee.setValueAtTime(40, audioCtx.current.currentTime);
      compressor.ratio.setValueAtTime(12, audioCtx.current.currentTime);
      compressor.attack.setValueAtTime(0, audioCtx.current.currentTime);
      compressor.release.setValueAtTime(0.25, audioCtx.current.currentTime);

      analyserNode.current = audioCtx.current.createAnalyser();
      analyserNode.current.fftSize = 2048;

      masterGain.current.connect(filterNode.current);
      filterNode.current.connect(compressor);
      compressor.connect(analyserNode.current);
      analyserNode.current.connect(audioCtx.current.destination);

      setAnalyserInstance(analyserNode.current);
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
    console.log(s);

    filterNode.current.frequency.setTargetAtTime(
      s.filterSettings.frequency,
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
        envelopeSettings: s.envelopeSettings,
        volume: s.osc1.volume / 3,
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
    if (!ctx || !filterNode.current) return;
    const { currentTime } = ctx;

    const safeFreq = Math.min(Math.max(settings.frequency, 20), 18000);

    filterNode.current.type = settings.type;
    filterNode.current.frequency.setTargetAtTime(safeFreq, currentTime, 0.02);
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

  return {
    playNote,
    stopNote,
    updateFilter,
    updateMasterVolume,
    analyser: analyserNode.current,
  };
}
