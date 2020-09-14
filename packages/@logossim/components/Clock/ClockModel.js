import { BaseModel } from '@logossim/core';

export default class ClockModel extends BaseModel {
  initialize(configurations) {
    this.addOutputPort('out');

    this.configurations = configurations;

    this.output = 0;
    this.emitInterval = null;
    this.periodMs = 1000 / this.configurations.FREQUENCY_HZ;
    this.highCount = 0;
    this.lowCount = 0;
  }

  onSimulationStart() {
    this.emit({ out: this.output });

    this.emitInterval = setInterval(() => {
      const lastOutput = this.output;
      this.output = this.getNextOutput();

      if (lastOutput === this.output) return;

      this.emit({ out: this.output });
    }, this.periodMs / 2);
  }

  getNextOutput() {
    const { HIGH_DURATION, LOW_DURATION } = this.configurations;

    if (this.output === 1) {
      this.highCount += 1;

      if (this.highCount === HIGH_DURATION) {
        this.highCount = 0;
        return 0;
      }

      return 1;
    }

    this.lowCount += 1;

    if (this.lowCount === LOW_DURATION) {
      this.lowCount = 0;
      return 1;
    }

    return 0;
  }

  onSimulationPause() {
    clearInterval(this.emitInterval);
  }

  onSimulationStop() {
    clearInterval(this.emitInterval);
  }
}
