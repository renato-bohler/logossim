import React from 'react';

import styled from 'styled-components';

const Container = styled.span`
  display: inline-flex;
  align-items: center;

  height: ${props => props.size}px;
  padding: 0 ${props => props.size / 4}px;
  margin: 2px ${props => props.size / 8}px;

  font-size: ${props => props.size / 2}px;
  font-family: monospace;
  color: #000000c4;

  background: #ececec;
  border-radius: 4px;
  border: 1px solid #ffffff17;
  box-shadow: inset 0 0 ${props => props.size / 4}px #0000000a;
`;

const Key = ({ children, size = 16 }) => (
  <Container size={size}>{children}</Container>
);

export default Key;
