import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 30px;
  height: 30px;

  transition: 100ms linear;
  .shape {
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
  right: -5px;
`;

export const Shape = ({
  size = 30,
  output,
  color,
  periodMs,
  animateTransition,
}) => (
  <svg
    className="shape"
    height={size}
    width={size}
    viewBox="0 0 7.9374997 7.9375003"
    fill="var(--body-unselected)"
    stroke="var(--border-unselected)"
    strokeWidth="1"
  >
    <g>
      <rect
        y="0.26458332"
        x="0.26458332"
        height="7.4083333"
        width="7.4083333"
      />
    </g>
    <path
      stroke={color}
      strokeWidth={0.75}
      fill="none"
      style={{
        transform: output === 0 ? 'rotateX(180deg)' : 'none',
        transformOrigin: 'center',
        transition: animateTransition
          ? `calc(${periodMs}ms / 2 * 0.4) ease-in-out`
          : 'none',
      }}
      d="M 1.8683545,4.4337648 V 6.14192 H 4.0062447 V 1.79558 h 2.0629007 v 1.7578226"
    />
  </svg>
);

const ClockWidget = props => {
  const { model, engine } = props;
  const {
    options: { selected },
    periodMs,
  } = model;

  const out = model.getPort('out');

  return (
    <Wrapper selected={selected}>
      <PositionedPort
        name="out"
        model={model}
        port={out}
        engine={engine}
      />
      <Shape
        output={out.getValue()}
        color={out.getColor()}
        periodMs={periodMs}
        animateTransition={periodMs >= 500}
      />
    </Wrapper>
  );
};

export default ClockWidget;
