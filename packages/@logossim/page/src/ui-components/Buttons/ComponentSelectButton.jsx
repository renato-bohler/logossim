import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;

  z-index: 2;
`;

const Button = styled.button`
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
`;

const ComponentSelectButton = ({ handleClick }) => (
  <Container>
    <Button onClick={handleClick}>+</Button>
  </Container>
);

export default ComponentSelectButton;
