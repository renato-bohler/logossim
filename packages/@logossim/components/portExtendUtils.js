import React from 'react';

import styled from 'styled-components';

const MAX_PORTS = 5;

/**
 * Given a number of ports, returns an array with the port positions
 * symmetrically distributed.
 */
export const distributePorts = numPorts => {
  if (numPorts === 2) return [1, 5];
  if (numPorts === 3) return [1, 3, 5];
  if (numPorts === 4) return [1, 2, 4, 5];

  const isNumberOfPortsEven = numPorts % 2 === 0;
  const closestEven = numPorts - (isNumberOfPortsEven ? 0 : 1);

  let startAt = 0;
  let length = MAX_PORTS;
  if (numPorts > MAX_PORTS) {
    startAt = Math.floor((MAX_PORTS - closestEven) / 2);
    length = closestEven + 1;
  }

  const result = [...Array(length).keys()].map(i => i + startAt + 1);
  if (isNumberOfPortsEven) {
    result.splice(numPorts / 2, 1);
  }
  return result;
};

const PortExtensionBar = styled.div`
  position: absolute;
  left: ${props => props.offsetX}px;
  height: ${props => props.size}px;
  width: 2px;
  background: ${props =>
    props.selected
      ? 'var(--border-selected)'
      : 'var(--border-unselected)'};

  ${props => `${props.place}: 88px;`}
`;

export const PortExtension = ({
  selected,
  portPositions,
  offsetX = 1,
}) => {
  const lastPortPosition = portPositions[portPositions.length - 1];
  if (lastPortPosition <= MAX_PORTS) return null;

  const size = (lastPortPosition - MAX_PORTS) * 15;

  return (
    <>
      <PortExtensionBar
        selected={selected}
        size={size}
        place="top"
        offsetX={offsetX}
      />
      <PortExtensionBar
        selected={selected}
        size={size}
        place="bottom"
        offsetX={offsetX}
      />
    </>
  );
};
