import React from 'react';

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 128px;
`;

const Button = styled.button`
  height: 128px;

  margin: 0;
  padding: 0;

  border: 1px solid black;
  border-radius: 15px;
  overflow: hidden;

  cursor: pointer;

  &:hover {
    opacity: 60%;
  }
`;

const Title = styled.span`
  text-align: center;
`;

const SelectCircuit = ({ children, image, onClick }) => (
  <Container>
    <Button onClick={onClick}>{image}</Button>
    <Title>{children}</Title>
  </Container>
);

export default SelectCircuit;
