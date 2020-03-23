import { BaseModel } from '@logossim/core';

export default class ClockModel extends BaseModel {
  interval = null;

  output = 0;

  initialize() {
    this.addOutputPort('out');
  }

  onSimulationStart() {
    this.emit({ out: 0 });

    this.interval = setInterval(() => {
      this.output = this.output ? 0 : 1;
      this.emit({ out: this.output });
    }, 1000);
  }

  onSimulationPause() {
    clearInterval(this.interval);
  }

  onSimulationStop() {
    clearInterval(this.interval);
  }
}
