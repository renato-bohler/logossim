const fs = require('fs');

const fileName = require('../helpers/fileName');
const { COMPONENTS_ROOT_DIR } = require('./const');

const filesToCheck = ['Model.js', 'Register.js', 'Widget.jsx'];

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

module.exports = validateComponentExists;
