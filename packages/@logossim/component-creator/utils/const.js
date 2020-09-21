const fs = require('fs');
const path = require('path');

module.exports = {
  COMPONENTS_ROOT_DIR: path.resolve(
    fs.realpathSync(process.cwd()),
    '../components',
  ),
};
