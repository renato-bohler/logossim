import React from 'react';

import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  z-index: 10;

  font-size: 2em;
  font-weight: bold;
  font-family: monospace;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background: #ffffff80;
  border: 1px solid #6441a5;
  border-radius: 16px;

  padding: 16px;
`;

const LoadingExample = () => (
  <Container>Loading example...</Container>
);

export default LoadingExample;
