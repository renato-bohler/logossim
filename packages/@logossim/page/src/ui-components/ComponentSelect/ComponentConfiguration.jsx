import React from 'react';
import styled from 'styled-components';

import { Header, Content, IconButton } from './ComponentLayout';
import Back from '../Icons/Back';
import Close from '../Icons/Close';
import DraggableComponent from './DraggableComponent';

const DragArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 200px;
  margin-bottom: 32px;

  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 15px,
      rgba(0, 0, 0, 0.05) 15px,
      transparent 16px,
      transparent 30px,
      rgba(0, 0, 0, 0.05) 30px,
      transparent 31px
    ),
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 15px,
      rgba(0, 0, 0, 0.05) 15px,
      transparent 16px,
      transparent 30px,
      rgba(0, 0, 0, 0.05) 30px,
      transparent 31px
    );
  background-size: 45px 45px;
  border-radius: 25px;
`;

const Title = styled.h1`
  flex-grow: 1;
  font-size: 1.5em;

  margin: 0;

  align-self: center;
  text-align: center;
`;

const ComponentConfigurationInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;

  label {
    font-size: 0.8em;
    font-weight: bold;
    text-transform: uppercase;

    background: #eee;
    border: 1px solid gray;
    border-radius: 8px;

    position: relative;
    top: 0.8em;

    width: max-content;
    margin-left: 15px;
    padding: 0 8px;
  }

  select {
    background: white;
    border: 1px solid gray;
    border-radius: 25px;

    font-size: 1.2em;

    padding: 10px 0 5px 16px;
  }
`;

const ComponentConfigurationInput = ({
  name,
  type,
  label,
  options = [],
  componentType,
}) => {
  switch (type) {
    case 'select':
      return (
        <>
          <label htmlFor={name}>{label}</label>
          <select id={name}>
            {options.map(option => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      );
    default:
      throw new Error(
        `[Logossim] Invalid configuration type for ${componentType}: ${type}`,
      );
  }
};

const ComponentConfiguration = ({
  component,
  handleClose,
  handleBack,
}) => {
  return (
    <>
      <Header>
        <IconButton first onClick={handleBack}>
          <Back />
        </IconButton>
        <Title>Configure component</Title>
        <IconButton last onClick={handleClose}>
          <Close />
        </IconButton>
      </Header>

      <Content>
        <DragArea>
          <DraggableComponent
            component={component}
            handleClose={handleClose}
          />
        </DragArea>

        <form>
          {component.configurations.map(configuration => (
            <ComponentConfigurationInputContainer
              key={configuration.name}
            >
              <ComponentConfigurationInput
                componentType={component.type}
                {...configuration}
              />
            </ComponentConfigurationInputContainer>
          ))}
        </form>
      </Content>
    </>
  );
};

export default ComponentConfiguration;
