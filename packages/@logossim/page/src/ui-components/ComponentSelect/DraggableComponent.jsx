import React from 'react';
import Tooltip from 'react-tooltip';

const engineStub = {
  registerListener: () => {},
  getCanvas: () => {},
  getPortCoords: () => ({
    getWidth: () => {},
    getHeight: () => {},
    getTopLeft: () => {},
  }),
  getModel: () => ({ isLocked: () => false }),
};

const DraggableComponent = ({
  component: { type, Widget, Model },
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

      requestAnimationFrame(() => {
        Tooltip.hide();
        handleClose();
      });
    }}
    data-for="tooltip"
    data-tip="Drag me!"
    data-place="bottom"
  >
    <Widget
      engine={engineStub}
      model={new Model(type, configurations)}
    />
  </div>
);

export default DraggableComponent;
