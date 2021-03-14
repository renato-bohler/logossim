import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const PositionedPort = styled(Port)`
  position: absolute;
  right: -7px;
  top: 50%;
  transform: translateY(-50%);
`;

export const Shape = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 45px;
  height: 30px;

  background: ${props =>
    props.selected
      ? 'var(--body-selected)'
      : 'var(--body-unselected)'};
  border: 2px solid
    ${props =>
      props.selected
        ? 'var(--border-selected)'
        : 'var(--border-unselected)'};
  border-radius: 20px;
`;

export const Switch = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 24px;
  margin: 2px;

  background: #848484;
  border: 2px solid #313131;
  border-radius: 15px;

  color: ${props => (props.value === 1 ? 'black' : 'white')};
  font-family: monospace;
`;

export const SwitchValue = styled.div`
  transform: ${props =>
    props.isActive ? 'translateX(6px)' : 'translateX(-6px)'};

  width: 15px;
  height: 15px;

  border-radius: 100%;
  transition: 100ms linear;
  background: black;
`;

const SwitchWidget = props => {
  const { model, engine } = props;
  const {
    options: { selected },
  } = model;

  return (
    <Shape selected={selected}>
      <Switch onClick={() => model.onClick()}>
        <SwitchValue isActive={model.isActive()} />
      </Switch>
      <PositionedPort name="out" model={model} engine={engine} />
    </Shape>
  );
};

export default SwitchWidget;
