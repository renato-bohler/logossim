import { NodeModel } from '@projectstorm/react-diagrams';

import PortModel from './Port/PortModel';

const getPort = port => {
  if (port instanceof PortModel) return port;
  return new PortModel({ name: port });
};

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

  addInPort(arg) {
    const port = getPort(arg);
    port.setAsInput();
    super.addPort(port);
  }

  addOutPort(arg) {
    const port = getPort(arg);
    port.setAsOutput();
    super.addPort(port);
  }

  addPort(arg) {
    const port = getPort(arg);

    if (port.isInput()) {
      this.addInPort(port);
      return;
    }

    if (port.isOutput()) {
      this.addOutPort(port);
      return;
    }

    throw new Error(
      '[logossim] Use either `addInPort` or `addOutPort`',
    );
  }

  initialize() {}

  onSimulationStart() {}

  onSimulationPause() {}

  onSimulationStop() {}

  step() {}
}
