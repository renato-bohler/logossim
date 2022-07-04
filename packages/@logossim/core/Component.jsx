import React from 'react';
import { MenuProvider } from 'react-contexify';

import { AbstractReactFactory } from '@projectstorm/react-canvas-core';

import ComponentContext from './ComponentContext';

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
      <MenuProvider
        id="component"
        storeRef={false}
        data={{ component: model }}
      >
        <ComponentContext.Provider value={model}>
          <Widget model={model} />
        </ComponentContext.Provider>
      </MenuProvider>
    );
  }

  generateModel(event) {
    const { Model } = this;
    const { configurations, type } = event.initialConfig;

    return new Model(configurations, type);
  }
}
