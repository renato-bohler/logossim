import { BaseModel } from '@logossim/core';

export default class OrModel extends BaseModel {
  initialize() {
    this.addInPort('in0');
    this.addInPort('in1');
    this.addOutPort('out');
  }

  onSimulationStart() {
    console.log('OrModel onSimulationStart');
  }

  onSimulationPause() {
    console.log('OrModel onSimulationPause');
  }

  onSimulationStop() {
    console.log('OrModel onSimulationStop');
  }

  step(input) {
    console.log('OrModel step', input);
  }
}
