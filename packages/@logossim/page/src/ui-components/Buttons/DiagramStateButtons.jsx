import React from 'react';

import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  z-index: 2;

  display: flex;
  align-items: center;
`;

const Button = styled.button.attrs(({ ...props }) => ({
  ...props,
  type: 'button',
}))`
  border: none;
  border-radius: 5px;
  background: ${props => {
    switch (props.color) {
      case 'green':
        return '#07d26b';
      case 'orange':
        return 'orange';
      default:
        return 'gray';
    }
  }};

  color: white;
  font-size: 1.2em;

  min-width: 110px;
  padding: 5px 20px;
  margin: 5px;

  transition: 0.5s ease-in-out;

  &:disabled {
    opacity: 10%;
    cursor: not-allowed;
    background: gray;
  }
`;

const HelpButton = styled.button.attrs(({ ...props }) => ({
  ...props,
  type: 'button',
}))`
  background: transparent;
  border-radius: 50%;
  border: 1px solid #6441a5;

  width: 34px;
  height: 34px;

  margin: 5px;

  color: #6441a5;
  font-weight: bold;
  font-size: 1.3em;
`;

const DiagramStateButtons = ({
  handleClickSave,
  handleClickLoad,
  disabled,
}) => (
  <Container>
    <HelpButton id="help-button">?</HelpButton>
    <div id="save-load-buttons">
      <Button
        color="green"
        onClick={handleClickSave}
        disabled={disabled}
      >
        Save
      </Button>
      <Button
        color="orange"
        onClick={handleClickLoad}
        disabled={disabled}
      >
        Load
      </Button>
    </div>
  </Container>
);

export default DiagramStateButtons;
