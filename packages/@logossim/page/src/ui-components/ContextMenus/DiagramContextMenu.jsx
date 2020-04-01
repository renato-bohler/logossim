import React from 'react';
import { Menu, Item, Separator } from 'react-contexify';

import { Redo, Undo, Paste } from '../Icons';
import ContextMenuIconContainer from './ContextMenuIconContainer';

const DiagramContextMenu = ({ pasteSelected }) => (
  <Menu id="diagram">
    <Item onClick={pasteSelected}>
      <ContextMenuIconContainer>
        <Paste size={16} />
      </ContextMenuIconContainer>
      Paste
    </Item>
    <Separator />
    <Item onClick={() => window.alert('TODO: handle undo')}>
      <ContextMenuIconContainer>
        <Undo size={16} />
      </ContextMenuIconContainer>
      Undo
    </Item>
    <Item onClick={() => window.alert('TODO: handle redo')}>
      <ContextMenuIconContainer>
        <Redo size={16} />
      </ContextMenuIconContainer>
      Redo
    </Item>
  </Menu>
);

export default DiagramContextMenu;
