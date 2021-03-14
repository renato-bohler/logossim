import { BaseModel } from '@logossim/core';

export default class ControlledInverterModel extends BaseModel {
  initialize(configurations) {
    const DATA_BITS = Number(configurations.DATA_BITS);

    this.addInputPort('control');
    this.addInputPort('in', { bits: DATA_BITS });
    this.addOutputPort('out', { bits: DATA_BITS });
  }

  step(input) {
    if (input.control === 0) return { out: 'x' };
    return { out: ~input.in };
  }

  stepFloating(input) {
    if (input.control[0] === 'x') return { out: 'e' };
    if (input.control[0] === 0) return { out: 'x' };
    return {
      out: input.in.map(bit => {
        if (bit === 0) return 1;
        if (bit === 1) return 0;
        if (bit === 'x') return 'e';
        return bit;
      }),
    };
  }

  stepError(input) {
    return this.stepFloating(input);
  }
}
