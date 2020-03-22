/* eslint-disable no-restricted-globals */
export const isValueValid = value =>
  value === null || value === 0 || value === 1;

export const isInputValid = input =>
  Object.values(input).every(isValueValid);

export const getCleanDiff = () => ({
  components: {},
  links: {},
});

export const getComponent = id => {
  if (!self.circuit) return null;

  return (
    self.circuit.components.find(component => component.id === id) ||
    null
  );
};

/**
 * Find all meshes that are affected by an emitted change.
 */
export const getAffectedMeshes = emitted =>
  self.circuit.meshes.filter(mesh =>
    mesh.inputs.some(
      meshInput =>
        emitted.from === meshInput.componentId &&
        Object.keys(emitted.value).includes(meshInput.name),
    ),
  );

/**
 * Finds all components that are connected on a given mesh's output.
 */
export const getMeshOutputComponents = mesh =>
  [
    ...new Set(
      mesh.outputs.map(meshOutput => meshOutput.componentId),
    ),
  ].map(componentId => getComponent(componentId));

/**
 * Determines the mesh input value.
 */
export const getMeshInputValue = mesh => {
  const allInputValues = mesh.inputs
    .map(portInfo => {
      const component = self.circuit.components.find(
        c => c.id === portInfo.componentId,
      );

      /**
       * From the mesh's perspective, a component's output port is an
       * input.
       */
      const port = component.getOutputPort(portInfo.name);

      return port ? port.value : null;
    })
    .filter(value => value !== null);

  // A mesh input is coherent if all of its inputs has the same value
  const isCoherent = allInputValues.every(
    (value, i, values) => value === values[0],
  );

  return isCoherent ? allInputValues[0] : 'error';
};

export const appendComponentDiff = (componentId, value) => {
  if (!self.diff.components[componentId]) {
    self.diff.components[componentId] = {};
  }
  self.diff.components[componentId] = {
    ...self.diff.components[componentId],
    ...value,
  };
};
