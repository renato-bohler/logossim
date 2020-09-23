const fileName = text =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]|_/gi, '')
    .split(' ')
    .map(word =>
      word.replace(
        /\w+/g,
        str => `${str[0].toUpperCase()}${str.slice(1)}`,
      ),
    )
    .join('');

export default fileName;
