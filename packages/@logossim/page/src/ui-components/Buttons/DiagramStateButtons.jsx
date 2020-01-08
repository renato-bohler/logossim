import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  z-index: 2;
`;

const Button = styled.button.attrs(({ ...props }) => ({
  ...props,
  type: 'button',
}))`
  border: none;
  border-radius: 5px;
  background: ${props => {
    switch (props.color) {
      case 'green':
        return '#07d26b';
      case 'orange':
        return 'orange';
      default:
        return 'gray';
    }
  }};

  color: white;
  font-size: 1.2em;

  min-width: 110px;
  padding: 5px 20px;
  margin: 5px;
`;

const DiagramStateButtons = ({
  handleClickSave,
  handleClickLoad,
  handleClickLock,
  isLocked,
}) => (
  <Container>
    <Button color="green" onClick={handleClickSave}>
      Save
    </Button>
    <Button color="orange" onClick={handleClickLoad}>
      Load
    </Button>
    <Button onClick={handleClickLock}>
      {isLocked ? 'Unlock' : 'Lock'}
    </Button>
  </Container>
);

export default DiagramStateButtons;
