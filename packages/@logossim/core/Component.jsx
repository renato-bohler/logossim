import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';

export default class Component extends AbstractReactFactory {
  constructor({ name, model, widget, icon }) {
    super(name);
    this.name = name;
    this.Model = model;
    this.Widget = widget;
    this.Icon = icon;
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
