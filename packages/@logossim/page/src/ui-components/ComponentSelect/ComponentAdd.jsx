import React, { useState } from 'react';
import styled from 'styled-components';

import Back from '../Icons/Back';
import Close from '../Icons/Close';
import Chevron from '../Icons/Chevron';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  z-index: 3;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  background: rgba(0, 0, 0, 0.75);
`;

const Modal = styled.div`
  width: 60vw;
  height: 80vh;

  max-width: 600px;
  max-height: 800px;

  background: white;
  box-shadow: inset 0 0 20% gray;

  border: 1px solid black;
  border-radius: 25px;

  padding: 16px;

  z-index: 4;
`;

const SearchBar = styled.input`
  flex-grow: 1;

  padding: 10px;
  font-size: 1.5em;

  border-radius: 25px;
  border: 1px solid gray;

  ::placeholder {
    font-weight: 300;
    color: #cfcfcf;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: space-between;
`;

const Content = styled.div`
  padding-top: 32px;
`;

const IconButton = styled.button`
  flex-shrink: 0;

  border: 1px solid gray;
  border-radius: 25px;
  width: 50px;
  height: 50px;

  background: none;
  margin-right: ${props => (props.first ? '12px' : '0')};
  margin-left: ${props => (props.last ? '12px' : '0')};

  :hover {
    background: rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }
`;

const Group = ({ name, components, setSelectedComponent }) => {
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
            onClick={() => setSelectedComponent(component)}
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

const ComponentSearch = ({
  groups,
  setSelectedComponent,
  handleClose,
}) => {
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [searchText, setSearchText] = useState('');

  return (
    <>
      <Header>
        <SearchBar
          placeholder="Search components..."
          value={searchText}
          onChange={({ target: { value = '' } }) => {
            setSearchText(value);

            if (!value) {
              setFilteredGroups(groups);
              return;
            }

            const like = new RegExp(`${searchText}.*`, 'i');

            const newFilteredGroups = groups
              .map(group => {
                const hasAnyMatchingComponent = group.components.some(
                  component => component.name.match(like),
                );

                if (hasAnyMatchingComponent)
                  return {
                    ...group,
                    components: group.components.filter(component =>
                      component.name.match(like),
                    ),
                  };
                return null;
              })
              .filter(group => group != null);

            setFilteredGroups(newFilteredGroups);
          }}
        />
        <IconButton last onClick={handleClose}>
          <Close />
        </IconButton>
      </Header>

      <Content>
        {filteredGroups.map(({ name, components }) => (
          <Group
            name={name}
            components={components}
            setSelectedComponent={setSelectedComponent}
            key={name}
          />
        ))}
      </Content>
    </>
  );
};

const ComponentConfiguration = ({
  component,
  handleClose,
  handleBack,
}) => {
  const ComponentConfigurationTitle = styled.h1`
    flex-grow: 1;
    font-size: 1.5em;

    margin: 0;

    align-self: center;
    text-align: center;
  `;

  return (
    <>
      <Header>
        <IconButton first onClick={handleBack}>
          <Back />
        </IconButton>
        <ComponentConfigurationTitle>
          Add component
        </ComponentConfigurationTitle>
        <IconButton last onClick={handleClose}>
          <Close />
        </IconButton>
      </Header>
      <Content>This is the {component.name} content</Content>
    </>
  );
};

const ComponentAdd = ({ isOpen, handleClose, groups }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  if (!isOpen) return null;

  return (
    <Overlay>
      <Modal>
        {selectedComponent ? (
          <ComponentConfiguration
            handleClose={handleClose}
            handleBack={() => setSelectedComponent(null)}
            component={selectedComponent}
          />
        ) : (
          <ComponentSearch
            handleClose={handleClose}
            setSelectedComponent={setSelectedComponent}
            groups={groups}
          />
        )}
      </Modal>
    </Overlay>
  );
};

export default ComponentAdd;
