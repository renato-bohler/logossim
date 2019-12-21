import React from 'react';
import styled from 'styled-components';

import Sidebar from './Sidebar';
import DroppableLayer from './DroppableLayer';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  z-index: 100;

  display: flex;

  width: 100vw;
  height: 100vh;
`;

const ComponentSelect = ({
  open,
  handleClickMenu,
  engine,
  components,
  children,
}) => (
  <Container open={open}>
    <Sidebar
      open={open}
      handleClickMenu={handleClickMenu}
      components={components}
    />
    <DroppableLayer engine={engine} components={components}>
      {children}
    </DroppableLayer>
  </Container>
);

export default ComponentSelect;
