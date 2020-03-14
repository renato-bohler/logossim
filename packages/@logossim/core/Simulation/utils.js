export const isValueValid = value =>
  value === null || value === 0 || value === 1;

export const isInputValid = input =>
  Object.values(input).every(isValueValid);

export const getMeshInputValue = (mesh, components) => {
  const allInputValues = mesh.inputs
    .map(portInfo => {
      const component = components.find(
        c => c.id === portInfo.componentId,
      );

      // Port's output is the mesh's input
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

export const cleanDiff = {
  components: {},
  links: {},
};

export const getAllComponents = circuit => {
  if (!circuit) return [];

  return circuit.components;
};
