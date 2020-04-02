import React from 'react';
import { Menu, Item, Separator } from 'react-contexify';

import { Redo, Undo, Paste, ZoomIn, ZoomOut } from '../Icons';
import ContextMenuIconContainer from './ContextMenuIconContainer';

const DiagramContextMenu = ({ pasteSelected, zoomIn, zoomOut }) => (
  <Menu id="diagram">
    <Item onClick={pasteSelected}>
      <ContextMenuIconContainer>
        <Paste />
      </ContextMenuIconContainer>
      Paste
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
    <Item onClick={() => window.alert('TODO: handle undo')}>
      <ContextMenuIconContainer>
        <Undo />
      </ContextMenuIconContainer>
      Undo
    </Item>
    <Item onClick={() => window.alert('TODO: handle redo')}>
      <ContextMenuIconContainer>
        <Redo />
      </ContextMenuIconContainer>
      Redo
    </Item>
  </Menu>
);

export default DiagramContextMenu;
