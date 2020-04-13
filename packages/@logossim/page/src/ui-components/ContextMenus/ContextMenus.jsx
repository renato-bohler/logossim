import React from 'react';

import ComponentContextMenu from './ComponentContextMenu';
import DiagramContextMenu from './DiagramContextMenu';

import 'react-contexify/dist/ReactContexify.min.css';

const ContextMenus = ({
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
  <>
    <DiagramContextMenu
      pasteSelected={pasteSelected}
      undo={undo}
      redo={redo}
      zoomIn={zoomIn}
      zoomOut={zoomOut}
    />
    <ComponentContextMenu
      duplicateSelected={duplicateSelected}
      cutSelected={cutSelected}
      copySelected={copySelected}
      pasteSelected={pasteSelected}
      deleteSelected={deleteSelected}
      undo={undo}
      redo={redo}
      zoomIn={zoomIn}
      zoomOut={zoomOut}
      configureComponent={configureComponent}
    />
  </>
);

export default ContextMenus;
