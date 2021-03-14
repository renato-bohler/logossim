import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const PositionedPort = styled(Port)`
  position: absolute;

  ${props => {
    if (props.name === 'out') return `right: -5px; top: -5px`;
    return `left: -5px; bottom: ${props.position - 5}px;`;
  }}
`;

const Wrapper = styled.div`
  position: relative;

  width: 30px;
  height: ${props => 15 * props.dataBits}px;
`;

export const Shape = ({ selected, dataBits }) => {
  const height = dataBits * 15;

  return (
    <svg
      viewBox={`0 0 30 ${height}`}
      height={height}
      width="30"
      fill="none"
      stroke={
        selected ? 'var(--link-selected)' : 'var(--link-16-bit-color)'
      }
      strokeLinecap="butt"
      strokeWidth="2"
    >
      <path strokeWidth="4" d={`M30,0 L15,15 L15,${height}`} />
      {[...new Array(dataBits)]
        .map((_, index) => index)
        .map(index => {
          const bitHeight = height - index * 15;

          return (
            <path
              key={index}
              d={`M15,${bitHeight} L0,${bitHeight}`}
            />
          );
        })}
    </svg>
  );
};

const JoinerWidget = props => {
  const { model, engine } = props;
  const {
    options: { selected },
    configurations: { DATA_BITS },
  } = model;

  const dataBits = Number(DATA_BITS);
  const inputPorts = Object.values(model.getInputPorts());

  return (
    <Wrapper dataBits={dataBits}>
      {inputPorts.map((port, i) => (
        <PositionedPort
          key={port.getName()}
          name={port.getName()}
          model={model}
          engine={engine}
          position={i * 15}
        />
      ))}
      <PositionedPort name="out" model={model} engine={engine} />
      <Shape selected={selected} dataBits={dataBits} />
    </Wrapper>
  );
};

export default JoinerWidget;
