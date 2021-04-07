import { BaseModel } from '@logossim/core';

export default class CounterModel extends BaseModel {
  initialize(configurations) {
    this.dataBits = Number(configurations.DATA_BITS);
    this.countOnRising = configurations.COUNT_ON === 'rising';
    this.startAt = configurations.START_AT;
    this.wrapAt = configurations.WRAP_AT || 2 ** this.dataBits;
    this.stepValue = configurations.STEP_VALUE;

    this.addInputPort('in');
    this.addOutputPort('out', { bits: this.dataBits });

    this.current = this.startAt;
  }

  isRisingEdge(meta) {
    if (this.countOnRising) return meta.in.risingEdge;
    return meta.in.fallingEdge;
  }

  step(input, meta) {
    if (!this.isRisingEdge(meta)) return { out: this.current };

    this.current += this.stepValue;

    if (this.current >= this.wrapAt) this.current = this.startAt;

    return {
      out: this.current,
    };
  }
}
