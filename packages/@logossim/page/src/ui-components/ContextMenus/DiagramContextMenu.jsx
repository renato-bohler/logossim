import React from 'react';
import { Menu, Item, Separator } from 'react-contexify';

import { Redo, Undo, Paste, ZoomIn, ZoomOut } from '../Icons';
import Key from '../Key/Key';
import ContextMenuIconContainer from './ContextMenuIconContainer';
import ContextMenuShortcutContainer from './ContextMenuShortcutContainer';

const DiagramContextMenu = ({
  pasteSelected,
  undo,
  redo,
  zoomIn,
  zoomOut,
}) => (
  <Menu id="diagram">
    <Item onClick={pasteSelected}>
      <ContextMenuIconContainer>
        <Paste />
      </ContextMenuIconContainer>
      Paste
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>V</Key>
      </ContextMenuShortcutContainer>
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
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>Z</Key>
      </ContextMenuShortcutContainer>
    </Item>

    <Item onClick={redo}>
      <ContextMenuIconContainer>
        <Redo />
      </ContextMenuIconContainer>
      Redo
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>SHIFT</Key>
        <Key>Z</Key>
      </ContextMenuShortcutContainer>
    </Item>
  </Menu>
);

export default DiagramContextMenu;
