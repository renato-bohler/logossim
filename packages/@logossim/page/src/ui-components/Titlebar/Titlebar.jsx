import React, { useState, useRef, useEffect } from 'react';

import styled from 'styled-components';

import { Edit, Chevrons } from '../Icons';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: white;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0px -10px 20px 0px black;
  padding: 12px;

  transform: ${({ isHidden }) =>
    isHidden ? 'translateY(-100%)' : 'none'};
  transition: 0.5s ease-in-out;
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  border: 1px solid
    ${({ isFocused }) => (isFocused ? '#e5e5e5' : 'transparent')};
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    border: 1px solid #e5e5e5;
  }
`;

const NameInput = styled.input`
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  font-size: 20px;
`;

const IconButton = styled.button`
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
`;

const ButtonsContainer = styled.div`
  display: flex;
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

const FileInput = styled.input`
  display: none;
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
  top: 80px;
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

const HideButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 80px;
  right: 20px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  box-shadow: 0px 0px 12px 0px #6b6b6b;

  svg {
    transform: ${({ isHidden }) =>
      isHidden ? 'rotate(180deg)' : 'none'};
    transition: 0.5s ease-in-out;
  }
`;

const Titlebar = ({
  circuitName,
  isCircuitNameFocused,
  handleChangeCircuitName,
  handleFocusCircuitName,
  handleBlurCircuitName,
  handleClickSelectCircuit,
  handleClickSave,
  handleFileLoad,
  handleClickKeyboardShortcuts,
  handleClickRedoTour,
  handleClickAbout,
  disabled,
}) => {
  const helpButtonRef = useRef();
  const helpMenuRef = useRef();
  const nameInputRef = useRef();
  const fileInputRef = useRef();
  const [isHelpMenuOpen, setHelpMenuOpen] = useState(false);
  const [isHidden, setHidden] = useState(false);

  const handleHideClick = () => setHidden(hidden => !hidden);
  const handleNameConfirm = event => {
    if (!nameInputRef.current) return;

    const { key } = event;
    if (key === 'Enter' || key === 'Escape')
      nameInputRef.current.blur();
  };
  const handleNameEditClick = () => {
    if (!nameInputRef.current) return;
    nameInputRef.current.focus();
  };
  const handleToggleHelpMenu = () => setHelpMenuOpen(!isHelpMenuOpen);
  const handleClickLoad = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };
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
    <Container isHidden={isHidden}>
      <NameContainer
        isFocused={isCircuitNameFocused}
        data-for="tooltip"
        data-tip="Rename your circuit..."
        data-place="right"
      >
        <NameInput
          ref={nameInputRef}
          value={circuitName}
          onChange={handleChangeCircuitName}
          onFocus={handleFocusCircuitName}
          onBlur={handleBlurCircuitName}
          onKeyDown={handleNameConfirm}
          maxLength={50}
        />
        <IconButton onClick={handleNameEditClick}>
          <Edit />
        </IconButton>
      </NameContainer>

      <ButtonsContainer>
        <HelpButton
          id="help-button"
          ref={helpButtonRef}
          onClick={handleToggleHelpMenu}
          data-for="tooltip"
          data-tip="Get help..."
          data-place="left"
        >
          <span>?</span>
        </HelpButton>
        {isHelpMenuOpen && (
          <HelpButtonMenu ref={helpMenuRef}>
            <HelpButtonMenuItem
              onClick={() => {
                handleClickSelectCircuit();
                handleToggleHelpMenu();
              }}
            >
              Select circuit
            </HelpButtonMenuItem>
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
                setHidden(false);
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
            data-for="tooltip"
            data-tip="Save circuit to file"
            data-place="left"
          >
            Save
          </Button>
          <Button
            color="orange"
            disabled={disabled}
            onClick={handleClickLoad}
            data-for="tooltip"
            data-tip="Load circuit from file..."
            data-place="left"
          >
            Load
          </Button>
          <FileInput
            id="file-input"
            ref={fileInputRef}
            type="file"
            accept=".lgsim"
            onChange={handleFileLoad}
          />
        </div>
      </ButtonsContainer>

      <HideButton
        isHidden={isHidden}
        onClick={handleHideClick}
        data-for="tooltip"
        data-tip={isHidden ? 'Show titlebar' : 'Hide titlebar'}
        data-place="left"
      >
        <Chevrons />
      </HideButton>
    </Container>
  );
};

export default Titlebar;
