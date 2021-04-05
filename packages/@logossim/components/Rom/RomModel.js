import { BaseModel } from '@logossim/core';

export default class RomModel extends BaseModel {
  initialize(configurations) {
    this.dataWidth = Number(configurations.DATA_WIDTH);
    this.addressWidth = Number(configurations.ADDRESS_WIDTH);
    this.memory = (configurations.CONTENT || '').parseBinary(
      this.dataWidth,
      2 ** this.addressWidth,
    );

    this.addInputPort('address', {
      bits: this.addressWidth,
      floating: 0,
    });
    this.addInputPort('select', { floating: 1 });
    this.addOutputPort('data', { bits: this.dataWidth });
  }

  getMemory() {
    return this.memory;
  }

  getAddress() {
    if (!this.select) return 0;
    return (this.currentAddress || 0).asNumber();
  }

  step(input) {
    this.currentAddress = input.address;
    this.select = input.select;

    if (!input.select) return { data: 'x' };

    return {
      data: this.memory[input.address],
    };
  }
}
