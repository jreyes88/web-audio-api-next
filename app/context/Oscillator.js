export default class Oscillator {
  constructor(
    audioContext,
    type,
    frequency,
    detune,
    envelope,
    volume,
    connection
  ) {
    // connection will be the master gain
    this.audioContext = audioContext;
    this.envelope = envelope || {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.6, // sustain is a volume
      release: 0.1,
    };
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.frequency.value = frequency;
    this.oscillator.detune.value = detune;
    this.oscillator.type = type;
    this.oscillator.volume = volume;
    this.connection = connection;

    // we will create a gate gain to handle the ADSR envelope and then connect that to the master gain
    this.gateGain = audioContext.createGain();
    this.gateGain.gain.value = 0;
    this.oscillator.connect(this.gateGain);
    this.gateGain.connect(connection);
    this.easing = 0.005;
    this.oscillator.start();
    this.startOscillatorConstructor();
  }
  startOscillatorConstructor() {
    let { currentTime } = this.audioContext;

    // attack
    this.gateGain.gain.cancelScheduledValues(currentTime);
    this.gateGain.gain.setValueAtTime(0, currentTime + this.easing);
    this.gateGain.gain.linearRampToValueAtTime(
      this.oscillator.volume,
      currentTime + this.envelope.attack + this.easing
    );
    // decay to sustain
    this.gateGain.gain.linearRampToValueAtTime(
      this.envelope.sustain,
      currentTime + this.envelope.attack + this.envelope.decay + this.easing
    );
  }
  stopOscillatorConstructor() {
    let { currentTime } = this.audioContext;

    // release
    this.gateGain.gain.cancelScheduledValues(currentTime);
    this.gateGain.gain.setTargetAtTime(
      0,
      currentTime,
      this.envelope.release + this.easing
    );
    setTimeout(() => {
      this.oscillator.disconnect();
    }, 10000);
  }
}
