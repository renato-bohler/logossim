import { BaseModel } from '@logossim/core';

export default class GroundModel extends BaseModel {
  initialize(configurations) {
    this.dataBits = Number(configurations.DATA_BITS);

    this.addOutputPort('out', { bits: this.dataBits });
  }

  onSimulationStart() {
    this.emit({ out: 0 });
  }
}
