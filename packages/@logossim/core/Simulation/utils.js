/* eslint-disable no-restricted-globals */
export const MIN_VALUE = 0;
export const MAX_VALUE = {
  1: 0b1,
  2: 0b11,
  4: 0b1111,
  8: 0b1111_1111,
  16: 0b1111_1111_1111_1111,
};

export const adjustValueToBits = (value, dataBits = 1) => {
  if (typeof value !== 'number') return value;

  const allBitsSet = 0b1111_1111_1111_1111_1111_1111_1111_1111;
  const mask = allBitsSet >>> (32 - dataBits);

  return value & mask;
};

export const isValueEqual = (value1, value2) => {
  return value1
    .map((v1, index) => v1 === value2[index])
    .every(Boolean);
};

export const isValueValid = value =>
  value === null ||
  (Array.isArray(value) && value.every(v => typeof v === 'number'));

export const isInputValid = input =>
  input.every(item => isValueValid(item.value, item.bits));

export const isValueError = value =>
  value === 'e' ||
  (Array.isArray(value) && value.some(v => v === 'e'));

export const isInputError = input =>
  input.some(item => isValueError(item.value));

export const isValueFloating = value =>
  value === 'x' ||
  (Array.isArray(value) && value.some(v => v === 'x'));

export const isInputFloating = input =>
  input.some(item => isValueFloating(item.value));

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
        emitted.from.id === meshInput.componentId &&
        Object.keys(emitted.value).includes(meshInput.name),
    ),
  );

/**
 * Finds all components that are connected on a given mesh's Input.
 */
export const getMeshInputComponents = mesh =>
  [
    ...new Set(mesh.inputs.map(meshInput => meshInput.componentId)),
  ].map(componentId => getComponent(componentId));

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
      const component = getComponent(portInfo.componentId);

      /**
       * From the mesh's perspective, a component's output port is an
       * input.
       */
      const port = component.getOutputPort(portInfo.name);

      return port ? port.value : null;
    })
    .filter(value => value !== null);

  return [...Array(allInputValues[0].length).keys()]
    .map(index => allInputValues.map(v => v[index]))
    .map(arr => {
      const firstDefinedValue = arr.find(
        value => typeof value === 'number',
      );

      const areBitsCompatible = arr.every(
        item => item === firstDefinedValue || item === 'x',
      );

      if (!areBitsCompatible) return 'e';
      if (typeof firstDefinedValue === 'number')
        return firstDefinedValue;
      return 'x';
    });
};

/**
 * Initialize all links and ports with the floating value.
 */
export const initializeDiffAndValues = () => {
  self.circuit.components.forEach(component => {
    component.setInputValues(
      Object.fromEntries(
        component.ports.input.map(port => [
          port.id,
          new Array(port.bits || 1).fill('x'),
        ]),
      ),
    );
    component.setOutputValues(
      Object.fromEntries(
        component.ports.output.map(port => [
          port.id,
          new Array(port.bits || 1).fill('x'),
        ]),
      ),
    );
  });

  const diffLinks = self.circuit.meshes
    .map(mesh => mesh.links)
    .flat()
    .reduce((obj, link) => {
      const { bits } = self.circuit.meshes.find(mesh =>
        mesh.links.includes(link),
      );

      return { ...obj, [link]: Array(bits).fill('x') };
    }, {});

  const diffComponents = Object.fromEntries(
    self.circuit.components.map(component => [
      component.id,
      {
        output: Object.fromEntries(
          [
            ...component.ports.input,
            ...component.ports.output,
          ].map(port => [
            port.name,
            new Array(port.bits || 1).fill('x'),
          ]),
        ),
        properties: component.getProperties(),
      },
    ]),
  );

  postMessage({
    type: 'diff',
    payload: { links: diffLinks, components: diffComponents },
  });
};

export const appendComponentDiff = (component, output) => {
  if (!self.diff.components[component.id]) {
    self.diff.components[component.id] = {
      output: {},
      properties: {},
    };
  }
  self.diff.components[component.id] = {
    ...self.diff.components[component.id],
    output: self.diff.components[component.id].output
      ? {
          ...self.diff.components[component.id].output,
          ...(output || {}),
        }
      : output || {},
    properties: component.getProperties(),
  };
};
