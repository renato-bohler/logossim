import fileName from '../helpers/fileName';
import basePrompts from '../utils/basePrompts';
import { COMPONENTS_ROOT_DIR } from '../utils/const';

const buttonGenerator = {
  description: 'A simple click/release component',
  prompts: basePrompts,
  actions: [
    // TODO: create a function that returns all necessary "add"s
    {
      type: 'add',
      path: `${COMPONENTS_ROOT_DIR}/{{fileName name}}/{{fileName name}}Model.js`,
      templateFile: 'templates/Button/ButtonModel.hbs',
    },
    {
      type: 'add',
      path: `${COMPONENTS_ROOT_DIR}/{{fileName name}}/{{fileName name}}Widget.jsx`,
      templateFile: 'templates/Button/ButtonWidget.hbs',
    },
    {
      type: 'add',
      path: `${COMPONENTS_ROOT_DIR}/{{fileName name}}/{{fileName name}}Icon.jsx`,
      templateFile: 'templates/Button/ButtonIcon.hbs',
    },
    {
      type: 'add',
      path: `${COMPONENTS_ROOT_DIR}/{{fileName name}}/{{fileName name}}Register.js`,
      templateFile: 'templates/Button/ButtonRegister.hbs',
    },
    {
      type: 'modify',
      path: `${COMPONENTS_ROOT_DIR}/index.js`,
      // TODO: refactor this to a separate file
      transform: (fileContents, data) => {
        const name = fileName(data.name);

        const importStatement = `import ${name} from './${name}/${name}Register';`;
        const oldComponents = fileContents.match(
          /const components = \[(.|\n)*\];/g,
        )[0];
        const newComponents = oldComponents.replace(
          /\n([^\n]*)$/,
          `\n  ${name},\n$1`,
        );

        return `${importStatement}\n${fileContents.replace(
          oldComponents,
          newComponents,
        )}`;
      },
    },
    {
      type: 'eslint',
      path: `${COMPONENTS_ROOT_DIR}/{{fileName name}}`,
    },
  ],
};

export default buttonGenerator;
