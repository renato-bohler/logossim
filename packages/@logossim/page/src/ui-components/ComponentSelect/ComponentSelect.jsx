import React from 'react';
import styled from 'styled-components';

import Sidebar from './Sidebar';
import DroppableLayer from './DroppableLayer';

const Container = styled.div`
  position: relative;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
`;

const ComponentSelect = ({
  open,
  handleClickMenu,
  handleComponentDrop,
  components,
  children,
}) => (
  <Container open={open}>
    <Sidebar
      open={open}
      handleClickMenu={handleClickMenu}
      components={components}
    />
    <DroppableLayer
      handleComponentDrop={handleComponentDrop}
      components={components}
    >
      {children}
    </DroppableLayer>
  </Container>
);

export default ComponentSelect;
