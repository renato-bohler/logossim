import React from 'react';
import styled from 'styled-components';

import MenuIcon from '../Icons/Menu';
import DraggableComponent from './DraggableComponent';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  z-index: 2;

  display: flex;
  flex-direction: column;

  background: ${props =>
    props.open ? 'rgba(255, 255, 255, 0.8)' : 'none'};
  border-right: ${props =>
    props.open ? '1px dotted #494949' : 'none'};

  width: 300px;
  height: ${props => (props.open ? '100vh' : 'max-content')};
`;

const MenuButton = styled.button.attrs(({ ...props }) => ({
  ...props,
  type: 'button',
}))`
  background: #494949;
  svg {
    fill: white;
  }

  border: none;
  border-radius: 200%;
  width: 32px;
  height: 32px;
  margin: 5px;
`;

const DraggableContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 8px;

  padding: 8px;
`;

const Sidebar = ({ open, handleClickMenu, components }) => (
  <Container open={open}>
    <MenuButton open={open} onClick={handleClickMenu}>
      <MenuIcon />
    </MenuButton>
    {open ? (
      <DraggableContainer>
        {components.map(component => (
          <DraggableComponent
            key={component.type}
            component={component}
          />
        ))}
      </DraggableContainer>
    ) : null}
  </Container>
);

export default Sidebar;
