import React from 'react';

import Modal from '../Modal/Modal';
import ComponentConfiguration from './ComponentConfiguration';

const ComponentEdit = ({
  isOpen,
  components,
  component,
  handleClose,
  handleComponentEdit,
}) => {
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
          handleComponentEdit({ ...component, configurations })
        }
        component={edit}
      />
    </Modal>
  );
};

export default ComponentEdit;
