import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const PositionedPort = styled(Port)`
  position: absolute;
  left: 50%;
  top: -5px;
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
      stroke={selected ? 'var(--value-5)' : 'var(--value-0)'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline
        points="15 0 15 15"
        strokeWidth={`var(--link-${dataBits}-bit-width)`}
        strokeLinecap="butt"
      />
      <polyline points="7 15 23 15" />
      <polyline points="7 15 2 25" />
      <polyline points="15 15 9 25" />
      <polyline points="23 15 17 25" />
    </svg>
  );
};

const GroundWidget = props => {
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

export default GroundWidget;
