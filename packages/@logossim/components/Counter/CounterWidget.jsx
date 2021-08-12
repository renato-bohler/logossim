import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 30px;
  height: 30px;

  font-size: 12px;

  transition: 100ms linear;

  background: ${props =>
    props.selected
      ? 'var(--body-selected)'
      : 'var(--body-unselected)'};

  border: 2px solid
    ${props =>
      props.selected
        ? 'var(--border-selected)'
        : 'var(--border-unselected)'};
`;

const Chevron = ({ className, selected }) => (
  <svg
    className={className}
    width={12}
    height={20}
    viewBox="0 0 12 20"
    stroke={`var(--border-${selected ? '' : 'un'}selected)`}
    strokeWidth={2}
    strokeLinecap="round"
  >
    <line x1={0} y1={0} x2={6} y2={10} />
    <line x1={6} y1={10} x2={0} y2={20} />
  </svg>
);

const PositionedChevron = styled(Chevron)`
  position: absolute;
  left: -1px;

  transition: 100ms linear;
`;

const PositionedPort = styled(Port)`
  position: absolute;
  ${props => {
    if (props.name === 'in') return 'left: -7px;';
    if (props.name === 'out') return 'right: -7px;';
    return '';
  }}
`;

const CounterWidget = props => {
  const { model } = props;
  const {
    options: { selected },
  } = model;

  return (
    <Wrapper selected={selected}>
      <PositionedChevron selected={selected} />
      <PositionedPort name="in" />
      <PositionedPort name="out" />
      ++
    </Wrapper>
  );
};

export default CounterWidget;
