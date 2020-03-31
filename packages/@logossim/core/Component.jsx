import React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { MenuProvider } from 'react-contexify';

export default class Component extends AbstractReactFactory {
  constructor({
    type,
    name,
    description,
    group,
    configurations = [],
    model,
    widget,
    icon,
  }) {
    super(type);
    this.name = name;
    this.description = description;
    this.group = group;
    this.configurations = configurations;
    this.Model = model;
    this.Widget = widget;
    this.Icon = icon;
  }

  generateReactWidget(event) {
    const { Widget } = this;
    const { model } = event;

    return (
      <MenuProvider id="component" storeRef={false} data={model}>
        <Widget engine={this.engine} model={model} />
      </MenuProvider>
    );
  }

  generateModel(event) {
    const { Model } = this;
    const { type, configurations } = event.initialConfig;

    return new Model(type, configurations);
  }
}
