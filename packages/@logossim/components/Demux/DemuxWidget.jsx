import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const PositionedPort = styled(Port)`
  position: absolute;
  ${props => {
    if (props.name === 'in') return 'left: -5px;';
    if (props.name === 'selection') return 'left: 10px;';
    return 'right: -5px;';
  }};
  ${props => {
    if (props.name === 'selection') return 'bottom: -5px;';
    return `top: ${(props.position || 0) - 5}px;`;
  }};
`;

const Wrapper = styled.div`
  position: relative;

  width: 30px;
  height: ${props => (props.outputNumber + 2) * 15}px;
`;

export const Shape = ({ selected, outputNumber, icon }) => {
  const height = (outputNumber + 2) * 15;

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
      <path d={`M0,15 L0,${height - 15} L30,${height} L30,0 Z`} />
      <path d={`M15,${height - 7.5} L15,${height}`} />
    </svg>
  );
};

const DemuxWidget = props => {
  const { model } = props;
  const {
    options: { selected },
  } = model;

  const outputPorts = Object.values(model.getOutputPorts());
  const { outputNumber } = model;

  return (
    <Wrapper outputNumber={outputNumber}>
      <PositionedPort
        name="in"
        model={model}
        position={((outputNumber + 2) * 15) / 2}
      />
      <PositionedPort name="selection" model={model} />
      {outputPorts.map((port, i) => (
        <PositionedPort
          key={port.getName()}
          name={port.getName()}
          model={model}
          position={(i + 1) * 15}
        />
      ))}
      <Shape selected={selected} outputNumber={outputNumber} />
    </Wrapper>
  );
};

export default DemuxWidget;
