import { BaseModel } from '@logossim/core';

export default class ButtonModel extends BaseModel {
  initialize() {
    this.addOutputPort('out');
  }

  onClick() {
    console.log('ButtonModel onClick');
  }

  onRelease() {
    console.log('ButtonModel onRelease');
  }
}
