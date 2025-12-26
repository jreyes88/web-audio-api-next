import { OscillatorProps, EnvelopeProps } from "../types/types";

export default class Oscillator {
  private audioContext: AudioContext;
  private oscillator: OscillatorNode;
  private gateGain: GainNode;
  private envelope: EnvelopeProps;
  private easing: number;
  private targetVolume: number;
  public version: number;

  constructor(props: OscillatorProps) {
    const {
      audioContext,
      type,
      frequency,
      detune,
      envelope,
      volume,
      connection,
      easing,
      version,
    } = props;

    this.version = version;
    this.audioContext = audioContext;
    this.easing = easing;
    this.targetVolume = volume;

    this.envelope = envelope || {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.6,
      release: 0.1,
    };

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.frequency.value = frequency;
    this.oscillator.detune.value = detune;
    this.oscillator.type = type;

    this.gateGain = this.audioContext.createGain();
    this.gateGain.gain.value = 0;

    this.oscillator.connect(this.gateGain);
    this.gateGain.connect(connection);

    this.oscillator.start();
    this.startOscillatorConstructor();
  }
  startOscillatorConstructor(): void {
    const { currentTime } = this.audioContext;

    this.gateGain.gain.cancelScheduledValues(currentTime);
    this.gateGain.gain.setValueAtTime(0, currentTime + this.easing);
    this.gateGain.gain.linearRampToValueAtTime(
      this.targetVolume,
      currentTime + this.envelope.attack + this.easing
    );

    this.gateGain.gain.linearRampToValueAtTime(
      this.envelope.sustain,
      currentTime + this.envelope.attack + this.envelope.decay + this.easing
    );
  }
  stopOscillatorConstructor(): void {
    const { currentTime } = this.audioContext;

    this.gateGain.gain.cancelScheduledValues(currentTime);
    this.gateGain.gain.setValueAtTime(this.gateGain.gain.value, currentTime);

    const releaseTime = currentTime + this.envelope.release + this.easing;
    this.gateGain.gain.exponentialRampToValueAtTime(0.0001, releaseTime);

    this.oscillator.stop(releaseTime);

    setTimeout(() => {
      this.oscillator.disconnect();
      this.gateGain.disconnect();
    }, (this.envelope.release + 0.5) * 1000);
  }
}
