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
  zoomIn,
  zoomOut,
}) => (
  <>
    <DiagramContextMenu
      pasteSelected={pasteSelected}
      zoomIn={zoomIn}
      zoomOut={zoomOut}
    />
    <ComponentContextMenu
      cloneSelected={cloneSelected}
      cutSelected={cutSelected}
      copySelected={copySelected}
      pasteSelected={pasteSelected}
      deleteSelected={deleteSelected}
      zoomIn={zoomIn}
      zoomOut={zoomOut}
    />
  </>
);

export default ContextMenus;
