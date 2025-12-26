"use client";
import React, { useState, useRef } from "react";
import Keyboard from "./components/Keyboard";
import FilterCutoff from "./components/FilterCutoff";
import MasterVolume from "./components/MasterVolume";
import Envelope from "./components/Envelope";
import Oscillator from "./components/Oscillator";
import { useSynthEngine } from "./hooks/useSynthEngine";
import {
  EnvelopeProps,
  OscillatorSettings,
  SynthSettings,
} from "./types/types";

interface OscillatorBank {
  [key: string]: OscillatorSettings;
}

export default function SynthPage() {
  const [filterFreq, setFilterFreq] = useState<number>(350);
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
      volume: 1,
    },
    osc2: {
      type: "sawtooth",
      octave: 4,
      detune: 0,
      volume: 1,
    },
    osc3: {
      type: "triangle",
      octave: 16,
      detune: 0,
      volume: 1,
    },
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
      volume: 1,
    },
    osc2: {
      type: "sawtooth",
      octave: 4,
      detune: 0,
      volume: 1,
    },
    osc3: {
      type: "triangle",
      octave: 16,
      detune: 0,
      volume: 1,
    },
    easing: 0.005,
  });

  const { playNote, stopNote, updateFilter, updateMasterVolume } =
    useSynthEngine(settingsRef);

  const handleFilterChange = (val: number) => {
    setFilterFreq(val);
    settingsRef.current.filterFreq = val;
    updateFilter(val);
  };

  const handleMasterVolumeChange = (val: number) => {
    setMasterVolume(val);
    settingsRef.current.masterVolume = val;
    updateMasterVolume(val);
  };

  const handleEnvelopeChange = (envelopeVals) => {
    setEnvelope(envelopeVals);
    settingsRef.current.envelope = envelopeVals;
  };

  const handleOscillatorSettingsChange = (version, oscillatorSettings) => {
    const whichOscillator = `osc${version}`;
    setOscillators((prev) => ({
      ...prev,
      [whichOscillator]: oscillatorSettings,
    }));
    settingsRef.current[whichOscillator] = oscillatorSettings;
  };

  return (
    <div className="">
      <h1>Synth</h1>
      <FilterCutoff
        filterFreq={filterFreq}
        handleFilterChange={handleFilterChange}
      />
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
      <Keyboard onKeyDown={playNote} onKeyUp={stopNote} />
    </div>
  );
}
