import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

import { PortExtension, distributePorts } from '../portExtendUtils';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 105px;
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
    if (props.name === 'out') return '';
    return `top: ${props.position * 15 - 5}px;`;
  }}

  ${props => {
    if (props.name === 'out') return 'right: -5px';
    return 'left: -5px';
  }};
`;

export const Shape = ({ size = 90 }) => (
  <svg
    height={size}
    width={size + 15}
    viewBox="0 0 27.781249 23.812501"
    fill="var(--body-unselected)"
    stroke="var(--border-unselected)"
    strokeWidth="var(--border-width)"
  >
    <g transform="scale(0.26458333)">
      <path d="m 2,2 v 43 a 42.999999,42.999999 0 0 0 0,0.271484 V 88 H 45 A 42.999999,42.999999 0 0 0 88,45 42.999999,42.999999 0 0 0 45,2 h -0.271484 z" />
      <circle r="5.72056" cy="45" cx="94.27944" />
    </g>
  </svg>
);

const NandWidget = props => {
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
          model={model}
          position={portPositions[i]}
        />
      ))}
      <PositionedPort name="out" model={model} />
      <Shape />
    </Wrapper>
  );
};

export default NandWidget;
