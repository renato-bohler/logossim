export default class AudioEngine {
  constructor() {
    this.context = new AudioContext();
    this.destination = this.context.destination;
    this.audios = {};
  }

  create({ id, frequency = 1000, waveform = 'sine' }) {
    const gainNode = this.context.createGain();
    gainNode.gain.value = 0.5;

    const oscillator = this.context.createOscillator();
    oscillator.type = waveform;
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    oscillator.start();

    this.audios[id] = { gainNode, oscillator };
  }

  play({ id }) {
    try {
      this.getGainNode(id).connect(this.destination);
    } catch (e) {
      // Suppress
    }
  }

  pause({ id }) {
    try {
      this.getGainNode(id).disconnect(this.destination);
    } catch (e) {
      // Suppress
    }
  }

  setFrequency({ id, frequency }) {
    this.getOscillator(id).frequency.value = frequency;
  }

  setWaveform({ id, waveform }) {
    this.getOscillator(id).type = waveform;
  }

  handlePayload(payload) {
    switch (payload.command) {
      case 'create':
        this.create(payload);
        break;
      case 'play':
        this.play(payload);
        break;
      case 'pause':
        this.pause(payload);
        break;
      case 'setFrequency':
        this.setFrequency(payload);
        break;
      case 'setWaveform':
        this.setWaveform(payload);
        break;
      default:
        break;
    }
  }

  getOscillator(id) {
    return this.getAudio(id).oscillator;
  }

  getGainNode(id) {
    return this.getAudio(id).gainNode;
  }

  getAudio(id) {
    const audio = this.audios[id];

    if (!audio)
      throw new Error(
        `[logossim] Audio with id ${id} was not found.`,
      );

    return audio;
  }

  cleanUp() {
    Object.values(this.audios).forEach(audio =>
      audio.oscillator.stop(),
    );
    this.audios = [];
  }
}
