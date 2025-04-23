export default class Gain {
  constructor(audioContext, value, connection) {
    this.audioContext = audioContext;

    // Create gain
    this.gain = audioContext.createGain();
    this.gain.value = value;
    this.gain.connect(connection);
  }
}
