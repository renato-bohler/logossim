import React from 'react';
import styled from 'styled-components';

import { Header, Content, IconButton } from './ComponentLayout';
import Back from '../Icons/Back';
import Close from '../Icons/Close';

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

export default ComponentConfiguration;
