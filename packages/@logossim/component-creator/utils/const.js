import fs from 'fs';
import path from 'path';

export const COMPONENTS_ROOT_DIR = path.resolve(
  fs.realpathSync(process.cwd()),
  '../components',
);
