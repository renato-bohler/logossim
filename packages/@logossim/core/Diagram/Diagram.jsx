import React from 'react';
import { MenuProvider } from 'react-contexify';

import { CanvasWidget } from '@projectstorm/react-canvas-core';

import styled from 'styled-components';

import DroppableLayer from './DroppableLayer';

const FullscreenCanvas = styled(CanvasWidget)`
  height: 100%;
  width: 100%;
`;

const Diagram = ({ engine }) => (
  <MenuProvider id="diagram" storeRef={false} data={{ test: 1 }}>
    <DroppableLayer
      handleComponentDrop={(...args) =>
        engine.handleComponentDrop(...args)
      }
      disabled={engine.isLocked()}
    >
      <FullscreenCanvas engine={engine.getEngine()} />
    </DroppableLayer>
  </MenuProvider>
);

export default Diagram;
