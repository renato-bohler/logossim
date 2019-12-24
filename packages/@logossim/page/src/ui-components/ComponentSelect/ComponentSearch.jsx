import React, { useState } from 'react';
import styled from 'styled-components';

import { Header, Content } from './ComponentLayout';
import ComponentGroup from './ComponentGroup';
import IconButton from '../Buttons/IconButton';
import Close from '../Icons/Close';

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
          <ComponentGroup
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

export default ComponentSearch;
