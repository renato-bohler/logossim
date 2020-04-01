import React from 'react';

import ComponentContextMenu from './ComponentContextMenu';
import DiagramContextMenu from './DiagramContextMenu';

import 'react-contexify/dist/ReactContexify.min.css';

const ContextMenus = ({
  cloneSelected,
  deleteSelected,
  copySelected,
  pasteSelected,
}) => (
  <>
    <DiagramContextMenu pasteSelected={pasteSelected} />
    <ComponentContextMenu
      cloneSelected={cloneSelected}
      deleteSelected={deleteSelected}
      copySelected={copySelected}
      pasteSelected={pasteSelected}
    />
  </>
);

export default ContextMenus;
