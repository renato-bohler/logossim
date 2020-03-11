import { NodeModel } from '@projectstorm/react-diagrams';

import PortModel from './Port/PortModel';

export default class BaseModel extends NodeModel {
  constructor(type, configurations) {
    super({ type });

    this.initialize(configurations);

    this.configurations = configurations;
  }

  serialize() {
    return {
      ...super.serialize(),
      configurations: this.configurations,
    };
  }

  addPort(port) {
    if (port instanceof PortModel) {
      super.addPort(port);
    } else {
      super.addPort(new PortModel({ name: port }));
    }
  }

  initialize() {}

  onSimulationStart() {}

  onSimulationPause() {}

  onSimulationStop() {}

  step() {}
}
