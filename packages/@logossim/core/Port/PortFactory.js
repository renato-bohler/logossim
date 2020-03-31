import { AbstractModelFactory } from '@projectstorm/react-canvas-core';

import PortModel from './PortModel';

export default class PortFactory extends AbstractModelFactory {
  constructor() {
    super('Port');
  }

  generateModel() {
    return new PortModel();
  }
}
