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

    // Start playing
    this.oscillator.start();
    this.start();
  }
  start() {
    let { currentTime } = this.audioContext;
  }
}
