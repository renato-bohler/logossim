const buttonGenerator = require('./generators/button');
const fileName = require('./helpers/fileName');

module.exports = plop => {
  plop.setWelcomeMessage(
    `Please select a base component to generate yours from`,
  );

  plop.setHelper('fileName', fileName);

  plop.setGenerator('Button', buttonGenerator);
};
