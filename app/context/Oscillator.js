export default class Oscillator {
  constructor(audioContext, type, frequency, detune, connection) {
    this.audioContext = audioContext;

    // Create basic oscillator
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.frequency.value = frequency;
    this.oscillator.type = type;
    this.oscillator.detune.value = detune;

    // Create gate gain
    this.gateGain = this.audioContext.createGain();
    this.gateGain.gain.value = 0;

    // Connect oscillator to gate gain
    this.oscillator.connect(this.gateGain);

    // Connect gate gain to connection
    this.gateGain.connect(connection);

    // Create an empty buffer
    // const bufferSize = this.audioContext.sampleRate * 0.1;
    // let noiseBuffer = this.audioContext.createBuffer(
    //   1,
    //   bufferSize,
    //   this.audioContext.sampleRate
    // );

    // // Fill the buffer with noise
    // const output = noiseBuffer.getChannelData(0);
    // for (let i = 0; i < bufferSize; i++) {
    //   output[i] = Math.random() * 2 - 1;
    // }

    // const whiteNoise = this.audioContext.createBufferSource();
    // this.whiteNoise = whiteNoise;
    // this.whiteNoise.buffer = noiseBuffer;
    // this.whiteNoise.loop = true;
    // this.whiteNoise.start();

    // this.whiteNoiseGain = this.audioContext.createGain();
    // this.whiteNoise.connect(this.whiteNoiseGain);
    // this.whiteNoiseGain.connect(connection);
  }

  start(envelopeSettings, easing, oscillatorGainSettings) {
    const { currentTime } = this.audioContext;

    this.gateGain.gain.cancelScheduledValues(currentTime);
    this.gateGain.gain.setValueAtTime(0, currentTime + easing);
    this.gateGain.gain.linearRampToValueAtTime(
      oscillatorGainSettings.volume,
      currentTime + envelopeSettings.attack + easing
    );

    this.oscillator.start();

    // this.whiteNoiseGain.gain.cancelScheduledValues(currentTime);
    // this.whiteNoiseGain.gain.setValueAtTime(0, currentTime + easing);
    // this.whiteNoiseGain.gain.linearRampToValueAtTime(
    //   lfoSettings.noise,
    //   currentTime + envelopeSettings.attack + easing
    // );
  }
  stop(envelopeSettings, easing) {
    console.log("hi");
    const { currentTime } = this.audioContext;
    // this.gateGain.gain.cancelScheduledValues(currentTime);
    // this.gateGain.gain.setValueAtTime(0, currentTime);
    // this.gateGain.gain.linearRampToValueAtTime(
    //   0,
    //   currentTime + envelopeSettings.release + easing
    // );
    // console.log(this.gateGain.gain.value);
    this.gateGain.gain.value = 0;
    this.oscillator.stop(1000);

    // gain.gain.gain.cancelScheduledValues(currentTime);
    // gain.gain.gain.setValueAtTime(0, 2000);
    // gain.gain.gain.setValue(0.1, currentTime, 2000 + easing);
    // this.oscillator.stop();
    // this.whiteNoiseGain.gain.setTargetAtTime(
    //   0,
    //   currentTime,
    //   envelopeSettings.release + easing
    // );
    setTimeout(() => {
      this.oscillator.disconnect();
      // this.whiteNoise.disconnect();
    }, 6000);
  }
}
