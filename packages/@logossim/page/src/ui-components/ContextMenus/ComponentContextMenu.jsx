import React from 'react';
import { Menu, Item, Separator } from 'react-contexify';

import {
  Clone,
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
  cloneSelected,
  cutSelected,
  copySelected,
  pasteSelected,
  deleteSelected,
  zoomIn,
  zoomOut,
}) => (
  <Menu id="component">
    <Item onClick={cloneSelected}>
      <ContextMenuIconContainer>
        <Clone />
      </ContextMenuIconContainer>
      Clone
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
    <Item onClick={() => window.alert('TODO: undo feature')}>
      <ContextMenuIconContainer>
        <Undo />
      </ContextMenuIconContainer>
      Undo
    </Item>
    <Item onClick={() => window.alert('TODO: redo feature')}>
      <ContextMenuIconContainer>
        <Redo />
      </ContextMenuIconContainer>
      Redo
    </Item>
    <Separator />
    <Item
      onClick={() => window.alert('TODO: configurations feature')}
    >
      <ContextMenuIconContainer>
        <Settings />
      </ContextMenuIconContainer>
      Configurations...
    </Item>
  </Menu>
);

export default ComponentContextMenu;
