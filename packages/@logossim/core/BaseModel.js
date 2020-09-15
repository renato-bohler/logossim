import { Point } from '@projectstorm/geometry';
import { NodeModel } from '@projectstorm/react-diagrams';

import PortModel from './Port/PortModel';
import { emit } from './Simulation/SimulationEngine';
import { adjustValueToBits, isValueValid } from './Simulation/utils';

const getPort = port => {
  if (port instanceof PortModel) return port;
  return new PortModel({ name: port });
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

  addInputPort(arg, bits = 1) {
    const port = getPort(arg);
    port.setAsInput();
    if (typeof arg === 'string') port.setBits(bits);
    super.addPort(port);
  }

  addOutputPort(arg, bits = 1) {
    const port = getPort(arg);
    port.setAsOutput();
    if (typeof arg === 'string') port.setBits(bits);
    super.addPort(port);
  }

  addPort(arg, bits = 1) {
    const port = getPort(arg);

    if (port.isInput()) {
      this.addInputPort(port, bits);
      return;
    }

    if (port.isOutput()) {
      this.addOutputPort(port, bits);
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

  // Methods to facilitate unit testing
  createAudio() {}

  stepAndMask(input) {
    const stepResult = this.step(input);

    return Object.fromEntries(
      Object.entries(stepResult).map(([portName, portValue]) => {
        const { bits } = this.getPort(portName);
        const value = adjustValueToBits(portValue, bits);

        return [
          portName,
          isValueValid(value, bits) ? value : 'error',
        ];
      }),
    );
  }
}
