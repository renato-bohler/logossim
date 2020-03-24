import React from 'react';
import styled from 'styled-components';
import { Port } from '@logossim/core';

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

const OutputIndicator = ({ out, periodMs, animateTransition }) => (
  <svg
    viewBox="0 0 13.229167 13.229167"
    height="20"
    width="20"
    strokeWidth="2"
    fill="none"
    stroke={out.getColor()}
    style={{
      position: 'absolute',
      transform: out.getValue() === 0 ? 'rotateX(180deg)' : 'none',
      transition: animateTransition
        ? `calc(${periodMs}ms / 2 * 0.5) ease-in-out`
        : 'none',
    }}
  >
    <g>
      <path d="m 1.2811445,6.3517135 v 5.8161325 h 5.235864 V 1.0613205 h 5.4150755 c 0.01864,1.757611 0.01578,3.68107 0.01578,5.350926" />
    </g>
  </svg>
);

const PositionedPort = styled(Port)`
  position: absolute;
  right: -5px;
`;

export const Shape = ({ size = 30 }) => (
  <svg
    className="shape"
    width={size}
    height={size}
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
      <Shape />
      <OutputIndicator
        out={out}
        periodMs={periodMs}
        animateTransition={periodMs >= 500}
      />
    </Wrapper>
  );
};

export default ClockWidget;
