export const isInputValid = inputs =>
  Object.values(inputs).every(
    input => input === null || input === 0 || input === 1,
  );

export const cleanDiff = {
  components: {},
  links: {},
};

export const getAllComponents = circuit => {
  if (!circuit) return [];

  return circuit.components;
};
