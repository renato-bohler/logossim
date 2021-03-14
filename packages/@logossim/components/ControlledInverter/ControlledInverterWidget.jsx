import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 45px;
  height: 30px;

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
    if (props.name === 'control') return 'bottom: -5px; left: 10px;';
    if (props.name === 'in') return 'left: -5px;';
    if (props.name === 'out') return 'right: -5px;';
    return '';
  }}
`;

export const Shape = ({ size = 30 }) => (
  <svg
    height={size}
    width={size + 15}
    viewBox="11 0 45.0 45.0"
    fill="var(--body-unselected)"
    stroke="var(--border-unselected)"
    strokeWidth="var(--border-width)"
  >
    <g>
      <path d="M 1.0207771,1.6492624 V 43.357967 L 42.724327,22.649262 Z" />
      <circle r="8" cy="22" cx="51" />
      <line x1="22.5" y1="32.5" x2="22.5" y2="45" />
    </g>
  </svg>
);

const ControlledInverterWidget = props => {
  const { model } = props;
  const {
    options: { selected },
  } = model;

  return (
    <Wrapper selected={selected}>
      <PositionedPort name="control" model={model} />
      <PositionedPort name="in" model={model} />
      <PositionedPort name="out" model={model} />
      <Shape />
    </Wrapper>
  );
};

export default ControlledInverterWidget;
