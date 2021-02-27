import { BaseModel } from '@logossim/core';

export default class BuzzerModel extends BaseModel {
  initialize(configurations) {
    this.frequencyHz = Number(configurations.FREQUENCY_HZ);
    this.waveform = configurations.WAVEFORM;

    this.addInputPort('in');
  }

  onSimulationStart() {
    this.audio = this.createAudio(this.frequencyHz, this.waveform);
  }

  onSimulationPause() {
    this.audio.pause();
  }

  step(input) {
    if (input.in) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  getInput() {
    return this.getPort('in').getValue() || [0];
  }

  isActive() {
    return !!this.getInput()[0];
  }
}
