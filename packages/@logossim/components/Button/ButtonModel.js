import { BaseModel } from '@logossim/core';

export default class ButtonModel extends BaseModel {
  initialize() {
    this.addOutputPort('out');
  }

  onClick() {
    this.emit({ out: 1 });
  }

  onRelease() {
    this.emit({ out: 0 });
  }
}
