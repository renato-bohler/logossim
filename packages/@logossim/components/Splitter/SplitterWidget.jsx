import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const PositionedPort = styled(Port)`
  position: absolute;
  ${props => (props.name === 'in' ? 'left: -7px' : 'right: -7px')};
  bottom: ${props => (props.position || 0) - 7}px;
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

const SplitterWidget = props => {
  const { model, engine } = props;
  const {
    options: { selected },
    configurations: { DATA_BITS },
  } = model;

  const dataBits = parseInt(DATA_BITS, 10);
  const outputPorts = Object.values(model.getOutputPorts());

  return (
    <Shape selected={selected} dataBits={dataBits}>
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
    </Shape>
  );
};

export default SplitterWidget;
