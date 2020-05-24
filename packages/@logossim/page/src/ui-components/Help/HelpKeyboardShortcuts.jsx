import React, { useEffect, useCallback } from 'react';

import styled from 'styled-components';

import { Close } from '../Icons';
import Key from '../Key/Key';
import Modal from '../Modal/Modal';
import {
  Header,
  Title,
  Subtitle,
  Content,
  IconButton,
} from '../Modal/ModalContentLayout';

const closeOnEsc = ({ code }, handleClose) => {
  if (code !== 'Escape') return;
  handleClose();
};

const TableContainer = styled.div`
  display: flex;
`;

const Table = styled.table`
  flex: 1;
  margin: 8px 0;
`;

const TableColumn = styled.td`
  padding: 8px;

  border: 1px solid #5d2eb526;
  border-radius: 8px;
`;

const HelpKeyboardShortcuts = ({ isOpen, handleClose }) => {
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
        <Title>Keyboard shortcuts</Title>
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
          paddingTop: 16,
          marginTop: 16,
          overflowY: 'auto',
          height: 'calc(100% - 70px)',
        }}
      >
        <span>
          <strong>Note:</strong> some of the actions may have two
          shortcuts.
        </span>

        <Subtitle style={{ marginTop: 32 }}>
          Circuit management
        </Subtitle>
        <TableContainer>
          <Table>
            <tbody>
              <tr>
                <TableColumn>Save</TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>S</Key>
                </TableColumn>
                <TableColumn />
              </tr>
              <tr>
                <TableColumn>Load</TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>L</Key>
                </TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>SHIFT</Key>
                  <Key size={32}>S</Key>
                </TableColumn>
              </tr>
              <tr>
                <TableColumn>Undo</TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>Z</Key>
                </TableColumn>
                <TableColumn />
              </tr>
              <tr>
                <TableColumn>Redo</TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>SHIFT</Key>
                  <Key size={32}>Z</Key>
                </TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>Y</Key>
                </TableColumn>
              </tr>
            </tbody>
          </Table>
        </TableContainer>

        <Subtitle style={{ marginTop: 32 }}>
          Component management
        </Subtitle>
        <TableContainer>
          <Table>
            <tbody>
              <tr>
                <TableColumn>Edit configurations</TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>E</Key>
                </TableColumn>
              </tr>
              <tr>
                <TableColumn>Duplicate</TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>D</Key>
                </TableColumn>
              </tr>
              <tr>
                <TableColumn>Delete</TableColumn>
                <TableColumn>
                  <Key size={32}>Delete</Key>
                </TableColumn>
              </tr>
              <tr>
                <TableColumn>Copy</TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>C</Key>
                </TableColumn>
              </tr>
              <tr>
                <TableColumn>Paste</TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>V</Key>
                </TableColumn>
              </tr>
              <tr>
                <TableColumn>Cut</TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>X</Key>
                </TableColumn>
              </tr>
            </tbody>
          </Table>
        </TableContainer>

        <Subtitle style={{ marginTop: 32 }}>
          Simulation control
        </Subtitle>
        <TableContainer>
          <Table>
            <tbody>
              <tr>
                <TableColumn>Play</TableColumn>
                <TableColumn>
                  <Key size={32}>SPACE</Key>
                </TableColumn>
                <TableColumn />
              </tr>
              <tr>
                <TableColumn>Pause</TableColumn>
                <TableColumn>
                  <Key size={32}>SPACE</Key>
                </TableColumn>
                <TableColumn />
              </tr>
              <tr>
                <TableColumn>Stop</TableColumn>
                <TableColumn>
                  <Key size={32}>CTRL</Key>
                  <Key size={32}>SPACE</Key>
                </TableColumn>
                <TableColumn>
                  <Key size={32}>ESC</Key>
                </TableColumn>
              </tr>
            </tbody>
          </Table>
        </TableContainer>
      </Content>
    </Modal>
  );
};

export default HelpKeyboardShortcuts;
