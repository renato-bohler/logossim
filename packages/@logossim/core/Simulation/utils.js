export const cleanDiff = {
  components: {},
  links: {},
};

export const getAllComponents = circuit => {
  if (!circuit) return [];

  return circuit.components;
};
