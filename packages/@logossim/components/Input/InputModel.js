import { BaseModel } from '@logossim/core';

export default class InputModel extends BaseModel {
  initialize(configurations) {
    this.dataBits = Number(configurations.DATA_BITS);

    this.addOutputPort('out', this.dataBits);
  }

  onSimulationStart() {
    this.emit({ out: 0 });
  }

  onClick(index) {
    this.emit({
      out: this.getOutput().map((v, i) => {
        if (i === index) return v === 0 ? 1 : 0;
        return v;
      }),
    });
  }

  getOutput() {
    return (
      this.getPort('out').getValue() || Array(this.dataBits).fill(0)
    );
  }

  getBitAt(index) {
    return this.getOutput()[index];
  }
}
