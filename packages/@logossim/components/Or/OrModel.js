import { BaseModel } from '@logossim/core';

export default class OrModel extends BaseModel {
  initialize() {
    this.addInPort('in0');
    this.addInPort('in1');
    this.addOutPort('out');
  }

  step(input) {
    return input.in0 || input.in1;
  }
}
