import React from 'react';

const engineStub = {
  registerListener: () => {},
  getCanvas: () => {},
};

const nodeStub = {
  getPort: () => {},
  getID: () => {},
  options: { selected: false },
};

const DraggableComponent = ({
  component: { type, Widget },
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
        }),
      );

      setTimeout(handleClose);
    }}
  >
    <Widget engine={engineStub} node={nodeStub} />
  </div>
);

export default DraggableComponent;
