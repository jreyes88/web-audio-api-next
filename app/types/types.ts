export interface OscillatorConstructorProps {
  audioContext: AudioContext;
  type: "sine" | "square" | "sawtooth" | "triangle";
  frequency: number;
  detune: number;
  envelopeSettings: EnvelopeSettings;
  volume: number;
  connection: GainNode;
  easing: number;
  version: number;
  isMuted: boolean;
  lfoSettings: LFOSettings;
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
  isMuted: boolean;
}

export interface SynthSettings {
  masterVolume: number;
  envelopeSettings: EnvelopeSettings;
  osc1: OscillatorSettings;
  osc2: OscillatorSettings;
  osc3: OscillatorSettings;
  easing: number;
  filterSettings: FilterSettings;
  lfoSettings: LFOSettings;
}

export interface FilterSettings {
  type: BiquadFilterType;
  frequency: number;
  detune: number;
  Q: number;
  gain: number;
}

export interface LFOSettings {
  type: "sine" | "square" | "sawtooth" | "triangle";
  rate: number;
  depth: number;
}
