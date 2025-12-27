export interface OscillatorConstructorProps {
  audioContext: AudioContext;
  type: "sine" | "square" | "sawtooth" | "triangle";
  frequency: number;
  detune: number;
  envelope: EnvelopeSettings;
  volume: number;
  connection: GainNode;
  easing: number;
  version: number;
}

export interface EnvelopeSettings {
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
  envelope: EnvelopeSettings;
  osc1: OscillatorSettings;
  osc2: OscillatorSettings;
  osc3: OscillatorSettings;
  easing: number;
  filterSettings: FilterSettings;
}

export interface FilterSettings {
  type: BiquadFilterType;
  frequency: number;
  detune: number;
  Q: number;
  gain: number;
}
