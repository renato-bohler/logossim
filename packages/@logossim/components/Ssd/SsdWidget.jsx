import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const SEGMENTS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'dp'];

const PositionedPort = styled(Port)`
  position: absolute;
  left: ${props => props.position.horizontal}px;
  top: ${props => props.position.vertical}px;
  transform: translateY(-50%);
`;

export const Wrapper = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: ${props => (props.icon ? 23 : 75)}px;
  height: ${props => (props.icon ? 36 : 90)}px;

  background: ${props => `#ffffff${props.selected ? '80' : 'ff'}`};
  box-shadow: 0 0 ${props => (props.isActive ? 15 : 0)}px
    ${props => props.color};
  border: 2px solid
    ${props =>
      props.selected
        ? 'var(--border-selected)'
        : 'var(--border-unselected)'};
  border-radius: 5px;
`;

export const Shape = ({ segments, selected, icon }) => (
  <svg
    width={icon ? 18 : 50}
    height={icon ? 36 : 90}
    viewBox={icon ? '-7 0 60 90' : '0 0 50 90'}
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      opacity: selected ? '80' : 'ff',
      fillOpacity: selected ? '80' : 'ff',
    }}
  >
    {/* A */}
    <polyline
      points="5 18 11 20 32 20 35 14 9 14"
      fill={segments.a}
      data-testid="a"
    />
    {/* B */}
    <polyline
      points="37 14 41 20 39 42 37 44 33 39 34 20"
      fill={segments.b}
      data-testid="b"
    />
    {/* C */}
    <polyline
      points="37 46 38 47 36 71 31 76 29 69 31 51"
      fill={segments.c}
      data-testid="c"
    />
    {/* D */}
    <polyline
      points="0 72 7 69 27 69 29 76 4 76"
      fill={segments.d}
      data-testid="d"
    />
    {/* E */}
    <polyline
      points="4 46 8 51 7 67 0 70 2 47"
      fill={segments.e}
      data-testid="e"
    />
    {/* F */}
    <polyline
      points="5 20 11 22 10 39 4 44 3 42"
      fill={segments.f}
      data-testid="f"
    />
    {/* G */}
    <polyline
      points="6 45 9 48 31 48 35 45 32 41 11 41"
      fill={segments.g}
      data-testid="g"
    />
    {/* DP */}
    <circle
      r="5"
      cx="45"
      cy="71"
      fill={segments.dp}
      data-testid="dp"
    />
  </svg>
);

const LedWidget = props => {
  const { model } = props;
  const {
    options: { selected },
  } = model;

  return (
    <Wrapper selected={selected}>
      <Shape
        selected={selected}
        segments={SEGMENTS.reduce(
          (prev, segment) => ({
            ...prev,
            [segment]: model.getColor(segment),
          }),
          {},
        )}
      />
      {SEGMENTS.map(segment => (
        <PositionedPort
          key={segment}
          name={segment}
          position={model.getPositionForSegment(segment)}
        />
      ))}
    </Wrapper>
  );
};

export default LedWidget;
