import React from 'react';

import { Port } from '@logossim/core';

import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;

  width: 180px;
  height: 150px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: ${props =>
    props.selected
      ? 'var(--body-selected)'
      : 'var(--body-unselected)'};
  border: 1px solid
    ${props =>
      props.selected
        ? 'var(--border-selected)'
        : 'var(--border-unselected)'};

  transition: 100ms linear;
`;

const Memory = styled.div`
  display: flex;
  flex-direction: column;

  overflow: hidden;
  background: white;
  border: 2px solid #c9c9c9;

  width: 80%;
  height: 112px;
  font-size: 10px;
`;

const Cell = styled.div`
  display: flex;
  border-bottom: 1px solid #c9c9c9;
  padding: 0 4px;
`;

const ActiveAddress = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 8px;
  border-color: ${({ isSelected }) =>
    `transparent transparent transparent ${
      isSelected ? '#f44336' : 'transparent'
    }`};
  margin: auto 4px auto -4px;
`;

const AddressValueContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

const Address = styled.span`
  margin-right: 4px;
  padding: 1px 4px;
  height: fit-content;

  font-family: monospace;
  font-size: 8px;
  color: white;

  background: #2642a0;
  border-radius: 2px;
`;

const Value = styled.span`
  padding: 4px;
`;

const PositionedPort = styled(Port)`
  position: absolute;

  ${props => {
    if (props.name === 'clock') return 'bottom: -5px';
    if (props.name === 'load')
      return 'bottom: -5px; right: calc(50% - 20px)';
    if (props.name === 'clear')
      return 'bottom: -5px; right: calc(50% - 35px)';
    if (props.name === 'select')
      return 'bottom: -5px; right: calc(50% - 50px)';
    if (props.name === 'address') return 'left: -5px';
    if (props.name === 'data') return 'right: -5px';
    return '';
  }}
`;

const getMemoryDisplayRange = (memory, address) => {
  if (address <= 1) return [0, 5];
  if (address >= memory.length - 2)
    return [memory.length - 5, memory.length];
  return [address - 2, address + 3];
};

const RamWidget = props => {
  const { model } = props;
  const memory = model.getMemory();
  const selectedAddress = model.getAddress();
  const range = getMemoryDisplayRange(memory, selectedAddress);

  return (
    <Wrapper selected={model.isSelected()}>
      <PositionedPort name="clock" />
      <PositionedPort name="load" />
      <PositionedPort name="address" />
      <PositionedPort name="data" />
      <PositionedPort name="clear" />
      <PositionedPort name="select" />

      <Memory>
        {memory.slice(...range).map((value, index) => {
          const address = index + range[0];
          const formattedAddress = `0x${address
            .toString(16)
            .padStart(2, '0')}`;

          return (
            <Cell key={formattedAddress}>
              <ActiveAddress
                isSelected={address === selectedAddress}
              />
              <AddressValueContainer>
                <Address>{formattedAddress}</Address>
                <Value isSelected>{value}</Value>
              </AddressValueContainer>
            </Cell>
          );
        })}
      </Memory>
    </Wrapper>
  );
};

export default RamWidget;
