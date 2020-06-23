import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const SHAPE_SIZES = {
  1: { width: 30, height: 30 },
  2: { width: 60, height: 30 },
  4: { width: 120, height: 30 },
  8: { width: 120, height: 60 },
  16: { width: 240, height: 60 },
};

const PositionedPort = styled(Port)`
  position: absolute;
  left: -7px;
  top: 50%;
  transform: translateY(-50%);
`;

export const Shape = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: ${props => {
    if (props.format === 'BITS')
      return SHAPE_SIZES[props.dataBits].width;

    return SHAPE_SIZES[4].width;
  }}px;
  height: ${props => {
    if (props.format === 'BITS')
      return SHAPE_SIZES[props.dataBits].height;

    return SHAPE_SIZES[4].height;
  }}px;

  background: ${props =>
    props.selected
      ? 'var(--body-selected)'
      : 'var(--body-unselected)'};
  border: 2px solid
    ${props =>
      props.selected
        ? 'var(--border-selected)'
        : 'var(--border-unselected)'};
  border-radius: 20px;
`;

export const PinContainer = styled.span`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap-reverse;
  justify-content: space-evenly;
  align-items: center;

  max-width: 215px;
`;

export const Pin = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;
  margin: 2px;

  background: ${props => {
    if (props.value === 0) return 'var(--value-off)';
    if (props.value === 1) return 'var(--value-on)';
    return 'var(--value-error)';
  }};
  border: 2px solid
    ${props => {
      if (props.value === 0) return 'var(--value-on)';
      if (props.value === 1) return 'var(--value-off)';
      return 'black';
    }};
  border-radius: 100%;

  color: ${props => (props.value === 1 ? 'black' : 'white')};
  font-family: monospace;

  transition: 100ms linear;
`;

const ErrorMessage = styled.span`
  color: var(--value-error);
  font-weight: bold;
`;

const mapBits = model => {
  const {
    configurations: { DATA_BITS },
  } = model;
  const dataBits = Number(DATA_BITS);

  return [...new Array(dataBits)].map((_, index) => {
    const value = model.getBitAt(index);

    return (
      <Pin
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        value={value}
      >
        {value === 0 || value === 1 ? value : 'E'}
      </Pin>
    );
  });
};

const showAsNumber = (input, format) => {
  if (input === 'error') return <ErrorMessage>ERROR</ErrorMessage>;

  if (format === 'DECIMAL') return input;
  if (format === 'HEXADECIMAL')
    return `0x${input.toString(16).padStart(4, '0')}`;
  return '';
};

const OutputWidget = props => {
  const { model, engine } = props;
  const {
    options: { selected },
    configurations: { OUTPUT_FORMAT, DATA_BITS },
  } = model;

  const dataBits = Number(DATA_BITS);

  return (
    <Shape
      selected={selected}
      format={OUTPUT_FORMAT}
      dataBits={dataBits}
    >
      <PinContainer>
        {OUTPUT_FORMAT === 'BITS'
          ? mapBits(model)
          : showAsNumber(model.getInput(), OUTPUT_FORMAT)}
      </PinContainer>
      <PositionedPort
        name="in"
        model={model}
        port={model.getPort('in')}
        engine={engine}
      />
    </Shape>
  );
};

export default OutputWidget;
