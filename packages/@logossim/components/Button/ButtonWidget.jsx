import React from 'react';
import styled from 'styled-components';
import { Port } from '@logossim/core';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 30px;
  height: 30px;

  transition: 100ms linear;
  svg {
    fill: ${props =>
      props.selected
        ? 'var(--body-selected)'
        : 'var(--body-unselected)'};
    stroke: ${props =>
      props.selected
        ? 'var(--border-selected)'
        : 'var(--border-unselected)'};
  }
`;

const Button = styled.button`
  position: absolute;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  outline: none;

  border: 2px solid rgba(0, 0, 0, 0.3);
  background: linear-gradient(
    225deg,
    rgba(238, 0, 0, 1) 0%,
    rgba(125, 20, 20, 1) 100%
  );

  :active {
    border: 2px solid rgba(255, 255, 255, 0.5);
    background: linear-gradient(
      225deg,
      rgba(125, 20, 20, 1) 0%,
      rgba(238, 0, 0, 1) 100%
    );
  }
`;

const PositionedPort = styled(Port)`
  position: absolute;
  right: -5px;
`;

export const Shape = ({ size = 30 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 7.9374997 7.9375003"
    fill="var(--body-unselected)"
    stroke="var(--border-unselected)"
    strokeWidth="1"
  >
    <g>
      <rect
        y="0.26458332"
        x="0.26458332"
        height="7.4083333"
        width="7.4083333"
      />
    </g>
  </svg>
);

const ButtonWidget = props => {
  const { model, node, engine } = props;
  const {
    options: { selected },
  } = node;

  return (
    <Wrapper selected={selected}>
      <PositionedPort
        name="out"
        node={node}
        port={node.getPort('out')}
        engine={engine}
      />
      <Shape />
      <Button
        onMouseDown={() => model.onClick()}
        onMouseUp={() => model.onRelease()}
      />
    </Wrapper>
  );
};

export default ButtonWidget;
