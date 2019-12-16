import { BaseModel } from '@logossim/core';

export default class AndModel extends BaseModel {
  initialize() {
    this.addPort('in0');
    this.addPort('in1');
    this.addPort('out');
  }

  onSimulationStart() {
    console.log('AndModel onSimulationStart');
  }

  onSimulationEnd() {
    console.log('AndModel onSimulationEnd');
  }

  step(inputs) {
    console.log('AndModel step', inputs);
  }
}
