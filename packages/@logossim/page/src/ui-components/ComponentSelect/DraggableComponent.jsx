import React from 'react';

const engineStub = {
  registerListener: () => {},
  getCanvas: () => {},
  getPortCoords: () => {},
};

const nodeStub = {
  getPort: () => ({ links: {}, updateCoords: () => {} }),
  getID: () => {},
  options: { selected: false },
};

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

      setTimeout(handleClose);
    }}
  >
    <Widget
      engine={engineStub}
      node={{ ...nodeStub, configurations }}
    />
  </div>
);

export default DraggableComponent;
