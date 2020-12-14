import fileName from '../helpers/fileName';
import { COMPONENTS_ROOT_DIR } from '../utils/const';

const generateActions = baseName => [
  {
    type: 'add',
    path: `${COMPONENTS_ROOT_DIR}/{{fileName name}}/{{fileName name}}Model.js`,
    templateFile: `templates/${baseName}/${baseName}Model.hbs`,
  },
  {
    type: 'add',
    path: `${COMPONENTS_ROOT_DIR}/{{fileName name}}/{{fileName name}}Widget.jsx`,
    templateFile: `templates/${baseName}/${baseName}Widget.hbs`,
  },
  {
    type: 'add',
    path: `${COMPONENTS_ROOT_DIR}/{{fileName name}}/{{fileName name}}Icon.jsx`,
    templateFile: `templates/${baseName}/${baseName}Icon.hbs`,
  },
  {
    type: 'add',
    path: `${COMPONENTS_ROOT_DIR}/{{fileName name}}/{{fileName name}}Register.js`,
    templateFile: `templates/${baseName}/${baseName}Register.hbs`,
  },
  {
    type: 'modify',
    path: `${COMPONENTS_ROOT_DIR}/index.js`,
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
];

export default generateActions;
