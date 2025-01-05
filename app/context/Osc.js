export default class Oscillator {
  constructor(
    actx,
    type,
    frequency,
    detune,
    envelope,
    lfoFrequency,
    connection
  ) {
    this.actx = actx;
    // envelope ADSR filter
    this.envelope = envelope || {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.6,
      release: 0.1,
    };
    // basic oscillator
    this.oscillator = actx.createOscillator();
    this.oscillator.frequency.value = frequency;
    this.oscillator.detune.value = detune;
    this.oscillator.type = type;

    // oscillatorGain
    this.oscillatorGain = actx.createGain();
    this.oscillatorGain.gain.value = 0.1;
    // connections
    this.oscillator.connect(this.oscillatorGain);
    this.oscillatorGain.connect(connection);

    // LFO
    this.LFO = actx.createOscillator();
    this.LFO.frequency.value = lfoFrequency; // max is about 15?
    this.LFOGain = actx.createGain();
    this.LFOGain.gain.value = 100;
    this.LFO.connect(this.LFOGain);
    this.LFOGain.connect(this.oscillator.detune);
    this.easing = 0.005;
    this.oscillator.start();
    this.LFO.start();
    this.start();
    console.log(this);
  }
  start() {
    let { currentTime } = this.actx;
    this.oscillatorGain.gain.cancelScheduledValues(currentTime);
    this.oscillatorGain.gain.setValueAtTime(0, currentTime + this.easing);
    this.oscillatorGain.gain.linearRampToValueAtTime(
      1,
      currentTime + this.envelope.attack + this.easing
    );
    this.oscillatorGain.gain.linearRampToValueAtTime(
      this.envelope.sustain,
      currentTime + this.envelope.attack + this.envelope.decay + this.easing
    );
  }
  stop() {
    let { currentTime } = this.actx;
    this.oscillatorGain.gain.cancelScheduledValues(currentTime);
    this.oscillatorGain.gain.setTargetAtTime(
      0,
      currentTime,
      this.envelope.release + this.easing
    );
    setTimeout(() => {
      this.oscillator.disconnect();
    }, 10000);
  }
}
