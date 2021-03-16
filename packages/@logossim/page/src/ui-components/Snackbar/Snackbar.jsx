import React from 'react';

import styled, { keyframes } from 'styled-components';

const BACKGROUND_COLOR = {
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  success: '#4caf50',
};

const TRANSITION_DURATION = 500;

const Container = styled.div`
  position: absolute;
  top: ${props => (props.open ? '5px' : '-200px')};
  left: 50%;
  transition: top ${TRANSITION_DURATION}ms;
  transform: translateX(-50%);
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  border-radius: 10px;
  min-width: 300px;
  min-height: 50px;

  cursor: pointer;

  background: ${props => BACKGROUND_COLOR[props.type]};
  color: white;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14),
    0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  z-index: 2;
`;

const Message = styled.span`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  align-items: flex-start;
  margin-top: 5px;
  padding: 8px 16px;
`;

const progress = keyframes`
  0% {
    width: 100%;
  }
  100% {
    width: 0;
  }
`;

const ProgressBar = styled.div`
  background: #ffffff80;
  height: 5px;
  border-radius: 5px;
  align-self: flex-start;
  width: 100%;

  animation-name: ${progress};
  animation-play-state: ${props =>
    props.paused ? 'paused' : 'running'};
  animation-duration: ${props =>
    props.timeout - TRANSITION_DURATION / 2}ms;
  animation-delay: ${TRANSITION_DURATION / 2}ms;
  animation-timing-function: linear;
`;

const Snackbar = ({ open, handleClose, message, type, timeout }) => {
  return (
    <Container
      type={type}
      timeout={timeout}
      open={open}
      onClick={handleClose}
    >
      <Message>
        {message.split(`\n`).map((string, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>{string}</div>
        ))}
      </Message>

      {open && <ProgressBar timeout={timeout} />}
    </Container>
  );
};

export default Snackbar;
