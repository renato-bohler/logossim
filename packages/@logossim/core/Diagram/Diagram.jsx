import React from 'react';
import styled from 'styled-components';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import DroppableLayer from './DroppableLayer';

const FullscreenCanvas = styled(CanvasWidget)`
  height: 100%;
  width: 100%;
`;

const Diagram = ({ engine }) => (
  <DroppableLayer
    handleComponentDrop={(...args) =>
      engine.handleComponentDrop(...args)
    }
    disabled={engine.isLocked()}
  >
    <FullscreenCanvas engine={engine.getEngine()} />
  </DroppableLayer>
);

export default Diagram;
