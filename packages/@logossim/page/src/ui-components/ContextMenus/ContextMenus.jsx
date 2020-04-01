import React from 'react';

import ComponentContextMenu from './ComponentContextMenu';
import DiagramContextMenu from './DiagramContextMenu';

import 'react-contexify/dist/ReactContexify.min.css';

const ContextMenus = ({ cloneSelected, deleteSelected }) => (
  <>
    <DiagramContextMenu />
    <ComponentContextMenu
      cloneSelected={cloneSelected}
      deleteSelected={deleteSelected}
    />
  </>
);

export default ContextMenus;
