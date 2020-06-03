import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const PositionedPort = styled(Port)`
  position: absolute;

  ${props => {
    if (props.name === 'out') return `right: -7px; top: -7px`;
    return `left: -7px; bottom: ${props.position - 7}px;`;
  }}
`;

export const Shape = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 30px;
  height: ${props => 15 * props.dataBits}px;

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

const JoinerWidget = props => {
  const { model, engine } = props;
  const {
    options: { selected },
    configurations: { DATA_BITS },
  } = model;

  const dataBits = parseInt(DATA_BITS, 10);
  const inputPorts = Object.values(model.getInputPorts());

  return (
    <Shape selected={selected} dataBits={dataBits}>
      {inputPorts.map((port, i) => (
        <PositionedPort
          key={port.getName()}
          name={port.getName()}
          model={model}
          port={port}
          engine={engine}
          position={i * 15}
        />
      ))}
      <PositionedPort
        name="out"
        model={model}
        port={model.getPort('out')}
        engine={engine}
      />
    </Shape>
  );
};

export default JoinerWidget;
