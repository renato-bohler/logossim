import React from 'react';

import ComponentContextMenu from './ComponentContextMenu';
import DiagramContextMenu from './DiagramContextMenu';

import 'react-contexify/dist/ReactContexify.min.css';

const ContextMenus = ({
  cloneSelected,
  cutSelected,
  copySelected,
  pasteSelected,
  deleteSelected,
}) => (
  <>
    <DiagramContextMenu pasteSelected={pasteSelected} />
    <ComponentContextMenu
      cloneSelected={cloneSelected}
      cutSelected={cutSelected}
      copySelected={copySelected}
      pasteSelected={pasteSelected}
      deleteSelected={deleteSelected}
    />
  </>
);

export default ContextMenus;
