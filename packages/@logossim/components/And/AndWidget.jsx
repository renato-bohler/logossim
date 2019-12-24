import React from 'react';
import styled from 'styled-components';
import { Port } from '@logossim/core';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 90px;
  height: 90px;

  transition: 100ms linear;
  svg {
    fill: ${props =>
      `rgba(115, 190, 255, ${props.selected ? 0.5 : 0.95})`};
    stroke: ${props =>
      props.selected ? 'rgba(115,190,255,0.95)' : '#598897'};
    stroke-dasharray: ${props => (props.selected ? 5 : 0)};
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

export const Shape = ({ size = 90 }) => (
  <svg
    height={size}
    width={size}
    viewBox="0 0 23.812499 23.812501"
    fill="rgba(115, 190, 255, 0.95)"
    stroke="#598897"
    strokeWidth="2"
  >
    <g>
      <path
        transform="scale(0.26458333)"
        d="M 2 2 L 2 45 A 42.999999 42.999999 0 0 0 2 45.271484 L 2 88 L 45 88 A 42.999999 42.999999 0 0 0 88 45 A 42.999999 42.999999 0 0 0 45 2 L 44.728516 2 L 2 2 z "
      />
    </g>
  </svg>
);

const AndWidget = props => {
  const { node, engine } = props;

  return (
    <Wrapper selected={node.options.selected}>
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
      <Shape />
    </Wrapper>
  );
};

export default AndWidget;