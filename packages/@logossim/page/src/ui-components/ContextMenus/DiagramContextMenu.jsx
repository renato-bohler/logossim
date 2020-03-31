import React from 'react';

import { Menu, Item } from 'react-contexify';

import { Redo, Undo } from '../Icons';
import ContextMenuIconContainer from './ContextMenuIconContainer';

const DiagramContextMenu = () => (
  <Menu id="diagram">
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
  </Menu>
);

export default DiagramContextMenu;
