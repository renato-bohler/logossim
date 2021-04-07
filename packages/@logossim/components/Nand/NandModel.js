import { BaseModel } from '@logossim/core';

export default class NandModel extends BaseModel {
  initialize(configurations) {
    const INPUT_PORTS_NUMBER = Number(
      configurations.INPUT_PORTS_NUMBER,
    );
    this.dataBits = Number(configurations.DATA_BITS);

    for (let i = 0; i < INPUT_PORTS_NUMBER; i += 1) {
      this.addInputPort(`in${i}`, { bits: this.dataBits });
    }
    this.addOutputPort('out', { bits: this.dataBits });
  }

  executeBit(bits) {
    if (bits.some(bit => bit === 0)) return 1;
    if (bits.every(bit => bit === 1)) return 0;
    return 'e';
  }

  step(input) {
    return {
      out: Object.values(input)
        .map(value => value.asArray(this.dataBits))
        .transpose()
        .map(this.executeBit),
    };
  }

  stepFloating(input) {
    return this.step(input);
  }

  stepError(input) {
    return this.step(input);
  }
}
