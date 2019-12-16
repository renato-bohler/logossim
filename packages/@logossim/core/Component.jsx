import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';

export default class Component extends AbstractReactFactory {
  constructor(name, Model, Widget) {
    super(name);
    this.name = name;
    this.Model = Model;
    this.Widget = Widget;
  }

  generateReactWidget(event) {
    const { Widget } = this;
    return <Widget engine={this.engine} node={event.model} />;
  }

  generateModel() {
    const { Model } = this;
    return new Model(this.type);
  }
}
