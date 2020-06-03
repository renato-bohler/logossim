import { BaseModel } from '@logossim/core';

export default class OutputModel extends BaseModel {
  initialize(configurations) {
    const DATA_BITS = parseInt(configurations.DATA_BITS, 10);

    this.addInputPort('in', DATA_BITS);
  }

  getInput() {
    return this.getPort('in').getValue() || 0;
  }

  getBitAt(index) {
    const input = this.getInput();

    if (input === 'error') return input;

    const mask = 0b1 << index;
    const result = this.getInput() & mask;

    return result > 0 ? 1 : 0;
  }
}
