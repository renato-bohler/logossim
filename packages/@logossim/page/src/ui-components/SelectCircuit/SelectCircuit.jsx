import React, { useEffect, useCallback } from 'react';

import styled from 'styled-components';

import { Close } from '../Icons';
import NewFile from '../Icons/NewFile';
import RecentFile from '../Icons/RecentFile';
import UploadFile from '../Icons/UploadFile';
import Modal from '../Modal/Modal';
import {
  Header,
  Title,
  IconButton,
} from '../Modal/ModalContentLayout';
import SelectCircuitButton from './SelectCircuitButton';

const Content = styled.div`
  padding: 64px;
  margin-top: 32px;
`;

const Divider = styled.div`
  position: relative;
  margin: 32px 0;
  border: none;
  border-top: 1px solid grey;
`;

const DividerTitle = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 0 8px;
  white-space: nowrap;

  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
`;

const ExampleImage = styled.img`
  width: 100%;
  height: 100%;
`;

const closeOnEsc = ({ code }, handleClose) => {
  if (code !== 'Escape') return;
  handleClose();
};

const SelectCircuit = ({
  isOpen,
  handleClose,
  handleNewCircuit,
  handleClickLoad,
  handleLoadExample,
  hasAutoSavedCircuit,
  handleLoadAutoSavedCircuit,
  shouldWarnUnload,
}) => {
  const callback = useCallback(
    event => closeOnEsc(event, handleClose),
    [handleClose],
  );

  const confirm = cb => () => {
    if (shouldWarnUnload()) {
      // eslint-disable-next-line no-alert
      const response = window.confirm(
        'You have unsaved changes. Opening a new circuit will override your current work. Do you want to proceed?',
      );
      if (!response) return;
    }
    cb();
  };

  useEffect(() => {
    window.addEventListener('keydown', callback);
    return () => window.removeEventListener('keydown', callback);
  }, [callback]);

  if (!isOpen) return null;

  return (
    <Modal maxWidth="800px" height="auto">
      <Header>
        <Title>
          <img
            src={`${process.env.PUBLIC_URL}/logo192.png`}
            alt="logossim's logo"
            style={{
              alignSelf: 'center',
            }}
          />
          <br />
          Welcome to logossim
        </Title>
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
        <Divider>
          <DividerTitle>Create your own circuit</DividerTitle>
        </Divider>
        <Grid>
          <SelectCircuitButton
            image={<NewFile size={40} color="#444" />}
            onClick={confirm(() => {
              handleNewCircuit();
              handleClose();
            })}
          >
            New circuit
          </SelectCircuitButton>
          <SelectCircuitButton
            image={<UploadFile size={40} color="#444" />}
            onClick={confirm(() => {
              handleClickLoad();
              handleClose();
            })}
          >
            Load circuit from disk
          </SelectCircuitButton>
          {hasAutoSavedCircuit && (
            <SelectCircuitButton
              image={<RecentFile size={40} color="#444" />}
              onClick={confirm(() => {
                handleLoadAutoSavedCircuit();
                handleClose();
              })}
            >
              Open last unsaved circuit
            </SelectCircuitButton>
          )}
        </Grid>
        <Divider>
          <DividerTitle>
            Or try one of the examples below
          </DividerTitle>
        </Divider>
        <Grid>
          {[
            'Darth Vader',
            '2 bit adder',
            'Synchronous RS latch',
            'Binary to SSD decoder',
          ].map(example => (
            <SelectCircuitButton
              key={example}
              image={
                <ExampleImage
                  src={`${process.env.PUBLIC_URL}/examples/${example}.png`}
                />
              }
              onClick={confirm(() => {
                handleLoadExample(example);
                handleClose();
              })}
            >
              {example}
            </SelectCircuitButton>
          ))}
        </Grid>
      </Content>
    </Modal>
  );
};

export default SelectCircuit;
