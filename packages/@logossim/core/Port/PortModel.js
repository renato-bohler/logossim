import { PortModel as RDPortModel } from '@projectstorm/react-diagrams';

import LinkModel from '../Link/LinkModel';

export default class PortModel extends RDPortModel {
  constructor(options = {}) {
    super({
      type: 'Port',
      maximumLinks: 1,
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

  isNewLinkAllowed() {
    return (
      Object.keys(this.getLinks()).length < this.getMaximumLinks()
    );
  }

  canLinkToPort(port) {
    console.log('this.isNewLinkAllowed():', this.isNewLinkAllowed());
    console.log('this.getID():', this.getID());
    console.log('port.getID():', port.getID());
    return this.isNewLinkAllowed() && this.getID() !== port.getID();
  }

  createLinkModel() {
    if (this.isNewLinkAllowed()) {
      return new LinkModel();
    }
    return null;
  }
}
