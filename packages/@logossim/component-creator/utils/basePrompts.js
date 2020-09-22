import validateComponentExists from './validateComponentExists';

const basePrompts = [
  {
    type: 'input',
    name: 'name',
    message: 'Type in your component name:',
    validate: validateComponentExists,
  },
  {
    type: 'input',
    name: 'description',
    message: 'Type in a nice description for your component:',
  },
  {
    type: 'list',
    name: 'group',
    message: 'In which group this component should be added?',
    // TODO: being generated as "Input &amp; Output"
    choices: ['Input & Output', 'Logic gates', 'Wiring', 'Plexers'],
  },
];

export default basePrompts;
