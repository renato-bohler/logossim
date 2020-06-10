import React, { useEffect, useRef } from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

export const Shape = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 30px;
  height: 30px;

  background: ${props =>
    props.selected
      ? 'var(--body-selected)'
      : 'var(--body-unselected)'};
  border: 2px solid
    ${props =>
      props.selected
        ? 'var(--border-selected)'
        : 'var(--border-unselected)'};

  transition: 100ms linear;
`;

export const Button = styled.button`
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
  right: -7px;
`;

const ButtonWidget = props => {
  const { model, engine } = props;
  const {
    options: { selected },
  } = model;

  const buttonRef = useRef();

  const handleReleaseAway = event => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      model.onRelease();
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleReleaseAway);
    return () =>
      document.removeEventListener('mouseup', handleReleaseAway);
  });

  return (
    <Shape selected={selected}>
      <PositionedPort
        name="out"
        model={model}
        port={model.getPort('out')}
        engine={engine}
      />
      <Button
        ref={buttonRef}
        onMouseDown={() => model.onClick()}
        onMouseUp={() => model.onRelease()}
      />
    </Shape>
  );
};

export default ButtonWidget;
