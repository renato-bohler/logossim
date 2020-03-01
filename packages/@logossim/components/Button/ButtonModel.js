import { BaseModel } from '@logossim/core';

export default class ButtonModel extends BaseModel {
  initialize() {
    this.addPort('out');
  }

  onSimulationStart() {
    console.log('ButtonModel onSimulationStart');
  }

  onSimulationEnd() {
    console.log('ButtonModel onSimulationEnd');
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
