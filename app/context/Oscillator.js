export default class Oscillator {
  constructor(audioContext, type, frequency, detune, connection) {
    this.audioContext = audioContext;

    // Create basic oscillator
    this.oscillator = audioContext.createOscillator();
    this.oscillator.frequency.value = frequency;
    this.oscillator.type = type;
    this.oscillator.detune.value = detune;

    // Make connection
    this.oscillator.connect(connection);

    // Create an empty buffer
    const bufferSize = this.audioContext.sampleRate * 0.1;
    let noiseBuffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate
    );

    // Fill the buffer with noise
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioContext.createBufferSource();
    this.whiteNoise = whiteNoise;
    this.whiteNoise.buffer = noiseBuffer;
    this.whiteNoise.loop = true;
    this.whiteNoise.start();

    this.whiteNoiseGain = this.audioContext.createGain();
    this.whiteNoise.connect(this.whiteNoiseGain);
    this.whiteNoiseGain.connect(connection);
  }

  start(lfoSettings, envelopeSettings, easing) {
    const { currentTime } = this.audioContext;
    this.oscillator.start();

    this.whiteNoiseGain.gain.cancelScheduledValues(currentTime);
    this.whiteNoiseGain.gain.setValueAtTime(0, currentTime + easing);
    this.whiteNoiseGain.gain.linearRampToValueAtTime(
      lfoSettings.noise,
      currentTime + envelopeSettings.attack + easing
    );
  }
  stop(envelopeSettings, easing) {
    const { currentTime } = this.audioContext;
    this.oscillator.stop();
    this.whiteNoiseGain.gain.setTargetAtTime(
      0,
      currentTime,
      envelopeSettings.release + easing
    );
    setTimeout(() => {
      this.oscillator.disconnect();
      this.whiteNoise.disconnect();
    }, 10000);
  }
}
