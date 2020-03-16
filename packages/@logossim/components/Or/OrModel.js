import { BaseModel } from '@logossim/core';

export default class OrModel extends BaseModel {
  mod = 1;

  initialize() {
    this.addInputPort('in0');
    this.addInputPort('in1');
    this.addOutputPort('out');
  }

  step() {
    this.mod = (this.mod + 1) % 2;

    if (this.mod === 0) return { out: 0 };
    if (this.mod === 1) return { out: 1 };
    return {};
  }
}
