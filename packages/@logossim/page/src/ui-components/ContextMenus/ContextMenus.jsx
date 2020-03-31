import React from 'react';

import 'react-contexify/dist/ReactContexify.min.css';

import DiagramContextMenu from './DiagramContextMenu';
import ComponentContextMenu from './ComponentContextMenu';

const ContextMenus = ({ clone }) => (
  <>
    <DiagramContextMenu />
    <ComponentContextMenu clone={clone} />
  </>
);

export default ContextMenus;
