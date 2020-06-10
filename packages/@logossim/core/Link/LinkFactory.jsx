import React from 'react';

import { DefaultLinkFactory } from '@projectstorm/react-diagrams-defaults';

import styled from 'styled-components';

import LinkModel from './LinkModel';
import LinkWidget from './LinkWidget';

const Path = styled.path`
  pointer-events: all;
  stroke-linecap: round;
`;

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

  generateLinkSegment(model, selected, path) {
    return (
      <>
        <Path
          stroke={model.getColor()}
          strokeWidth={model.getLineWidth()}
          d={path}
        />
        {/* This path is to facilitate link selection */}
        <Path stroke="none" strokeWidth={20} d={path} />
      </>
    );
  }
}
