import React from 'react';

import 'react-contexify/dist/ReactContexify.min.css';

import DiagramContextMenu from './DiagramContextMenu';
import ComponentContextMenu from './ComponentContextMenu';

const ContextMenus = () => (
  <>
    <DiagramContextMenu />
    <ComponentContextMenu />
  </>
);

export default ContextMenus;
