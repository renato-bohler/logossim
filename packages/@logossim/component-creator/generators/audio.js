import generateActions from '../actions/generateActions';
import basePrompts from '../utils/basePrompts';

const audioGenerator = {
  description: 'A component which emits sounds (has configurations)',
  prompts: basePrompts,
  actions: generateActions('Audio'),
};

export default audioGenerator;
