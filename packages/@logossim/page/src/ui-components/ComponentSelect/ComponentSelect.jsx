import React from 'react';
import styled from 'styled-components';

import Sidebar from './Sidebar';
import DroppableLayer from './DroppableLayer';

const Container = styled.div`
  position: absolute;
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
}) => (
  <Container open={open}>
    <Sidebar
      open={open}
      handleClickMenu={handleClickMenu}
      components={components}
    />
    {open ? (
      <DroppableLayer engine={engine} components={components} />
    ) : null}
  </Container>
);

export default ComponentSelect;
