import React, { useState } from 'react';

import Modal from '../Modal/Modal';
import ComponentConfiguration from './ComponentConfiguration';
import ComponentSearch from './ComponentSearch';

const ComponentSelect = ({
  isOpen,
  groups,
  handleClose,
  handleComponentDrop,
}) => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  if (!isOpen) return null;

  return (
    <Modal>
      {selectedComponent ? (
        <ComponentConfiguration
          handleClose={() => {
            handleClose();
            setSelectedComponent(null);
          }}
          handleSubmit={handleComponentDrop}
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
  );
};

export default ComponentSelect;
