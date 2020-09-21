// TODO: remove/replace special and forbidden characters
const fileName = text =>
  text
    .split(' ')
    .map(word =>
      word.replace(
        /\w+/g,
        str => `${str[0].toUpperCase()}${str.slice(1)}`,
      ),
    )
    .join('');

module.exports = fileName;
