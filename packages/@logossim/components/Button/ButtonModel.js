import { BaseModel } from '@logossim/core';

export default class ButtonModel extends BaseModel {
  initialize() {
    this.addOutputPort('out');
  }

  onSimulationStart() {
    this.emit({ out: 0 });
  }

  onClick() {
    this.emit({ out: 1 });
  }

  onRelease() {
    this.emit({ out: 0 });
  }
}
