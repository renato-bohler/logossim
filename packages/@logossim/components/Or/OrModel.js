import { BaseModel } from '@logossim/core';

export default class OrModel extends BaseModel {
  mod = 1;

  initialize() {
    this.addInputPort('in0');
    this.addInputPort('in1');
    this.addOutputPort('out');
  }

  step(input) {
    return { out: input.in0 || input.in1 };
  }
}
