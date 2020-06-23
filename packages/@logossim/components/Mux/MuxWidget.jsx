import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const PositionedPort = styled(Port)`
  position: absolute;
  ${props => {
    if (props.name === 'out') return 'right: -5px;';
    if (props.name === 'selection') return 'left: 10px;';
    return 'left: -5px;';
  }};
  ${props => {
    if (props.name === 'selection') return 'bottom: -5px;';
    return `top: ${(props.position || 0) - 5}px;`;
  }};
`;

const Wrapper = styled.div`
  position: relative;

  width: 30px;
  height: ${props => (props.inputNumber + 2) * 15}px;
`;

export const Shape = ({ selected, inputNumber, icon }) => {
  const height = (inputNumber + 2) * 15;

  return (
    <svg
      viewBox={`0 0 30 ${height}`}
      height={icon ? 30 : height}
      width={icon ? 15 : 30}
      fill={
        selected ? 'var(--body-selected)' : 'var(--body-unselected)'
      }
      stroke={
        selected ? 'var(--link-selected)' : 'var(--link-16-bit-color)'
      }
      strokeLinecap="round"
      strokeWidth="2"
    >
      <path d={`M0,0 L0,${height} L30,${height - 15} L30,15 Z`} />
      <path d={`M15,${height - 7.5} L15,${height}`} />
    </svg>
  );
};

const MuxWidget = props => {
  const { model, engine } = props;
  const {
    options: { selected },
  } = model;

  const inputPorts = Object.values(model.getInputPorts());
  const inputNumber = inputPorts.length;

  return (
    <Wrapper inputNumber={inputNumber}>
      {inputPorts.map((port, i) => (
        <PositionedPort
          key={port.getName()}
          name={port.getName()}
          model={model}
          port={port}
          engine={engine}
          position={(i + 1) * 15}
        />
      ))}
      <PositionedPort
        name="out"
        model={model}
        port={model.getPort('out')}
        engine={engine}
        position={((inputNumber + 1) * 15) / 2}
      />
      <Shape selected={selected} inputNumber={inputNumber} />
    </Wrapper>
  );
};

export default MuxWidget;
