import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import LinkPortModel from './LinkPortModel';

export default class LinkPortFactory extends AbstractModelFactory {
  constructor() {
    super('LinkPort');
  }

  generateModel() {
    return new LinkPortModel();
  }
}
