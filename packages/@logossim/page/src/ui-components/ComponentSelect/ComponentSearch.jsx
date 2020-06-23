import React, { useState, useEffect } from 'react';
import Tooltip from 'react-tooltip';

import styled from 'styled-components';

import { Close } from '../Icons';
import {
  Header,
  Content,
  IconButton,
} from '../Modal/ModalContentLayout';
import ComponentGroup from './ComponentGroup';

const SearchBar = styled.input`
  flex-grow: 1;

  padding: 10px;
  margin-right: 60px;
  font-size: 1.5em;

  border-radius: 25px;
  border: 1px solid gray;

  ::placeholder {
    font-weight: 300;
    color: #cfcfcf;
  }
`;

const Scroll = styled.div`
  padding-right: 16px;
  max-height: calc(min(800px, 80vh) - 130px);
  overflow-y: auto;
`;

const ComponentSearch = ({
  groups,
  handleComponentSelect,
  handleClose,
}) => {
  useEffect(Tooltip.rebuild);

  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = value => {
    setSearchText(value);

    if (!value) {
      setFilteredGroups(groups);
      return;
    }

    const like = new RegExp(`${value}.*`, 'i');

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
  };

  const handleKeyDown = key => {
    if (key === 'Escape') {
      setSearchText('');
      setFilteredGroups(groups);
    }

    if (
      key === 'Enter' &&
      searchText &&
      filteredGroups.length > 0 &&
      filteredGroups[0].components.length > 0
    ) {
      handleComponentSelect(filteredGroups[0].components[0]);
    }
  };

  return (
    <>
      <Header>
        <SearchBar
          autoFocus
          placeholder="Search components..."
          value={searchText}
          onChange={({ target: { value } }) =>
            handleSearchChange(value)
          }
          onKeyDown={({ key }) => handleKeyDown(key)}
        />
        <IconButton
          right
          onClick={handleClose}
          data-for="tooltip"
          data-tip="Close"
          data-place="left"
        >
          <Close />
        </IconButton>
      </Header>

      <Content>
        <Scroll>
          {filteredGroups.map(({ name, components }) => (
            <ComponentGroup
              name={name}
              components={components}
              handleComponentSelect={handleComponentSelect}
              key={name}
            />
          ))}
        </Scroll>
      </Content>
    </>
  );
};

export default ComponentSearch;
