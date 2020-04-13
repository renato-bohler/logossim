import React from 'react';
import { Menu, Item, Separator } from 'react-contexify';

import {
  Duplicate,
  Copy,
  Delete,
  Paste,
  Redo,
  Settings,
  Undo,
  Cut,
  ZoomIn,
  ZoomOut,
} from '../Icons';
import ContextMenuIconContainer from './ContextMenuIconContainer';

const ComponentContextMenu = ({
  duplicateSelected,
  cutSelected,
  copySelected,
  pasteSelected,
  deleteSelected,
  undo,
  redo,
  zoomIn,
  zoomOut,
  configureComponent,
}) => (
  <Menu id="component">
    <Item onClick={duplicateSelected}>
      <ContextMenuIconContainer>
        <Duplicate />
      </ContextMenuIconContainer>
      Duplicate
    </Item>
    <Item onClick={cutSelected}>
      <ContextMenuIconContainer>
        <Cut />
      </ContextMenuIconContainer>
      Cut
    </Item>
    <Item onClick={copySelected}>
      <ContextMenuIconContainer>
        <Copy />
      </ContextMenuIconContainer>
      Copy
    </Item>
    <Item onClick={pasteSelected}>
      <ContextMenuIconContainer>
        <Paste />
      </ContextMenuIconContainer>
      Paste
    </Item>
    <Item onClick={deleteSelected}>
      <ContextMenuIconContainer>
        <Delete />
      </ContextMenuIconContainer>
      Delete
    </Item>
    <Separator />
    <Item onClick={zoomIn}>
      <ContextMenuIconContainer>
        <ZoomIn />
      </ContextMenuIconContainer>
      Zoom in
    </Item>
    <Item onClick={zoomOut}>
      <ContextMenuIconContainer>
        <ZoomOut />
      </ContextMenuIconContainer>
      Zoom out
    </Item>
    <Separator />
    <Item onClick={undo}>
      <ContextMenuIconContainer>
        <Undo />
      </ContextMenuIconContainer>
      Undo
    </Item>
    <Item onClick={redo}>
      <ContextMenuIconContainer>
        <Redo />
      </ContextMenuIconContainer>
      Redo
    </Item>
    <Separator />
    <Item
      onClick={({ props: component }) =>
        configureComponent(component)
      }
    >
      <ContextMenuIconContainer>
        <Settings />
      </ContextMenuIconContainer>
      Edit configurations...
    </Item>
  </Menu>
);

export default ComponentContextMenu;
