import fs from 'fs';

import fileName from '../helpers/fileName';
import { COMPONENTS_ROOT_DIR } from './const';

const filesToCheck = [
  'Register.js',
  'Model.js',
  'Icon.jsx',
  'Widget.jsx',
];

const componentExists = componentName =>
  filesToCheck
    .map(
      file =>
        `${COMPONENTS_ROOT_DIR}/${componentName}/${componentName}${file}`,
    )
    .map(fullpath => fs.existsSync(fullpath))
    .some(result => result === true);

const validateComponentExists = name => {
  const componentName = fileName(name);
  if (componentExists(componentName))
    return `A component named "${componentName}" already exists... please try another one`;
  return true;
};

export default validateComponentExists;
