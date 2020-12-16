import generateActions from '../actions/generateActions';
import basePrompts from '../utils/basePrompts';

const outputGenerator = {
  description: 'A simple LED (has configurations)',
  prompts: basePrompts,
  actions: generateActions('Output'),
};

export default outputGenerator;
