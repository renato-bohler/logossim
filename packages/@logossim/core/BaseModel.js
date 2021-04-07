import { Point } from '@projectstorm/geometry';
import { NodeModel } from '@projectstorm/react-diagrams';

import PortModel from './Port/PortModel';
import { emit } from './Simulation/SimulationEngine';

const getPort = nameOrInstance => {
  if (nameOrInstance instanceof PortModel) return nameOrInstance;
  return new PortModel({ name: nameOrInstance });
};

export default class BaseModel extends NodeModel {
  constructor(configurations = {}, type = 'generic') {
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

  addInputPort(nameOrInstance, { bits, floating, error } = {}) {
    const port = getPort(nameOrInstance);
    port.setAsInput();
    if (typeof nameOrInstance === 'string') {
      port.setBits(bits || 1);
      port.setDefaultFloatingValue(floating ?? 'x');
      port.setDefaultErrorValue(error ?? 'e');
    }
    super.addPort(port);
  }

  addOutputPort(nameOrInstance, { bits } = {}) {
    const port = getPort(nameOrInstance);
    port.setAsOutput();
    if (typeof nameOrInstance === 'string') {
      port.setBits(bits || 1);
      port.setDefaultFloatingValue('x');
      port.setDefaultErrorValue('e');
    }
    super.addPort(port);
  }

  addPort(nameOrInstance, configuration) {
    const port = getPort(nameOrInstance);

    if (port.isInput()) {
      this.addInputPort(port, configuration);
      return;
    }

    if (port.isOutput()) {
      this.addOutputPort(port, configuration);
      return;
    }

    throw new Error(
      '[logossim] Use either `addInputPort` or `addOutputPort`',
    );
  }

  removePort(name) {
    const port = getPort(name);
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

  getAllLinks() {
    return Object.values(this.getPorts())
      .map(port => port.getMainLink())
      .filter(link => !!link)
      .reduce(
        (arr, link) => [...arr, link, ...link.getAllBifurcations()],
        [],
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

  createAudio() {}
}
