"use client";
import React, { useState, useRef } from "react";
import Keyboard from "./components/Keyboard";
import MasterVolume from "./components/MasterVolume";
import Envelope from "./components/Envelope";
import Oscillator from "./components/Oscillator";
import Filter from "./components/Filter";
import { useSynthEngine } from "./hooks/useSynthEngine";
import {
  EnvelopeProps,
  OscillatorSettings,
  SynthSettings,
  FilterSettings,
} from "./types/types";

interface OscillatorBank {
  [key: string]: OscillatorSettings;
}

export default function SynthPage() {
  const [masterVolume, setMasterVolume] = useState<number>(1);
  const [envelope, setEnvelope] = useState<EnvelopeProps>({
    attack: 0.1,
    decay: 0.24,
    sustain: 0.44,
    release: 0.56,
  });

  const [oscillators, setOscillators] = useState<OscillatorBank>({
    osc1: {
      type: "square",
      octave: 8,
      detune: 0,
      volume: 0.35,
    },
    osc2: {
      type: "sawtooth",
      octave: 4,
      detune: 0,
      volume: 0.35,
    },
    osc3: {
      type: "triangle",
      octave: 16,
      detune: 0,
      volume: 0.35,
    },
  });

  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    type: "lowpass",
    frequency: 350,
    detune: 0,
    Q: 1,
    gain: 0,
  });

  const settingsRef = useRef<SynthSettings>({
    filterFreq: 350,
    masterVolume: 1,
    envelope: {
      attack: 0.1,
      decay: 0.24,
      sustain: 0.44,
      release: 0.56,
    },
    osc1: {
      type: "square",
      octave: 8,
      detune: 0,
      volume: 0.35,
    },
    osc2: {
      type: "sawtooth",
      octave: 4,
      detune: 0,
      volume: 0.35,
    },
    osc3: {
      type: "triangle",
      octave: 16,
      detune: 0,
      volume: 0.35,
    },
    easing: 0.005,
    filterSettings: {
      type: "lowpass",
      frequency: 350,
      detune: 0,
      Q: 1,
      gain: 0,
    },
  });

  const { playNote, stopNote, updateFilter, updateMasterVolume } =
    useSynthEngine(settingsRef);

  const handleMasterVolumeChange = (nextMasterVolume: number) => {
    setMasterVolume(nextMasterVolume);
    settingsRef.current.masterVolume = nextMasterVolume;
    updateMasterVolume(nextMasterVolume);
  };

  const handleEnvelopeChange = (nextEnvelopeSettings) => {
    setEnvelope(nextEnvelopeSettings);
    settingsRef.current.envelope = nextEnvelopeSettings;
  };

  const handleOscillatorSettingsChange = (version, nextOscillatorSettings) => {
    const whichOscillator = `osc${version}`;
    setOscillators((prev) => ({
      ...prev,
      [whichOscillator]: nextOscillatorSettings,
    }));
    settingsRef.current[whichOscillator] = nextOscillatorSettings;
  };

  const handleFilterSettingsChange = (nextFilterSettings) => {
    setFilterSettings(nextFilterSettings);
    settingsRef.current.filterSettings = nextFilterSettings;
    updateFilter(nextFilterSettings);
  };

  return (
    <div className="">
      <h1>Synth</h1>
      <MasterVolume
        masterVolume={masterVolume}
        handleMasterVolumeChange={handleMasterVolumeChange}
      />
      <Envelope
        envelopeVals={envelope}
        handleEnvelopeChange={handleEnvelopeChange}
      />
      <Oscillator
        version={1}
        oscillatorSettings={oscillators.osc1}
        handleOscillatorSettingsChange={handleOscillatorSettingsChange}
      />
      <Oscillator
        version={2}
        oscillatorSettings={oscillators.osc2}
        handleOscillatorSettingsChange={handleOscillatorSettingsChange}
      />
      <Oscillator
        version={3}
        oscillatorSettings={oscillators.osc3}
        handleOscillatorSettingsChange={handleOscillatorSettingsChange}
      />
      <Filter
        filterSettings={filterSettings}
        handleFilterSettingsChange={handleFilterSettingsChange}
      />
      <Keyboard onKeyDown={playNote} onKeyUp={stopNote} />
    </div>
  );
}
