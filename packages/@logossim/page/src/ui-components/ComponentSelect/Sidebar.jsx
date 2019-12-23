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

  background: ${props => (props.open ? 'white' : 'none')};
  border-right: ${props =>
    props.open ? '1px solid #494949' : 'none'};

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

const Sidebar = ({ open, handleClickMenu, components }) => (
  <Container open={open}>
    <MenuButton open={open} onClick={handleClickMenu}>
      <MenuIcon />
    </MenuButton>
    {open ? (
      <div>
        {components.map(component => (
          <DraggableComponent
            key={component.type}
            component={component}
          />
        ))}
      </div>
    ) : null}
  </Container>
);

export default Sidebar;
