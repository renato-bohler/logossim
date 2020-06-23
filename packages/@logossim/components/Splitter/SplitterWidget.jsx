import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const PositionedPort = styled(Port)`
  position: absolute;
  ${props => (props.name === 'in' ? 'left: -5px' : 'right: -5px')};
  bottom: ${props => (props.position || 0) - 5}px;
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
      <path
        strokeWidth="4"
        d={`M0,${height} L15,${height - 15} L15,0`}
      />
      {[...new Array(dataBits)]
        .map((_, index) => index + 1)
        .map(index => {
          const bitHeight = height - index * 15;

          return (
            <path
              key={index}
              d={`M15,${bitHeight} L30,${bitHeight}`}
            />
          );
        })}
    </svg>
  );
};

const SplitterWidget = props => {
  const { model, engine } = props;
  const {
    options: { selected },
    configurations: { DATA_BITS },
  } = model;

  const dataBits = Number(DATA_BITS);
  const outputPorts = Object.values(model.getOutputPorts());

  return (
    <Wrapper dataBits={dataBits}>
      <PositionedPort
        name="in"
        model={model}
        port={model.getPort('in')}
        engine={engine}
      />
      {outputPorts.map((port, i) => (
        <PositionedPort
          key={port.getName()}
          name={port.getName()}
          model={model}
          port={port}
          engine={engine}
          position={(i + 1) * 15}
        />
      ))}
      <Shape selected={selected} dataBits={dataBits} />
    </Wrapper>
  );
};

export default SplitterWidget;
