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
      <PositionedPort name="in" />
      <PositionedPort name="out" />
      ++
    </Wrapper>
  );
};

export default CounterWidget;
