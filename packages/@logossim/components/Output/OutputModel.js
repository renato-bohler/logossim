import { BaseModel } from '@logossim/core';

export default class OutputModel extends BaseModel {
  initialize(configurations) {
    this.dataBits = Number(configurations.DATA_BITS);

    this.addInputPort('in', this.dataBits);
  }

  getInput() {
    return (
      this.getPort('in').getValue() ||
      new Array(this.dataBits).fill(0)
    );
  }

  getBitAt(index) {
    return this.getInput()[index];
  }
}
