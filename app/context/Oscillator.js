export default class Oscillator {
  constructor(
    actx,
    type,
    frequency,
    detune,
    envelopeSettings,
    lfoSettings,
    connection
  ) {
    this.actx = actx;
    this.easing = 0.005;
    // envelopeSettings ADSR filter
    this.envelopeSettings = envelopeSettings || {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.6,
      release: 0.1,
    };
    this.lfoSettings = lfoSettings || {
      rate: 1, // Rate slider
      delay: 0, // Delay Slider
      gain: 100, // LFO Knob
      noise: 0, // Noise knob
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
    this.LFO.frequency.value = this.lfoSettings.rate;

    this.LFOGain = actx.createGain();

    this.LFO.connect(this.LFOGain);
    this.LFOGain.connect(this.oscillator.detune);

    // Create an empty buffer
    const bufferSize = actx.sampleRate * 0.1;
    let noiseBuffer = actx.createBuffer(1, bufferSize, actx.sampleRate);

    // Fill the buffer with noise
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = actx.createBufferSource();
    this.whiteNoise = whiteNoise;
    this.whiteNoise.buffer = noiseBuffer;
    this.whiteNoise.loop = true;
    this.whiteNoise.start();

    this.whiteNoiseGain = actx.createGain();
    this.whiteNoise.connect(this.whiteNoiseGain);
    this.whiteNoiseGain.connect(connection);

    this.oscillator.start();
    this.LFO.start();
    this.start();
  }
  start() {
    let { currentTime } = this.actx;

    this.oscillatorGain.gain.cancelScheduledValues(currentTime);
    this.oscillatorGain.gain.setValueAtTime(0, currentTime + this.easing);
    this.oscillatorGain.gain.linearRampToValueAtTime(
      1,
      currentTime + this.envelopeSettings.attack + this.easing
    );
    this.oscillatorGain.gain.linearRampToValueAtTime(
      this.envelopeSettings.sustain,
      currentTime +
        this.envelopeSettings.attack +
        this.envelopeSettings.decay +
        this.easing
    );

    this.LFOGain.gain.cancelScheduledValues(currentTime);
    this.LFOGain.gain.setValueAtTime(0, currentTime + this.easing);
    this.LFOGain.gain.linearRampToValueAtTime(
      this.lfoSettings.gain,
      currentTime + this.lfoSettings.delay + this.easing
    );

    this.whiteNoiseGain.gain.cancelScheduledValues(currentTime);
    this.whiteNoiseGain.gain.setValueAtTime(0, currentTime + this.easing);
    this.whiteNoiseGain.gain.linearRampToValueAtTime(
      this.lfoSettings.noise,
      currentTime + this.envelopeSettings.attack + this.easing
    );
  }
  stop() {
    let { currentTime } = this.actx;
    this.oscillatorGain.gain.cancelScheduledValues(currentTime);
    this.oscillatorGain.gain.setTargetAtTime(
      0,
      currentTime,
      this.envelopeSettings.release + this.easing
    );
    this.whiteNoiseGain.gain.cancelScheduledValues(currentTime);
    this.whiteNoiseGain.gain.setTargetAtTime(
      0,
      currentTime,
      this.envelopeSettings.release + this.easing
    );
    setTimeout(() => {
      this.oscillator.disconnect();
    }, 10000);
  }
}
