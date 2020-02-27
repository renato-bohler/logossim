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
      props.selected
        ? 'var(--body-selected)'
        : 'var(--body-unselected)'};
    stroke: ${props =>
      props.selected
        ? 'var(--border-selected)'
        : 'var(--border-unselected)'};
  }
`;

const PositionedPort = styled(Port)`
  position: absolute;

  ${props => {
    switch (props.name) {
      case 'in0':
        return 'left: 10px; top: 10px;';
      case 'in1':
        return 'left: 10px; bottom: 10px;';
      case 'out':
        return 'right: -5px';
      default:
        return 'left: 0px';
    }
  }};
`;

export const Shape = ({ size = 90 }) => (
  <svg
    height={size}
    width={size}
    viewBox="0 0 23.812499 23.812501"
    fill="var(--body-unselected)"
    stroke="var(--border-unselected)"
    strokeWidth="var(--border-width)"
  >
    <g>
      <path
        transform="scale(0.26458333)"
        d="m 12.810547,2 c 5.50133,9.517685 8.779279,25.095781 8.779297,41.722656 C 21.590006,62.052878 17.611871,78.966668 11.175781,88 H 45 C 68.748245,88.000001 88.005576,45.650843 88,45 87.994195,44.322314 68.748245,1.9999989 45,2 h -0.271484 z"
      />
    </g>
  </svg>
);

const OrWidget = props => {
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

export default OrWidget;
