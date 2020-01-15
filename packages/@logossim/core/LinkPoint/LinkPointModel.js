import { BasePositionModel } from '@projectstorm/react-canvas-core';

import LinkPortModel from '../LinkPort/LinkPortModel';

const testColors = [
  'red',
  'green',
  'blue',
  'orange',
  'pink',
  'purple',
  'black',
  'white',
  'aqua',
  'cadetblue',
];

export default class LinkPointModel extends BasePositionModel {
  constructor(options) {
    super({
      ...options,
      type: 'LinkPoint',
    });
    this.parent = options.link;
    this.addPort();
  }

  addPort() {
    const node = this.getParent()
      .getSourcePort()
      .getNode();

    this.fill =
      testColors[Math.floor(Math.random() * testColors.length)];
    const port = new LinkPortModel({
      name: this.options.id,
      fill: this.fill,
    });
    port.setParent(node);
    port.setPosition(this.options.position);

    node.addPort(port);

    this.port = port;

    return port;
  }

  removePort() {
    this.port.getNode().removePort(this.port);
    this.port = undefined;
  }

  setPosition(...args) {
    if (this.port) {
      this.port.setPosition(...args);
    }
    super.setPosition(...args);
  }

  remove() {
    if (this.port) {
      this.port.getNode().removePort(this.port);
      this.port.remove();
    }

    if (this.parent) {
      this.parent.removePoint(this);
    }

    super.remove();
  }

  serialize() {
    return { ...super.serialize(), port: this.port };
  }

  deserialize(event) {
    super.deserialize(event);
    this.port = event.data.port;
  }

  isConnectedToPort() {
    return this.parent.getPortForPoint(this) !== null;
  }

  getLink() {
    return this.getParent();
  }

  isLocked() {
    return super.isLocked() || this.getParent().isLocked();
  }
}
