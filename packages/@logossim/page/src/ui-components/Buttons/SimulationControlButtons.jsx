import React from 'react';

import styled from 'styled-components';

import { Play, Pause, Stop } from '../Icons';

const Container = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translate(-50%, 0);

  background: rgb(224, 224, 224);
  background: linear-gradient(
    0deg,
    rgba(224, 224, 224, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  );

  border: 1px solid gray;
  border-radius: 16px;

  z-index: 2;

  & > button {
    border-right: 1px solid gray;
    &:last-child {
      border-right: none;
    }
  }
`;

const Button = styled.button.attrs(({ ...props }) => ({
  ...props,
  type: 'button',
}))`
  background: none;
  border: none;

  font-size: 1.2em;

  min-width: 75px;
  min-height: 60px;

  &:disabled {
    & > svg {
      fill: #bfbfbf;
    }
  }
`;

const SimulationControlButtons = ({
  state,
  handleClickStart,
  handleClickPause,
  handleClickStop,
}) => (
  <Container id="simulation-control-buttons">
    <Button
      onClick={handleClickStart}
      disabled={state === 'started'}
      data-for="tooltip"
      data-tip="Start simulation"
    >
      <Play />
    </Button>
    <Button
      onClick={handleClickPause}
      disabled={state === 'paused' || state === 'stopped'}
      data-for="tooltip"
      data-tip="Pause simulation"
    >
      <Pause />
    </Button>
    <Button
      onClick={handleClickStop}
      disabled={state === 'stopped'}
      data-for="tooltip"
      data-tip="Stop simulation"
    >
      <Stop />
    </Button>
  </Container>
);

export default SimulationControlButtons;
