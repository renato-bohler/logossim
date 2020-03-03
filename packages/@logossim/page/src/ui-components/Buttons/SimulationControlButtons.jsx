import React from 'react';
import styled from 'styled-components';

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

const Play = () => (
  <svg viewBox="0 0 512 512" width="15" height="15" fill="#008000">
    <path d="M60.54,512c-17.06,0-30.43-13.86-30.43-31.56V31.55C30.12,13.86,43.48,0,60.55,0A32.94,32.94,0,0,1,77,4.52L465.7,229c10.13,5.85,16.18,16,16.18,27s-6,21.2-16.18,27L77,507.48A32.92,32.92,0,0,1,60.55,512Z" />
  </svg>
);

const Pause = () => (
  <svg viewBox="0 0 512 512" width="15" height="15" fill="#ffb100">
    <path d="M395,512a73.14,73.14,0,0,1-73.14-73.14V73.14a73.14,73.14,0,1,1,146.29,0V438.86A73.14,73.14,0,0,1,395,512Z" />
    <path d="M117,512a73.14,73.14,0,0,1-73.14-73.14V73.14a73.14,73.14,0,1,1,146.29,0V438.86A73.14,73.14,0,0,1,117,512Z" />
  </svg>
);

const Stop = () => (
  <svg viewBox="0 0 512 512" width="15" height="15" fill="#c53838">
    <path d="M 65.249771,0 A 65.248738,65.376306 0 0 0 0.413662,58.057582 h -0.18732 v 1.884685 A 65.248738,65.376306 0 0 0 0,65.377342 65.248738,65.376306 0 0 0 0.226342,70.796781 V 441.18757 A 65.248738,65.376306 0 0 0 0,446.62268 a 65.248738,65.376306 0 0 0 0.226342,5.41161 v 2.88566 H 0.530738 A 65.248738,65.376306 0 0 0 65.249771,512 a 65.248738,65.376306 0 0 0 2.44297,-0.0468 H 444.31507 a 65.248738,65.376306 0 0 0 2.43514,0.0468 65.248738,65.376306 0 0 0 2.44297,-0.0468 h 0.56977 v -0.024 a 65.248738,65.376306 0 0 0 61.70628,-57.00966 h 0.0312 v -0.22662 a 65.248738,65.376306 0 0 0 0.49952,-8.07049 65.248738,65.376306 0 0 0 -0.49952,-8.01579 V 67.011775 a 65.248738,65.376306 0 0 0 0.0234,-1.634433 65.248738,65.376306 0 0 0 -0.0234,-1.681351 v -5.638409 h -0.38247 A 65.248738,65.376306 0 0 0 456.2645,0.77420532 V 0 H 446.40678 446.2741 65.374651 Z" />
  </svg>
);

const SimulationControlButtons = ({
  state,
  handleClickStart,
  handleClickPause,
  handleClickStop,
}) => (
  <Container>
    <Button onClick={handleClickStart} disabled={state === 'started'}>
      <Play />
    </Button>
    <Button
      onClick={handleClickPause}
      disabled={state === 'paused' || state === 'stopped'}
    >
      <Pause />
    </Button>
    <Button onClick={handleClickStop} disabled={state === 'stopped'}>
      <Stop />
    </Button>
  </Container>
);

export default SimulationControlButtons;
