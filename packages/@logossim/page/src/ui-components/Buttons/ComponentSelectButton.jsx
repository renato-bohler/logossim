import React from 'react';

import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;

  z-index: 2;
`;

const Button = styled.button.attrs(({ ...props }) => ({
  ...props,
  type: 'button',
}))`
  border: none;
  border-radius: 100%;

  background: orange;
  box-shadow: inset 0 0 10px #ff8d00;

  width: 60px;
  height: 60px;
  margin: 16px;

  font-size: 2em;
  line-height: 1em;
  color: white;

  transition: 0.5s ease-in-out;

  &:disabled {
    opacity: 10%;
    cursor: not-allowed;
    background: gray;
    box-shadow: inset 0 0 10px black;
  }
`;

const ComponentSelectButton = ({ handleClick, disabled }) => (
  <Container id="component-select-button">
    <Button
      onClick={handleClick}
      disabled={disabled}
      data-for="tooltip"
      data-tip="Add component..."
      data-place="left"
    >
      +
    </Button>
  </Container>
);

export default ComponentSelectButton;
