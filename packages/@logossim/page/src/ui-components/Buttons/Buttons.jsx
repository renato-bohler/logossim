import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  right: 0;

  z-index: 100;
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
  font-weight: bold;
  font-size: 1.2em;

  min-width: 110px;
  padding: 5px 20px;
  margin: 5px;
`;

const Buttons = ({
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

export default Buttons;
