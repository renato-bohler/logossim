import React, { useState } from 'react';
import styled from 'styled-components';

import Chevron from '../Icons/Chevron';

const ComponentGroup = ({
  name,
  components,
  handleComponentSelect,
}) => {
  const [isOpen, setOpen] = useState(true);

  const GroupContainer = styled.div`
    margin-bottom: 32px;
  `;

  const GroupHeader = styled.div`
    display: flex;
    justify-content: space-between;
  `;

  const GroupTitle = styled.div`
    font-weight: bold;
    font-size: 1.3em;
  `;

  const GroupSeparator = styled.hr`
    flex-grow: 1;
    align-self: center;

    margin: 16px;
    border-top: 1px solid black;
  `;

  const GroupChevron = styled.button`
    background: none;
    border: none;
    width: 50px;

    transform: ${props => (props.isOpen ? 'rotate(180deg)' : 'none')};
  `;

  const ComponentsGrid = styled.div`
    display: ${props => (props.isOpen ? 'grid' : 'none')};
    grid-template-columns: 1fr 1fr;
    grid-gap: 8px;
  `;

  const ComponentButton = styled.button`
    display: flex;
    align-items: center;

    padding: 8px;

    background: rgba(0, 0, 0, 0.05);
    border: 1px solid gray;
    border-radius: 5px;

    :hover {
      background: rgba(0, 0, 0, 0.1);
      border-style: dashed;
    }
  `;

  const ComponentTitle = styled.h2`
    font-weight: normal;
    font-size: 1.2em;
  `;

  const ComponentIcon = styled.div`
    margin-right: 16px;
  `;

  return (
    <GroupContainer>
      <GroupHeader onClick={() => setOpen(!isOpen)}>
        <GroupTitle>{name}</GroupTitle>
        <GroupSeparator />
        <GroupChevron
          isOpen={isOpen}
          onClick={() => setOpen(!isOpen)}
        >
          <Chevron />
        </GroupChevron>
      </GroupHeader>
      <ComponentsGrid isOpen={isOpen}>
        {components.map(component => (
          <ComponentButton
            onClick={() => handleComponentSelect(component)}
            key={component.name}
          >
            <ComponentIcon>
              <component.Icon />
            </ComponentIcon>
            <ComponentTitle>{component.name}</ComponentTitle>
          </ComponentButton>
        ))}
      </ComponentsGrid>
    </GroupContainer>
  );
};

export default ComponentGroup;
