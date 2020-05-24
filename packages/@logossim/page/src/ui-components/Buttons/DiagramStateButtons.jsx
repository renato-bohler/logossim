import React, { useState, useRef, useEffect } from 'react';

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
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  border: 1px solid #6441a5;

  width: 34px;
  height: 34px;

  margin: 5px;

  color: #6441a5;
  font-weight: bold;
  font-size: 1.3em;

  &:focus,
  &:hover {
    background: #6441a5;
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: rgba(255, 255, 255, 0.6);
  }
`;

const HelpButtonMenu = styled.div`
  position: absolute;
  top: 50px;
  transform: translateX(calc(17px + -50%));

  display: flex;
  flex-direction: column;

  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #6441a5;
  border-radius: 10px;
  padding: 3px;

  z-index: 3;
`;

const HelpButtonMenuItem = styled.button`
  font-size: 14px;
  color: #222;
  padding: 16px;
  border: 0;
  background: transparent;
  border-bottom: ${props =>
    props.last ? 'none' : '1px solid #6441a5'};

  &:focus,
  &:hover {
    color: #6441a5;
  }
`;

const DiagramStateButtons = ({
  handleClickSave,
  handleClickLoad,
  handleClickKeyboardShortcuts,
  handleClickRedoTour,
  handleClickAbout,
  disabled,
}) => {
  const helpButtonRef = useRef();
  const helpMenuRef = useRef();
  const [isHelpMenuOpen, setHelpMenuOpen] = useState(false);

  const handleToggleHelpMenu = () => setHelpMenuOpen(!isHelpMenuOpen);
  const handleClickAway = event => {
    if (
      helpMenuRef.current &&
      !helpMenuRef.current.contains(event.target) &&
      helpButtonRef.current &&
      !helpButtonRef.current.contains(event.target)
    ) {
      handleToggleHelpMenu();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickAway);
    return () =>
      document.removeEventListener('mousedown', handleClickAway);
  });

  return (
    <Container>
      <HelpButton
        id="help-button"
        ref={helpButtonRef}
        onClick={handleToggleHelpMenu}
      >
        <span>?</span>
      </HelpButton>
      {isHelpMenuOpen && (
        <HelpButtonMenu ref={helpMenuRef}>
          <HelpButtonMenuItem
            onClick={() => {
              handleClickKeyboardShortcuts();
              handleToggleHelpMenu();
            }}
          >
            Keyboard shortcuts
          </HelpButtonMenuItem>
          <HelpButtonMenuItem
            onClick={() => {
              handleClickRedoTour();
              handleToggleHelpMenu();
            }}
          >
            Redo the tour
          </HelpButtonMenuItem>
          <HelpButtonMenuItem
            onClick={() => {
              handleClickAbout();
              handleToggleHelpMenu();
            }}
            last
          >
            About
          </HelpButtonMenuItem>
        </HelpButtonMenu>
      )}

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
};

export default DiagramStateButtons;
