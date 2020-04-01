import React from 'react';
import Tooltip from 'react-tooltip';

import styled from 'styled-components';

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

const ErrorWidget = styled.div`
  border: 1px dashed var(--value-error);
  border-radius: 5px;
  width: 30px;
  height: 30px;
`;

const DraggableComponent = ({
  component: { type, Widget, Model },
  configurations,
  handleClose,
  error,
}) => (
  <div
    draggable={!error}
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
    data-tip={error ? 'Check form errors' : 'Drag me!'}
    data-place="bottom"
  >
    {error ? (
      <ErrorWidget />
    ) : (
      <Widget
        engine={engineStub}
        model={new Model(type, configurations)}
      />
    )}
  </div>
);

export default DraggableComponent;
