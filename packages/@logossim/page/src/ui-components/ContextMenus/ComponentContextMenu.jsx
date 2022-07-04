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
import Key from '../Key/Key';
import ContextMenuIconContainer from './ContextMenuIconContainer';
import ContextMenuShortcutContainer from './ContextMenuShortcutContainer';

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
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>D</Key>
      </ContextMenuShortcutContainer>
    </Item>

    <Item onClick={cutSelected}>
      <ContextMenuIconContainer>
        <Cut />
      </ContextMenuIconContainer>
      Cut
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>X</Key>
      </ContextMenuShortcutContainer>
    </Item>

    <Item onClick={copySelected}>
      <ContextMenuIconContainer>
        <Copy />
      </ContextMenuIconContainer>
      Copy
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>C</Key>
      </ContextMenuShortcutContainer>
    </Item>

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

    <Item onClick={deleteSelected}>
      <ContextMenuIconContainer>
        <Delete />
      </ContextMenuIconContainer>
      Delete
      <ContextMenuShortcutContainer>
        <Key>Delete</Key>
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

    <Separator />

    <Item
      onClick={({ props: { component } }) =>
        configureComponent(component)
      }
    >
      <ContextMenuIconContainer>
        <Settings />
      </ContextMenuIconContainer>
      Edit configurations...
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>E</Key>
      </ContextMenuShortcutContainer>
    </Item>
  </Menu>
);

export default ComponentContextMenu;
