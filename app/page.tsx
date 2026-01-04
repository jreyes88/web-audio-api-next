"use client";
import React, { useState, useRef, useCallback } from "react";
import Oscillator from "./components/Oscillator";
import VolumeLFO from "./components/VolumeLFO";
import Filter from "./components/Filter";
import Envelope from "./components/Envelope";
import Visualizer from "./components/Visualizer";
import Keyboard from "./components/Keyboard";
import { useSynthEngine } from "./hooks/useSynthEngine";
import {
  EnvelopeSettings,
  OscillatorSettings,
  SynthSettings,
  FilterSettings,
  LFOSettings,
} from "./types/types";
import styles from "./page.module.scss";

interface OscillatorBank {
  [key: string]: OscillatorSettings;
}

export default function SynthPage() {
  const [masterVolume, setMasterVolume] = useState<number>(1);
  const [envelopeSettings, setEnvelopeSettings] = useState<EnvelopeSettings>({
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
      isMuted: false,
    },
    osc2: {
      type: "sawtooth",
      octave: 4,
      detune: 0,
      volume: 0.35,
      isMuted: false,
    },
    osc3: {
      type: "triangle",
      octave: 16,
      detune: 0,
      volume: 0.35,
      isMuted: false,
    },
  });
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    type: "lowpass",
    frequency: 350,
    detune: 0,
    Q: 1,
    gain: 0,
    filterEnvAmount: 5000,
    filterEnvelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.2,
      release: 0.5,
    },
  });
  const [lfoSettings, setLFOSettings] = useState<LFOSettings>({
    type: "sine",
    rate: 5,
    depth: 4,
  });

  const settingsRef = useRef<SynthSettings>({
    masterVolume: 1,
    envelopeSettings: {
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
      isMuted: false,
    },
    osc2: {
      type: "sawtooth",
      octave: 4,
      detune: 0,
      volume: 0.35,
      isMuted: false,
    },
    osc3: {
      type: "triangle",
      octave: 16,
      detune: 0,
      volume: 0.35,
      isMuted: false,
    },
    easing: 0.005,
    filterSettings: {
      type: "lowpass",
      frequency: 350,
      detune: 0,
      Q: 1,
      gain: 0,
      filterEnvAmount: 5000,
      filterEnvelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.2,
        release: 0.5,
      },
    },
    lfoSettings: {
      type: "sine",
      rate: 5,
      depth: 4,
    },
  });

  const {
    playNote: enginePlayNote,
    stopNote: engineStopNote,
    updateFilter,
    updateMasterVolume,
    analyser,
  } = useSynthEngine(settingsRef);

  const playNote = useCallback(
    (note: string, freq: number) => {
      enginePlayNote(note, freq);
    },
    [enginePlayNote]
  );

  const stopNote = useCallback(
    (note: string) => {
      engineStopNote(note);
    },
    [engineStopNote]
  );

  const handleMasterVolumeChange = (nextMasterVolume: number) => {
    setMasterVolume(nextMasterVolume);
    settingsRef.current.masterVolume = nextMasterVolume;
    updateMasterVolume(nextMasterVolume);
  };

  const handleEnvelopeSettingsChange = (
    nextEnvelopeSettings: EnvelopeSettings
  ) => {
    setEnvelopeSettings(nextEnvelopeSettings);
    settingsRef.current.envelopeSettings = nextEnvelopeSettings;
  };

  const handleOscillatorSettingsChange = (
    version: number,
    nextOscillatorSettings: OscillatorSettings
  ) => {
    const whichOscillator = `osc${version}` as keyof SynthSettings;
    setOscillators((prev) => ({
      ...prev,
      [whichOscillator]: nextOscillatorSettings,
    }));
    (settingsRef.current[whichOscillator] as OscillatorSettings) =
      nextOscillatorSettings;
  };

  const handleFilterSettingsChange = (nextFilterSettings: FilterSettings) => {
    setFilterSettings(nextFilterSettings);
    settingsRef.current.filterSettings = nextFilterSettings;
    updateFilter(nextFilterSettings);
  };

  const handleLFOSettingsChange = (nextLFOSettings: LFOSettings) => {
    setLFOSettings(nextLFOSettings);
    settingsRef.current.lfoSettings = nextLFOSettings;
  };

  const handleExportPreset = () => {
    const data = JSON.stringify(settingsRef.current, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `synth-preset-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPreset = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings: SynthSettings = JSON.parse(
          e.target?.result as string
        );

        setMasterVolume(importedSettings.masterVolume);
        setEnvelopeSettings(importedSettings.envelopeSettings);
        setOscillators({
          osc1: importedSettings.osc1,
          osc2: importedSettings.osc2,
          osc3: importedSettings.osc3,
        });
        setFilterSettings(importedSettings.filterSettings);
        setLFOSettings(importedSettings.lfoSettings);

        settingsRef.current = importedSettings;

        updateMasterVolume(importedSettings.masterVolume);
        updateFilter(importedSettings.filterSettings);
      } catch (err) {
        alert("Invalid preset file");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="">
      <h1 className={styles["heading"]}>Synth</h1>
      <div className={`${styles["synth-layout"]}`}>
        <div className={styles["oscillators"]}>
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
        </div>
        <VolumeLFO
          masterVolume={masterVolume}
          handleMasterVolumeChange={handleMasterVolumeChange}
          lfoSettings={lfoSettings}
          handleLFOSettingsChange={handleLFOSettingsChange}
        />
        <Filter
          filterSettings={filterSettings}
          handleFilterSettingsChange={handleFilterSettingsChange}
        />

        <Envelope
          envelopeSettings={envelopeSettings}
          handleEnvelopeSettingsChange={handleEnvelopeSettingsChange}
          variant="Gain"
          handleExportPreset={handleExportPreset}
          handleImportPreset={handleImportPreset}
        />
        <Envelope
          variant="Filter"
          envelopeSettings={filterSettings.filterEnvelope}
          handleEnvelopeSettingsChange={(nextEnv) => {
            handleFilterSettingsChange({
              ...filterSettings,
              filterEnvelope: nextEnv,
            });
          }}
        />
        <Visualizer analyser={analyser} />
        <Keyboard onKeyDown={playNote} onKeyUp={stopNote} />
      </div>
    </main>
  );
}
