import { BaseModel } from '@logossim/core';

export default class OrModel extends BaseModel {
  initialize() {
    this.addPort('in0');
    this.addPort('in1');
    this.addPort('out');
  }

  onSimulationStart() {
    console.log('OrModel onSimulationStart');
  }

  onSimulationEnd() {
    console.log('OrModel onSimulationEnd');
  }

  step(inputs) {
    console.log('OrModel step', inputs);
  }
}
