import React, { useState } from 'react';

import styled from 'styled-components';

import ComponentConfiguration from './ComponentConfiguration';
import ComponentSearch from './ComponentSearch';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  z-index: 3;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  background: rgba(0, 0, 0, 0.75);
`;

const Modal = styled.div`
  width: 60vw;
  height: 80vh;

  max-width: 600px;
  max-height: 800px;

  background: white;

  border: 1px solid black;
  border-radius: 25px;

  padding: 16px;

  z-index: 4;
`;

const ComponentSelect = ({
  isOpen,
  groups,
  handleClose,
  handleComponentDrop,
}) => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  if (!isOpen) return null;

  return (
    <Overlay>
      <Modal>
        {selectedComponent ? (
          <ComponentConfiguration
            handleClose={() => {
              handleClose();
              setSelectedComponent(null);
            }}
            handleComponentDrop={handleComponentDrop}
            handleBack={() => setSelectedComponent(null)}
            component={selectedComponent}
          />
        ) : (
          <ComponentSearch
            handleClose={handleClose}
            handleComponentSelect={setSelectedComponent}
            groups={groups}
          />
        )}
      </Modal>
    </Overlay>
  );
};

export default ComponentSelect;
