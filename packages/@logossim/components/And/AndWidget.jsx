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

export const Shape = ({ size = 90 }) => (
  <svg
    viewBox="0 0 23.8125 23.8125"
    height={size}
    width={size}
    fill="rgba(115, 190, 255, 0.95)"
    stroke="#598897"
  >
    <g>
      <path d="M 0.26458333,0.2645835 V 11.911935 23.559286 H 11.911934 A 11.647361,11.647269 0 0 0 23.559285,11.911935 11.647361,11.647269 0 0 0 11.911934,0.2645835 Z" />
      <ellipse
        ry="15.437704"
        rx="0.03665797"
        cy="15.437704"
        cx="-0.03665797"
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
