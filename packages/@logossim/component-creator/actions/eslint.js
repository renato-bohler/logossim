import { CLIEngine } from 'eslint';

import { COMPONENTS_ROOT_DIR } from '../utils/const';

const eslint = async (input, config, plopInstance) => {
  const path = plopInstance.renderString(
    `${COMPONENTS_ROOT_DIR}/{{fileName name}}`,
    input,
  );
  const engine = new CLIEngine({ fix: true });
  const results = engine.executeOnFiles([
    `${path}/**/*.{js,jsx}`,
    `${COMPONENTS_ROOT_DIR}/index.js`,
  ]);
  CLIEngine.outputFixes(results);
};

export default eslint;
