import React from 'react';

import DiagramContext from '@logossim/core/Diagram/DiagramContext';

import { render } from '@testing-library/react';

const Wrapper = ({ children }) => {
  return (
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
      {children}
    </DiagramContext.Provider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: Wrapper, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
