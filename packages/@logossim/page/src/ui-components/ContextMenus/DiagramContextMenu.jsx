import React from 'react';
import { Menu, Item } from 'react-contexify';

import { Redo, Undo } from '../Icons';
import ContextMenuIconContainer from './ContextMenuIconContainer';

const DiagramContextMenu = () => (
  <Menu id="diagram">
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
