import { BaseModel } from '@logossim/core';

export default class InputModel extends BaseModel {
  initialize(configurations) {
    this.dataBits = Number(configurations.DATA_BITS);
    this.threeState = configurations.THREE_STATE === 'true';

    this.addOutputPort('out', this.dataBits);
  }

  onSimulationStart() {
    this.emit({ out: 0 });
  }

  nextValue(value) {
    if (value === 'x') return 0;
    if (value === 0) return 1;
    return this.threeState ? 'x' : 0;
  }

  onClick(index) {
    this.emit({
      out: this.getOutput().map((v, i) => {
        if (i === index) return this.nextValue(v);
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
