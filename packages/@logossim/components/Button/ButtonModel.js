import { BaseModel } from '@logossim/core';

export default class ButtonModel extends BaseModel {
  initialize() {
    this.addOutPort('out');
  }

  onSimulationStart() {
    console.log('ButtonModel onSimulationStart');
  }

  onSimulationPause() {
    console.log('ButtonModel onSimulationPause');
  }

  onSimulationStop() {
    console.log('ButtonModel onSimulationStop');
  }

  step(inputs) {
    console.log('ButtonModel step', inputs);
  }

  onClick() {
    console.log('ButtonModel onClick');
  }

  onRelease() {
    console.log('ButtonModel onRelease');
  }
}
