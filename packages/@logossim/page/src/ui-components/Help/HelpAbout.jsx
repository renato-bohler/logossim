import React, { useEffect, useCallback } from 'react';
import GitHubButton from 'react-github-button';

import styled from 'styled-components';

import { version } from '../../../package.json';
import { Close } from '../Icons';
import Modal from '../Modal/Modal';
import {
  Header,
  Title,
  Content,
  IconButton,
} from '../Modal/ModalContentLayout';

const Version = styled.span`
  font-weight: bold;
  font-size: 1.1em;
  margin-top: -32px;
`;

const Divider = styled.hr`
  width: 80%;
  margin: 24px;
  border-color: white;
`;

const closeOnEsc = ({ code }, handleClose) => {
  if (code !== 'Escape') return;
  handleClose();
};

const HelpAbout = ({ isOpen, handleClose }) => {
  const callback = useCallback(
    event => closeOnEsc(event, handleClose),
    [handleClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', callback);
    return () => window.removeEventListener('keydown', callback);
  }, [callback]);

  if (!isOpen) return null;

  return (
    <Modal>
      <Header>
        <Title>About</Title>
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

      <Content
        style={{
          paddingTop: 0,
          marginTop: 16,
          overflowY: 'auto',
          height: 'calc(100% - 70px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/social.png`}
            alt="logossim's logo"
            style={{ width: '75%' }}
          />
          <Version>Version {version}</Version>
        </div>

        <Divider />

        <div style={{ margin: '0 32px' }}>
          <p style={{ textAlign: 'center' }}>
            If you want to know more about the project,{' '}
            <a
              href="https://github.com/renato-bohler/logossim"
              target="_blank"
              rel="noopener noreferrer"
            >
              check us out on GitHub!
            </a>
          </p>
          <GitHubButton
            type="stargazers"
            namespace="renato-bohler"
            repo="logossim"
          />
          <p style={{ textAlign: 'center' }}>
            <strong>You can help us</strong> make logossim better! If
            you know a little bit of web development, you can quite
            easily develop new components to the application.
          </p>
        </div>

        <Divider />

        <div style={{ margin: '0 32px' }}>
          <p style={{ textAlign: 'center' }}>
            This is a project built by{' '}
            <a
              href="https://bohler.dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Renato Böhler
            </a>{' '}
            as an undegraduate thesis on Computer Engineering at{' '}
            <a
              href="http://www.utfpr.edu.br/"
              target="_blank"
              rel="noopener noreferrer"
            >
              UTFPR
            </a>
            .
          </p>
        </div>
      </Content>
    </Modal>
  );
};

export default HelpAbout;
