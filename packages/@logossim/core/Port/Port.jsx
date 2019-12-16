import React from 'react';
import styled from 'styled-components';

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border: 1px solid white;
  border-radius: 100%;
  background: #666;

  &:hover {
    background: #0c5870;
  }
`;

const Port = props => {
  const { name, node, className = '' } = props;
  return (
    <Circle
      className={`port ${className}`}
      data-name={name}
      data-nodeid={node.getID()}
    />
  );
};

export default Port;
