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

  transition: 0.5s ease-in-out;

  &:disabled {
    opacity: 10%;
    cursor: not-allowed;
    background: gray;
  }
`;

const DiagramStateButtons = ({
  handleClickSave,
  handleClickLoad,
  disabled,
}) => (
  <Container>
    <Button
      color="green"
      onClick={handleClickSave}
      disabled={disabled}
    >
      Save
    </Button>
    <Button
      color="orange"
      onClick={handleClickLoad}
      disabled={disabled}
    >
      Load
    </Button>
  </Container>
);

export default DiagramStateButtons;
