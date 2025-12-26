export interface OscillatorProps {
  audioContext: AudioContext;
  type: "sine" | "square" | "sawtooth" | "triangle";
  frequency: number;
  detune: number;
  envelope: EnvelopeProps;
  volume: number;
  connection: GainNode;
  easing: number;
  version: number;
}

export interface EnvelopeProps {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface OscillatorSettings {
  type: "sine" | "square" | "sawtooth" | "triangle";
  octave: number;
  detune: number;
  volume: number;
}

export interface SynthSettings {
  filterFreq: number;
  masterVolume: number;
  envelope: EnvelopeProps;
  osc1: OscillatorSettings;
  osc2: OscillatorSettings;
  osc3: OscillatorSettings;
  easing: number;
}
