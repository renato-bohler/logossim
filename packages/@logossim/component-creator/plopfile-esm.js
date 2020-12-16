import eslint from './actions/eslint';
import audio from './generators/audio';
import button from './generators/button';
import gate from './generators/gate';
import output from './generators/output';
import escapeSingleQuote from './helpers/escapeSingleQuote';
import fileName from './helpers/fileName';

export default plop => {
  plop.setWelcomeMessage(
    `Please select a base component to generate yours from`,
  );

  plop.setHelper('fileName', fileName);
  plop.setHelper('escapeSingleQuote', escapeSingleQuote);
  plop.setActionType('eslint', eslint);

  plop.setGenerator('Button', button);
  plop.setGenerator('Gate', gate);
  plop.setGenerator('Output', output);
  plop.setGenerator('Audio', audio);
};
