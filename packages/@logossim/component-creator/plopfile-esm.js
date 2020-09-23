import button from './generators/button';
import escapeSingleQuote from './helpers/escapeSingleQuote';
import fileName from './helpers/fileName';

export default plop => {
  plop.setWelcomeMessage(
    `Please select a base component to generate yours from`,
  );

  plop.setHelper('fileName', fileName);
  plop.setHelper('escapeSingleQuote', escapeSingleQuote);

  plop.setGenerator('Button', button);
};
