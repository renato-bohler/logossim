import { PortModel as RDPortModel } from '@projectstorm/react-diagrams';

import LinkModel from '../Link/LinkModel';

export default class PortModel extends RDPortModel {
  constructor(options = {}) {
    super({
      type: 'Port',
      maximumLinks: 1,
      ...options,
    });

    this.value = null;
    this.input = null;
  }

  serialize() {
    return {
      ...super.serialize(),
      input: this.input,
      value: this.value,
    };
  }

  deserialize(data, engine) {
    super.deserialize(data, engine);
    this.value = data.value;
    this.input = data.input;
  }

  setAsInput() {
    this.input = true;
  }

  setAsOutput() {
    this.input = false;
  }

  isInput() {
    return this.input === true;
  }

  isOutput() {
    return this.input === false;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  isNewLinkAllowed() {
    return (
      Object.keys(this.getLinks()).length < this.getMaximumLinks()
    );
  }

  canLinkToPort(port) {
    return port.isNewLinkAllowed() && this.getID() !== port.getID();
  }

  createLinkModel() {
    if (this.isNewLinkAllowed()) {
      return new LinkModel();
    }
    return null;
  }

  getMainLink() {
    const links = Object.values(this.getLinks());
    return links.length > 0 ? links[0] : null;
  }

  getColor() {
    if (this.value === null) {
      const link = this.getMainLink();
      if (link) return link.getColor();
      return 'var(--port-unconnected)';
    }
    if (this.value === 1) return 'var(--value-on)';
    if (this.value === 0) return 'var(--value-off)';
    return 'var(--value-error)';
  }
}
