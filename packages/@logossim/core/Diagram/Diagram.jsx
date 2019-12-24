import React from 'react';
import styled from 'styled-components';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import DroppableLayer from './DroppableLayer';

const FullscreenCanvas = styled(CanvasWidget)`
  height: 100%;
  width: 100%;
`;

const Diagram = ({ engine }) => (
  <DroppableLayer handleComponentDrop={engine.handleComponentDrop}>
    <FullscreenCanvas engine={engine} />
  </DroppableLayer>
);

export default Diagram;
