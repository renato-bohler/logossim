import { BaseModel } from '@logossim/core';

export default class OrModel extends BaseModel {
  mod = 1;

  initialize() {
    this.addInPort('in0');
    this.addInPort('in1');
    this.addOutPort('out');
  }

  step() {
    this.mod = (this.mod + 1) % 2;

    if (this.mod === 0) return { out: 0 };
    if (this.mod === 1) return { out: 1 };
    return {};
  }
}
