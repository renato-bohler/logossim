import { BaseModel } from '@logossim/core';

export default class AndModel extends BaseModel {
  initialize(configurations) {
    const INPUT_PORTS_NUMBER = parseInt(
      configurations.INPUT_PORTS_NUMBER,
      10,
    );

    for (let i = 0; i < INPUT_PORTS_NUMBER; i += 1) {
      this.addPort(`in${i}`);
    }
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
