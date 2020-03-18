export const isValueValid = value =>
  value === null || value === 0 || value === 1;

export const isInputValid = input =>
  Object.values(input).every(isValueValid);

export const getCleanDiff = () => ({
  components: {},
  links: {},
});
