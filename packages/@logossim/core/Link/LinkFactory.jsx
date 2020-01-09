import React from 'react';
import { DefaultLinkFactory } from '@projectstorm/react-diagrams-defaults';

import LinkWidget from './LinkWidget';
import LinkModel from './LinkModel';

export default class LinkFactory extends DefaultLinkFactory {
  constructor() {
    super('link');
  }

  generateModel() {
    return new LinkModel();
  }

  generateReactWidget(event) {
    return (
      <LinkWidget
        diagramEngine={this.engine}
        link={event.model}
        factory={this}
      />
    );
  }
}
