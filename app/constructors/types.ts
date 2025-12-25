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
