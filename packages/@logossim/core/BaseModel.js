import { NodeModel } from '@projectstorm/react-diagrams';
import { Point } from '@projectstorm/geometry';

import PortModel from './Port/PortModel';
import LinkPortModel from './LinkPort/LinkPortModel';

export default class BaseModel extends NodeModel {
  constructor(type, configurations) {
    super({ type });

    this.initialize(configurations);

    this.configurations = configurations;

    this.functions = {
      onSimulationStart: this.onSimulationStart,
      onSimulationEnd: this.onSimulationEnd,
      step: this.step,
    };
  }

  serialize() {
    return {
      ...super.serialize(),
      functions: this.functions,
      configurations: this.configurations,
    };
  }

  addPort(port) {
    if (port instanceof PortModel || port instanceof LinkPortModel) {
      super.addPort(port);
    } else {
      super.addPort(new PortModel({ name: port }));
    }
  }

  setPosition(x, y) {
    let point;
    if (x instanceof Point) {
      point = x;
    } else {
      point = new Point(x, y);
    }

    const old = this.position;
    this.position = point;

    Object.values(this.ports)
      .filter(port => !(port instanceof LinkPortModel))
      .forEach(port =>
        port.setPosition(
          port.getX() + point.x - old.x,
          port.getY() + point.y - old.y,
        ),
      );
  }

  initialize() {}

  onSimulationStart() {}

  onSimulationEnd() {}

  step() {}
}
