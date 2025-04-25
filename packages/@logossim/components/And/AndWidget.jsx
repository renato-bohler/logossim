import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

import { PortExtension, distributePorts } from '../portExtendUtils';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 60px;
  height: 60px;

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
    if (props.name === 'out') return '';
    return `top: ${props.position * 10 - 5}px;`;
  }}

  ${props => {
    if (props.name === 'out') return 'right: -5px';
    return 'left: -5px';
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
        d="M 2 2 L 2 45 A 42.999999 42.999999 0 0 0 2 45.271484 L 2 88 L 45 88 A 42.999999 42.999999 0 0 0 88 45 A 42.999999 42.999999 0 0 0 45 2 L 44.728516 2 L 2 2 z "
      />
    </g>
  </svg>
);

const AndWidget = props => {
  const { model } = props;

  const inputPorts = Object.values(model.getInputPorts());
  const portPositions = distributePorts(inputPorts.length);

  return (
    <Wrapper selected={model.isSelected()}>
      <PortExtension
        selected={model.isSelected()}
        portPositions={portPositions}
      />
      {inputPorts.map((port, i) => (
        <PositionedPort
          key={port.getName()}
          name={port.getName()}
          position={portPositions[i]}
        />
      ))}
      <PositionedPort name="out" />
      <Shape />
    </Wrapper>
  );
};

export default AndWidget;
