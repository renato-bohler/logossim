import { BaseModel } from '@logossim/core';

export default class RamModel extends BaseModel {
  initialize(configurations) {
    this.dataWidth = Number(configurations.DATA_WIDTH);
    this.addressWidth = Number(configurations.ADDRESS_WIDTH);
    this.memory = (configurations.CONTENT || '').parseBinary(
      this.dataWidth,
      2 ** this.addressWidth,
    );

    this.addInputPort('clock', { floating: 0 });
    this.addInputPort('load', { floating: 1 });
    this.addInputPort('address', {
      bits: this.addressWidth,
      floating: 0,
    });
    this.addInputPort('clear', { floating: 0 });
    this.addInputPort('select', { floating: 1 });
    this.addOutputPort('data', { bits: this.dataWidth });
  }

  clearMemory() {
    this.memory = Array(2 ** this.addressWidth).fill(0);
  }

  getMemory() {
    return this.memory;
  }

  getAddress() {
    if (!this.select) return 0;
    return (this.currentAddress || 0).asNumber();
  }

  step(input, meta) {
    this.currentAddress = input.address;
    this.select = input.select;

    if (input.clear) this.clearMemory();
    if (!input.select) return { data: 'x' };

    if (!input.load) {
      if (meta.clock.risingEdge && !input.clear) {
        this.memory[input.address] = this.getPort('data')
          .getWireValue()
          .asNumber();
      }

      return { data: 'x' };
    }

    return {
      data: this.memory[input.address],
    };
  }
}
