import { NodeModel } from '@projectstorm/react-diagrams';
import PortModel from './Port/PortModel';

export default class BaseModel extends NodeModel {
  constructor(type) {
    super({ type });

    this.initialize();

    this.extras = {
      onSimulationStart: this.onSimulationStart,
      onSimulationEnd: this.onSimulationEnd,
      step: this.step,
    };
  }

  deSerialize(obj, engine) {
    super.deSerialize({ ...obj, extras: this.extras }, engine);
  }

  serialize() {
    return { ...super.serialize(), extras: this.extras };
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

  onSimulationEnd() {}

  step() {}
}
