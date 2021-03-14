import React from 'react';

import ComponentContext from '@logossim/core/ComponentContext';
import DiagramContext from '@logossim/core/Diagram/DiagramContext';

import { render } from '@testing-library/react';

const Wrapper = ({ children, model }) => (
  <DiagramContext.Provider
    value={{
      getEngine: () => ({
        registerListener: () => {},
        getCanvas: () => {},
        getPortCoords: () => ({
          getWidth: () => {},
          getHeight: () => {},
          getTopLeft: () => {},
        }),
        getModel: () => ({ isLocked: () => false }),
      }),
    }}
  >
    <ComponentContext.Provider value={model}>
      {children}
    </ComponentContext.Provider>
  </DiagramContext.Provider>
);

const customRender = (ui, options) =>
  render(ui, {
    wrapper: props => <Wrapper {...props} model={ui.props.model} />,
    ...options,
  });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
