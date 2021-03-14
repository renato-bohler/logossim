import { BaseModel } from '@logossim/core';

export default class PowerModel extends BaseModel {
  initialize(configurations) {
    this.dataBits = Number(configurations.DATA_BITS);

    this.addOutputPort('out', { bits: this.dataBits });
  }

  onSimulationStart() {
    this.emit({ out: 0b1111_1111_1111_1111 });
  }
}
