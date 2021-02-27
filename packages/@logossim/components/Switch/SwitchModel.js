import { BaseModel } from '@logossim/core';

export default class SwitchModel extends BaseModel {
  initialize() {
    this.addOutputPort('out');
  }

  onSimulationStart() {
    this.emit({ out: 0 });
  }

  onClick(index) {
    const mask = 0b1 << index;

    this.emit({ out: this.getOutput() ^ mask });
  }

  getOutput() {
    return this.getPort('out').getValue() || [0];
  }

  isActive() {
    return this.getOutput()[0] === 1;
  }
}
