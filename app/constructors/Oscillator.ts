import { OscillatorConstructorProps, EnvelopeSettings } from "../types/types";

export default class Oscillator {
  private audioContext: AudioContext;
  private oscillator: OscillatorNode;
  private gateGain: GainNode;
  private envelope: EnvelopeSettings;
  private easing: number;
  private targetVolume: number;
  public version: number;
  private lfo: OscillatorNode;
  private lfoGain: GainNode;

  constructor(props: OscillatorConstructorProps) {
    const {
      audioContext,
      type,
      frequency,
      detune,
      envelopeSettings,
      volume,
      connection,
      easing,
      version,
      isMuted,
      lfoSettings,
    } = props;

    this.version = version;
    this.audioContext = audioContext;
    this.easing = easing;
    this.targetVolume = isMuted ? 0 : volume;

    this.envelope = envelopeSettings || {
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

    this.lfo = this.audioContext.createOscillator();
    this.lfo.type = lfoSettings.type;
    this.lfo.frequency.value = lfoSettings.rate;

    this.lfoGain = this.audioContext.createGain();
    this.lfoGain.gain.value = lfoSettings.depth;

    this.oscillator.connect(this.gateGain);
    this.gateGain.connect(connection);

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.oscillator.frequency);

    this.lfo.start();
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
      this.targetVolume * this.envelope.sustain,
      currentTime + this.envelope.attack + this.envelope.decay + this.easing
    );
  }
  stopOscillatorConstructor(): void {
    const { currentTime } = this.audioContext;

    this.gateGain.gain.cancelScheduledValues(currentTime);
    this.gateGain.gain.setValueAtTime(this.gateGain.gain.value, currentTime);

    const releaseTime = currentTime + this.envelope.release + this.easing;
    this.gateGain.gain.exponentialRampToValueAtTime(0.0001, releaseTime);

    this.lfo.stop(releaseTime);

    this.oscillator.stop(releaseTime);

    setTimeout(() => {
      this.lfo.disconnect();
      this.oscillator.disconnect();
      this.lfoGain.disconnect();
      this.gateGain.disconnect();
    }, (this.envelope.release + 0.5) * 1000);
  }
}
