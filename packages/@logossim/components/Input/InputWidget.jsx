import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const SHAPE_SIZES = {
  1: { width: 20, height: 20 },
  2: { width: 40, height: 20 },
  4: { width: 80, height: 20 },
  8: { width: 80, height: 40 },
  16: { width: 160, height: 40 },
};

const PIN_BACKGROUND = {
  0: 'var(--value-off)',
  1: 'var(--value-on)',
  x: 'var(--value-floating)',
};

const PIN_BORDER = {
  0: 'var(--value-on)',
  1: 'var(--value-off)',
  x: 'black',
};

const PositionedPort = styled(Port)`
  position: absolute;
  right: -7px;
  top: 50%;
  transform: translateY(-50%);
`;

export const Shape = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: ${props => SHAPE_SIZES[props.dataBits].width}px;
  height: ${props => SHAPE_SIZES[props.dataBits].height}px;

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

export const PinContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;

  max-width: 215px;
`;

export const Pin = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;
  margin: 2px;

  background: ${props => PIN_BACKGROUND[props.value]};
  border: 2px solid ${props => PIN_BORDER[props.value]};
  border-radius: 100%;

  color: ${props => (props.value === 1 ? 'black' : 'white')};
  font-family: monospace;

  transition: 100ms linear;
`;

const InputWidget = props => {
  const { model } = props;
  const {
    options: { selected },
    configurations: { DATA_BITS },
  } = model;

  const dataBits = Number(DATA_BITS);

  return (
    <Shape selected={selected} dataBits={dataBits}>
      <PinContainer>
        {[...new Array(dataBits)].map((_, index) => {
          const value = model.getBitAt(index);

          return (
            <Pin
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              onClick={() => model.onClick(index)}
              value={value}
            >
              {value}
            </Pin>
          );
        })}
      </PinContainer>
      <PositionedPort name="out" />
    </Shape>
  );
};

export default InputWidget;
