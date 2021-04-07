import { BaseModel } from '@logossim/core';

export default class NotModel extends BaseModel {
  initialize(configurations) {
    this.dataBits = Number(configurations.DATA_BITS);

    this.addInputPort('in', { bits: this.dataBits });
    this.addOutputPort('out', { bits: this.dataBits });
  }

  step(input) {
    return {
      out: input.in.asArray(this.dataBits).map(bit => {
        if (bit === 1) return 0;
        return 1;
      }),
    };
  }
}
