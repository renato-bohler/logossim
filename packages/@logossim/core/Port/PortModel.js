import { PortModel as RDPortModel } from '@projectstorm/react-diagrams';

import LinkModel from '../Link/LinkModel';

export default class PortModel extends RDPortModel {
  constructor(options = {}) {
    super({
      type: 'Port',
      ...options,
    });
  }

  serialize() {
    return { ...super.serialize(), value: this.value };
  }

  deserialize(data, engine) {
    super.deserialize(data, engine);
    this.value = data.value;
  }

  canLinkToPort(port) {
    return this.getID() !== port.getID();
  }

  createLinkModel() {
    return new LinkModel();
  }
}
