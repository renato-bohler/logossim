import { BaseModel } from '@logossim/core';

export default class ClockModel extends BaseModel {
  emitInterval = null;

  periodMs = null;

  output = 0;

  initialize(configurations) {
    const { FREQUENCY_HZ } = configurations;
    this.periodMs = 1000 / FREQUENCY_HZ;
    this.addOutputPort('out');
  }

  onSimulationStart() {
    this.emit({ out: 0 });

    this.emitInterval = setInterval(() => {
      this.output = this.output ? 0 : 1;
      this.emit({ out: this.output });
    }, this.periodMs / 2);
  }

  onSimulationPause() {
    clearInterval(this.emitInterval);
  }

  onSimulationStop() {
    clearInterval(this.emitInterval);
  }
}
