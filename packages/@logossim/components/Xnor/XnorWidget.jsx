import React, { Fragment } from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

import { PortExtension, distributePorts } from '../portExtendUtils';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 105px;
  height: 90px;

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

const PortExtensionConnector = styled.div`
  position: absolute;
  z-index: -1;

  background: ${props =>
    props.selected
      ? 'var(--border-selected)'
      : 'var(--border-unselected)'};

  height: 2px;
  width: 15px;

  top: ${props => props.position * 15 - 1}px;
  left: -2px;
`;

const PositionedPort = styled(Port)`
  position: absolute;

  ${props => {
    if (props.name === 'out') return '';
    return `top: ${props.position * 15 - 5}px;`;
  }}

  ${props => {
    if (props.name === 'out') return 'right: -5px';
    return 'left: -5px';
  }};
`;

export const Shape = ({ size = 90, portPositions = [] }) => (
  <svg
    height={size}
    width={size + 15}
    viewBox="0 0 27.781249 23.812501"
    fill="var(--body-unselected)"
    stroke="var(--border-unselected)"
    strokeWidth="var(--border-width)"
  >
    <g>
      <path
        fill="none"
        style={{
          transform:
            'scale(0.284583, 0.284583) translate(-1px, -3px)',
        }}
        d="m 11.926664,1.1161165 c 5.50133,9.5176855 9.663162,25.9796645 9.66318,42.6065395 m 0,0 c 1.62e-4,18.330222 -4.950245,36.216284 -11.386335,45.249616"
      />
      <g transform="scale(0.26458333)">
        <path
          d="m 12.810547,2 c 5.50133,9.517685 8.779279,25.095781 8.779297,41.722656 C 21.590006,62.052878 17.611871,78.966668 11.175781,88 H 37.875 c 23.748245,0 43.005576,-42.349157 43,-43 -0.0058,-0.677686 -19.251755,-43 -43,-43 h -0.271484 z"
          transform="translate(7)"
        />
        <circle r="5.72056" cy="45" cx="94.27944" />
      </g>
    </g>
    <g strokeWidth={0.5}>
      {portPositions.includes(1) && (
        <path d="M 4.8860442,4.1010415 H 0.38245295" />
      )}
      {portPositions.includes(2) && (
        <path d="M 5.3419835,8.0697915 H 0.38232292" />
      )}
      {portPositions.includes(3) && (
        <path d="M 5.5975927,12.038541 H 0.38232292" />
      )}
      {portPositions.includes(4) && (
        <path d="M 5.2516863,16.007291 H 0.38232292" />
      )}
      {portPositions.includes(5) && (
        <path d="M 4.3916654,19.976041 H 0.38232292" />
      )}
    </g>
  </svg>
);

const XnorWidget = props => {
  const { model } = props;

  const inputPorts = Object.values(model.getInputPorts());
  const portPositions = distributePorts(inputPorts.length);

  return (
    <Wrapper selected={model.options.selected}>
      <PortExtension
        selected={model.isSelected()}
        portPositions={portPositions}
        offsetX={12}
      />
      {inputPorts.map((port, i) => (
        <Fragment key={port.getName()}>
          <PositionedPort
            name={port.getName()}
            position={portPositions[i]}
          />
          {(portPositions[i] < 1 || portPositions[i] > 5) && (
            <PortExtensionConnector
              selected={model.isSelected()}
              position={portPositions[i]}
            />
          )}
        </Fragment>
      ))}
      <PositionedPort name="out" />
      <Shape portPositions={portPositions} />
    </Wrapper>
  );
};

export default XnorWidget;
