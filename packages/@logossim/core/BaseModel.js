import { NodeModel } from '@projectstorm/react-diagrams';
import { Point } from '@projectstorm/geometry';

import PortModel from './Port/PortModel';
import { emit } from './Simulation/SimulationEngine';

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

  addInputPort(arg) {
    const port = getPort(arg);
    port.setAsInput();
    super.addPort(port);
  }

  addOutputPort(arg) {
    const port = getPort(arg);
    port.setAsOutput();
    super.addPort(port);
  }

  addPort(arg) {
    const port = getPort(arg);

    if (port.isInput()) {
      this.addInputPort(port);
      return;
    }

    if (port.isOutput()) {
      this.addOutputPort(port);
      return;
    }

    throw new Error(
      '[logossim] Use either `addInputPort` or `addOutputPort`',
    );
  }

  removePort(arg) {
    const port = getPort(arg);
    super.removePort(port);
  }

  getInputPorts() {
    return Object.fromEntries(
      Object.entries(this.getPorts()).filter(([, port]) =>
        port.isInput(),
      ),
    );
  }

  getOutputPorts() {
    return Object.fromEntries(
      Object.entries(this.getPorts()).filter(
        ([, port]) => !port.isInput(),
      ),
    );
  }

  clone(...args) {
    const clone = super.clone(...args);
    clone.setPosition(new Point(this.getX() + 15, this.getY() + 15));
    return clone;
  }

  initialize() {}

  onSimulationStart() {}

  onSimulationPause() {}

  onSimulationStop() {}

  step() {}

  emit(value) {
    emit(this.getID(), value);
  }
}
