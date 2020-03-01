import React from 'react';

const engineStub = {
  registerListener: () => {},
  getCanvas: () => {},
  getPortCoords: () => {},
  getModel: () => ({ isLocked: () => false }),
};

const nodeStub = {
  getPort: () => ({ links: {}, updateCoords: () => {} }),
  getID: () => {},
  options: { selected: false },
};

/**
 * Proxy is used here to return a function for whatever object key is
 * asked for.
 */
const modelStub = new Proxy(
  {},
  {
    get: () => {
      return () => {};
    },
  },
);

const DraggableComponent = ({
  component: { type, Widget },
  configurations,
  handleClose,
}) => (
  <div
    draggable
    onDragStart={event => {
      event.dataTransfer.setDragImage(
        event.currentTarget.children[0],
        0,
        0,
      );

      event.dataTransfer.setData(
        'component',
        JSON.stringify({
          type,
          configurations,
        }),
      );

      requestAnimationFrame(handleClose);
    }}
  >
    <Widget
      engine={engineStub}
      node={{ ...nodeStub, configurations }}
      model={modelStub}
    />
  </div>
);

export default DraggableComponent;
