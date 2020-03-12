export const isValueValid = value =>
  value === null || value === 0 || value === 1;

export const isInputValid = input =>
  Object.values(input).every(isValueValid);

export const cleanDiff = {
  components: {},
  links: {},
};

export const getAllComponents = circuit => {
  if (!circuit) return [];

  return circuit.components;
};
