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

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.value = data.value;
  }

  createLinkModel() {
    return new LinkModel();
  }
}
