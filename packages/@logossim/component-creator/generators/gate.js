import generateActions from '../actions/generateActions';
import basePrompts from '../utils/basePrompts';

const gateGenerator = {
  description: 'A basic NOT gate, with one configuration set',
  prompts: basePrompts,
  actions: generateActions('Gate'),
};

export default gateGenerator;
