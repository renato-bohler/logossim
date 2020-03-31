import React from 'react';

import { Menu, Item, Separator, Submenu } from 'react-contexify';

import {
  ArrowRight,
  Clone,
  Copy,
  Paste,
  Redo,
  RotateClockwise,
  RotateCounterclockwise,
  Settings,
  Undo,
} from '../Icons';
import ContextMenuIconContainer from './ContextMenuIconContainer';

const ComponentContextMenu = () => (
  <Menu id="component">
    <Item onClick={console.log}>
      <ContextMenuIconContainer>
        <Clone size={16} />
      </ContextMenuIconContainer>
      Clone
    </Item>
    <Item onClick={console.log}>
      <ContextMenuIconContainer>
        <Copy size={16} />
      </ContextMenuIconContainer>
      Copy
    </Item>
    <Item onClick={console.log}>
      <ContextMenuIconContainer>
        <Paste size={16} />
      </ContextMenuIconContainer>
      Paste
    </Item>
    <Separator />
    <Item onClick={console.log}>
      <ContextMenuIconContainer>
        <Undo size={16} />
      </ContextMenuIconContainer>
      Undo
    </Item>
    <Item onClick={console.log}>
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
      <Item onClick={console.log}>
        <ContextMenuIconContainer>
          <RotateClockwise size={16} />
        </ContextMenuIconContainer>
        Clockwise
      </Item>
      <Item onClick={console.log}>
        <ContextMenuIconContainer>
          <RotateCounterclockwise size={16} />
        </ContextMenuIconContainer>
        Counterclockwise
      </Item>
    </Submenu>
    <Item onClick={console.log}>
      <ContextMenuIconContainer>
        <Settings size={16} />
      </ContextMenuIconContainer>
      Configurations...
    </Item>
  </Menu>
);

export default ComponentContextMenu;
