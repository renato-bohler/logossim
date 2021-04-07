import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const PositionedPort = styled(Port)`
  position: absolute;
  left: 50%;
  bottom: -5px;
  transform: translateX(-50%);
`;

const Wrapper = styled.div`
  position: relative;

  width: 30px;
  height: 30px;
`;

export const Shape = ({ selected, dataBits = 1 }) => {
  return (
    <svg
      viewBox="0 0 30 30"
      width="30"
      height="30"
      fill="none"
      stroke={selected ? 'var(--value-5)' : 'var(--value-10)'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline
        points="15 15 15 30"
        strokeWidth={`var(--link-${dataBits}-bit-width)`}
        strokeLinecap="butt"
      />
      <polyline
        points="7 15 15 0 23 15 7 15"
        fill="var(--value-2)"
        fillOpacity={
          selected
            ? 'var(--unselected-opacity)'
            : 'var(--selected-opacity)'
        }
      />
    </svg>
  );
};

const PowerWidget = props => {
  const { model } = props;
  const {
    options: { selected },
  } = model;

  return (
    <Wrapper>
      <Shape selected={selected} dataBits={model.dataBits} />
      <PositionedPort name="out" />
    </Wrapper>
  );
};

export default PowerWidget;
