import React, { useEffect, useCallback } from 'react';

import Modal from '../Modal/Modal';
import ComponentConfiguration from './ComponentConfiguration';

const closeOnEsc = ({ code }, handleClose) => {
  if (code !== 'Escape') return;
  handleClose();
};

const ComponentEdit = ({
  isOpen,
  components,
  component,
  handleClose,
  handleComponentEdit,
}) => {
  const callback = useCallback(
    event => closeOnEsc(event, handleClose),
    [handleClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', callback);
    return () => window.removeEventListener('keydown', callback);
  }, [callback]);

  if (!isOpen) return null;

  const factory = components.find(
    c => c.type === component.options.type,
  );

  const edit = {
    ...factory,
    configurations: factory.configurations.map(configuration => ({
      ...configuration,
      default: component.configurations[configuration.name],
    })),
  };

  return (
    <Modal>
      <ComponentConfiguration
        editMode
        handleClose={handleClose}
        handleSubmit={(event, { configurations }) =>
          handleComponentEdit(component, configurations)
        }
        component={edit}
      />
    </Modal>
  );
};

export default ComponentEdit;
