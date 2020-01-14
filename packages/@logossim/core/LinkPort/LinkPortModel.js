import { PortModel as RDPortModel } from '@projectstorm/react-diagrams';

import LinkModel from '../Link/LinkModel';

export default class LinkPortModel extends RDPortModel {
  constructor(options = {}) {
    super({
      type: 'LinkPort',
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

  createLinkModel() {
    return new LinkModel();
  }
}
