import { PortModel as RDPortModel } from '@projectstorm/react-diagrams';

import LinkModel from '../Link/LinkModel';

const validateDefaultValue = (value, type, portName) => {
  if (value === 0) return;
  if (value === 1) return;
  if (value === 'x') return;
  if (value === 'e') return;

  throw new Error(
    `[logossim] Invalid default ${type} value provided for port \`${portName}\`. Should be either 0, 1, 'x' or 'e'.`,
  );
};

export default class PortModel extends RDPortModel {
  constructor(options = {}) {
    super({
      type: 'Port',
      maximumLinks: 1,
      ...options,
    });

    this.value = null;
    this.input = null;
    this.bits = null;
    this.defaultFloatingValue = null;
    this.defaultErrorValue = null;
  }

  serialize() {
    return {
      ...super.serialize(),
      input: this.input,
      value: this.value,
      bits: this.bits,
      defaultFloatingValue: this.defaultFloatingValue,
      defaultErrorValue: this.defaultErrorValue,
    };
  }

  deserialize(event, engine) {
    super.deserialize(event, engine);
    this.value = event.data.value;
    this.input = event.data.input;
    this.bits = event.data.bits;
    this.defaultFloatingValue = event.data.defaultFloatingValue;
    this.defaultErrorValue = event.data.defaultErrorValue;
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

  getBits() {
    return this.bits;
  }

  setBits(bits) {
    if (![1, 2, 4, 8, 16].includes(bits))
      throw new Error(
        '[logossim] Number of bits should be one of: 1, 2, 4, 8 or 16',
      );

    this.bits = bits;
  }

  setDefaultFloatingValue(defaultFloatingValue) {
    validateDefaultValue(
      defaultFloatingValue,
      'floating',
      this.getName(),
    );

    this.defaultFloatingValue = defaultFloatingValue;
  }

  getDefaultFloatingValue() {
    return this.defaultFloatingValue;
  }

  setDefaultErrorValue(defaultErrorValue) {
    validateDefaultValue(defaultErrorValue, 'error', this.getName());

    this.defaultErrorValue = defaultErrorValue;
  }

  getDefaultErrorValue() {
    return this.defaultErrorValue;
  }

  getValue() {
    if (this.value === null) return Array(this.bits).fill(0);

    return this.value.map(bit => {
      if (bit === 'x') return this.getDefaultFloatingValue();
      if (bit === 'e') return this.getDefaultErrorValue();
      return bit;
    });
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
      const link = new LinkModel();
      link.setBits(this.bits);
      return link;
    }
    return null;
  }

  getMainLink() {
    const links = Object.values(this.getLinks());
    return links.length > 0 ? links[0] : null;
  }

  getColor() {
    const link = this.getMainLink();
    if (link) return link.getColor();

    return 'var(--port-unconnected)';
  }
}
