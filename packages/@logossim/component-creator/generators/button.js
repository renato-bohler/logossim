import generateActions from '../actions/generateActions';
import basePrompts from '../utils/basePrompts';

const buttonGenerator = {
  description: 'A simple click/release component',
  prompts: basePrompts,
  actions: generateActions('Button'),
};

export default buttonGenerator;
