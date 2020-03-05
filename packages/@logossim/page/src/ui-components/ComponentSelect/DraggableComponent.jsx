import React from 'react';
import Tooltip from 'react-tooltip';

const engineStub = {
  registerListener: () => {},
  getCanvas: () => {},
  getPortCoords: () => {},
  getModel: () => ({ isLocked: () => false }),
};

/**
 * Proxy is used here to return a function for whatever unknown object
 * key is asked for.
 */
const createModelStub = configurations =>
  new Proxy(
    {
      configurations,
      getPort: () => ({ links: {}, updateCoords: () => {} }),
      options: { selected: false },
    },
    {
      get: (target, name) =>
        name in target ? target[name] : () => {},
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
      model={createModelStub(configurations)}
    />
  </div>
);

export default DraggableComponent;
