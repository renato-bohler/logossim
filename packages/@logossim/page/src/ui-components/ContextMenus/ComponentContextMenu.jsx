import React from 'react';
import { Menu, Item, Separator, Submenu } from 'react-contexify';

import {
  ArrowRight,
  Clone,
  Copy,
  Delete,
  Paste,
  Redo,
  RotateClockwise,
  RotateCounterclockwise,
  Settings,
  Undo,
} from '../Icons';
import ContextMenuIconContainer from './ContextMenuIconContainer';

const ComponentContextMenu = ({
  cloneSelected,
  deleteSelected,
  copySelected,
  pasteSelected,
}) => (
  <Menu id="component">
    <Item onClick={cloneSelected}>
      <ContextMenuIconContainer>
        <Clone size={16} />
      </ContextMenuIconContainer>
      Clone
    </Item>
    <Item onClick={copySelected}>
      <ContextMenuIconContainer>
        <Copy size={16} />
      </ContextMenuIconContainer>
      Copy
    </Item>
    <Item onClick={pasteSelected}>
      <ContextMenuIconContainer>
        <Paste size={16} />
      </ContextMenuIconContainer>
      Paste
    </Item>
    <Item onClick={deleteSelected}>
      <ContextMenuIconContainer>
        <Delete size={16} />
      </ContextMenuIconContainer>
      Delete
    </Item>
    <Separator />
    <Item onClick={() => window.alert('TODO: undo feature')}>
      <ContextMenuIconContainer>
        <Undo size={16} />
      </ContextMenuIconContainer>
      Undo
    </Item>
    <Item onClick={() => window.alert('TODO: redo feature')}>
      <ContextMenuIconContainer>
        <Redo size={16} />
      </ContextMenuIconContainer>
      Redo
    </Item>
    <Separator />
    <Submenu
      label={
        <div style={{ display: 'flex' }}>
          <ContextMenuIconContainer />
          Rotate
        </div>
      }
      arrow={<ArrowRight size={10} />}
    >
      <Item
        onClick={() => window.alert('TODO: rotate clockwise feature')}
      >
        <ContextMenuIconContainer>
          <RotateClockwise size={16} />
        </ContextMenuIconContainer>
        Clockwise
      </Item>
      <Item
        onClick={() =>
          window.alert('TODO: rotate counterclockwise feature')
        }
      >
        <ContextMenuIconContainer>
          <RotateCounterclockwise size={16} />
        </ContextMenuIconContainer>
        Counterclockwise
      </Item>
    </Submenu>
    <Item
      onClick={() => window.alert('TODO: configurations feature')}
    >
      <ContextMenuIconContainer>
        <Settings size={16} />
      </ContextMenuIconContainer>
      Configurations...
    </Item>
  </Menu>
);

export default ComponentContextMenu;
