import React from 'react';
import styled from 'styled-components';
import { Port } from '@logossim/core';

import AndShape from './AndShape';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${props => props.size}px;
  height: ${props => props.size}px;

  transition: 100ms linear;
  svg {
    fill: ${props =>
      `rgba(115, 190, 255, ${props.selected ? 0.5 : 0.95})`};
    stroke-width: 1px;
    stroke: ${props =>
      props.selected ? 'rgba(115,190,255,0.95)' : '#598897'};
    stroke-dasharray: ${props => (props.selected ? 1 : 0)};
  }
`;

const PositionedPort = styled(Port)`
  position: absolute;

  ${props => {
    switch (props.name) {
      case 'in0':
        return 'left: -5px; top: 10px;';
      case 'in1':
        return 'left: -5px; bottom: 10px;';
      case 'out':
        return 'right: -5px';
      default:
        return 'left: -5px';
    }
  }};
`;

const And = props => {
  const { node, engine, size = 90 } = props;

  return (
    <Wrapper size={size} selected={node.options.selected}>
      <PositionedPort
        name="in0"
        node={node}
        port={node.getPort('in0')}
        engine={engine}
      />
      <PositionedPort
        name="in1"
        node={node}
        port={node.getPort('in1')}
        engine={engine}
      />
      <PositionedPort
        name="out"
        node={node}
        port={node.getPort('out')}
        engine={engine}
      />
      <AndShape />
    </Wrapper>
  );
};

export default And;
