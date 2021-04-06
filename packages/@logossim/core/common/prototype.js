/* eslint-disable no-extend-native */
Array.prototype.asArray = function arrayAsArray() {
  return this;
};

Array.prototype.asNumber = function arrayAsNumber() {
  if (this.some(bit => bit === 'e')) return 'e';
  if (this.some(bit => bit === 'x')) return 'x';

  if (this.some(bit => bit !== 0 && bit !== 1))
    throw new Error(
      '[logossim] Array cannot be converted to number because it contains invalid values',
    );

  return this.slice()
    .reverse()
    .reduce((acc, curr, index) => acc + curr * 2 ** index, 0);
};

Array.prototype.transpose = function transpose() {
  return this[0].map((x1, i) => this.map(x2 => x2[i]));
};

Number.prototype.asNumber = function numberAsNumber() {
  return Number(this);
};

Number.prototype.asArray = function numberAsArray(dataBits) {
  if (!dataBits)
    throw new Error(
      '[logossim] To transform a number to array, you need to pass as argument the length of the array',
    );

  const result = [...this.toString(2)].map(Number);

  return Array(dataBits)
    .fill(0)
    .concat(result)
    .slice(result.length);
};

String.prototype.asArray = function stringAsArray(dataBits) {
  if (!dataBits)
    throw new Error(
      '[logossim] To transform a number to array, you need to pass as argument the length of the array',
    );

  return [...this.padStart(dataBits, 0)].map(char => {
    if (char === '0') return 0;
    if (char === '1') return 1;
    return char;
  });
};

String.prototype.parseBinary = function parseBinary(
  dataBits,
  arrayLength,
  fillWith = 0,
) {
  if (!dataBits)
    throw new Error(
      '[logossim] To parse a binary, you need to pass the value length in bits as first argument.',
    );

  if (!arrayLength)
    throw new Error(
      '[logossim] To parse a binary, you need to pass the result array length as second argument.',
    );

  const sanitize = /[^01]/g;
  const chunk = new RegExp(`.{1,${dataBits}}`, 'g');

  const content = (
    this.replace(sanitize, '').match(chunk) || []
  ).map(value => parseInt(value, 2));

  return Array(arrayLength)
    .fill(fillWith)
    .map((original, i) => {
      const value = content[i];
      if (!value) return original;
      return value;
    });
};
