"use client";
import React, { useState, useRef } from "react";
import Keyboard from "./components/Keyboard";
import FilterCutoff from "./components/FilterCutoff";
import MasterVolume from "./components/MasterVolume";
import { useSynthEngine } from "./hooks/useSynthEngine";

export default function SynthPage() {
  const [filterFreq, setFilterFreq] = useState(350);
  const [masterVolume, setMasterVolume] = useState(1);

  const settingsRef = useRef({
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
      <Keyboard onKeyDown={playNote} onKeyUp={stopNote} />
    </div>
  );
}
