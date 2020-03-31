import React from 'react';

import 'react-contexify/dist/ReactContexify.min.css';

import ComponentContextMenu from './ComponentContextMenu';
import DiagramContextMenu from './DiagramContextMenu';

const ContextMenus = ({ clone }) => (
  <>
    <DiagramContextMenu />
    <ComponentContextMenu clone={clone} />
  </>
);

export default ContextMenus;
