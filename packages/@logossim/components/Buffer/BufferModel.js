import { BaseModel } from '@logossim/core';

export default class BufferModel extends BaseModel {
  initialize() {
    this.addInputPort('in');
    this.addOutputPort('out');
  }

  step(input) {
    return { out: input.in };
  }
}
