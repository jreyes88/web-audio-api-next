import {
  OscillatorConstructorProps,
  EnvelopeSettings,
  FilterSettings,
} from "../types/types";

export default class Oscillator {
  private audioContext: AudioContext;
  private oscillator: OscillatorNode;
  private gateGain: GainNode;
  public filterNode: BiquadFilterNode;
  private envelope: EnvelopeSettings;
  private filterSettings: FilterSettings;
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
      filterSettings,
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
    this.filterSettings = filterSettings;

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

    this.filterNode = this.audioContext.createBiquadFilter();
    this.filterNode.type = filterSettings.type;
    this.filterNode.Q.value = filterSettings.Q;
    this.filterNode.gain.value = filterSettings.gain;

    this.gateGain = this.audioContext.createGain();
    this.gateGain.gain.value = 0;

    this.lfo = this.audioContext.createOscillator();
    this.lfo.type = lfoSettings.type;
    this.lfo.frequency.value = lfoSettings.rate;

    this.lfoGain = this.audioContext.createGain();
    this.lfoGain.gain.value = lfoSettings.depth;

    this.oscillator.connect(this.filterNode);
    this.filterNode.connect(this.gateGain);
    this.gateGain.connect(connection);

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.oscillator.frequency);

    this.lfo.start();
    this.oscillator.start();
    this.startOscillatorConstructor();
  }
  startOscillatorConstructor(): void {
    const { currentTime } = this.audioContext;
    const s = this.filterSettings;
    const fEnv = s.filterEnvelope;

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

    const baseFreq = s.frequency;
    const peakFreq = Math.min(baseFreq + s.filterEnvAmount, 20000);
    const sustainFreq = Math.min(
      baseFreq + s.filterEnvAmount * fEnv.sustain,
      20000
    );

    this.filterNode.frequency.cancelScheduledValues(currentTime);
    this.filterNode.frequency.setValueAtTime(
      baseFreq,
      currentTime + this.easing
    );

    this.filterNode.frequency.linearRampToValueAtTime(
      peakFreq,
      currentTime + fEnv.attack + this.easing
    );

    this.filterNode.frequency.exponentialRampToValueAtTime(
      Math.max(20, sustainFreq),
      currentTime + fEnv.attack + fEnv.decay + this.easing
    );
  }
  stopOscillatorConstructor(): void {
    const { currentTime } = this.audioContext;
    const fEnv = this.filterSettings.filterEnvelope;

    this.gateGain.gain.cancelScheduledValues(currentTime);
    this.gateGain.gain.setTargetAtTime(
      0,
      currentTime,
      this.envelope.release / 4
    );

    this.filterNode.frequency.cancelScheduledValues(currentTime);
    this.filterNode.frequency.setTargetAtTime(
      this.filterSettings.frequency,
      currentTime,
      fEnv.release / 4
    );

    const releaseDuration = Math.max(this.envelope.release, fEnv.release);
    const stopTime = currentTime + releaseDuration + this.easing;

    this.lfo.stop(stopTime);
    this.oscillator.stop(stopTime);

    setTimeout(() => {
      this.lfo.disconnect();
      this.oscillator.disconnect();
      this.lfoGain.disconnect();
      this.gateGain.disconnect();
      this.filterNode.disconnect();
    }, (releaseDuration + 0.5) * 1000);
  }
}
