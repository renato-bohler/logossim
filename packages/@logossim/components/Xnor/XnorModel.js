import { BaseModel } from '@logossim/core';

export default class XnorModel extends BaseModel {
  initialize(configurations) {
    this.behavior = configurations.MULTIPLE_INPUT_BEHAVIOR;
    this.dataBits = Number(configurations.DATA_BITS);

    const INPUT_PORTS_NUMBER = Number(
      configurations.INPUT_PORTS_NUMBER,
    );

    for (let i = 0; i < INPUT_PORTS_NUMBER; i += 1) {
      this.addInputPort(`in${i}`, { bits: this.dataBits });
    }
    this.addOutputPort('out', { bits: this.dataBits });
  }

  executeBit(bits) {
    if (bits.some(bit => bit === 'x' || bit === 'e')) return 'e';
    if (this.behavior === 'ONE') return this.executeOne(bits);
    if (this.behavior === 'EVEN') return this.executeEven(bits);
    return {};
  }

  executeOne(bits) {
    return bits.filter(bit => bit === 1).length === 1 ? 0 : 1;
  }

  executeEven(bits) {
    return bits.filter(bit => bit === 1).length % 2 ? 0 : 1;
  }

  step(input) {
    return {
      out: Object.values(input)
        .map(value => value.asArray(this.dataBits))
        .transpose()
        .map(this.executeBit.bind(this)),
    };
  }

  stepFloating(input) {
    return this.step(input);
  }
}
