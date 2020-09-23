import { CLIEngine } from 'eslint';

const eslint = async (input, config, plopInstance) => {
  const path = plopInstance.renderString(config.path, input);
  const engine = new CLIEngine({ fix: true });
  const results = engine.executeOnFiles([`${path}/**/*.{js,jsx}`]);
  CLIEngine.outputFixes(results);
};

export default eslint;
