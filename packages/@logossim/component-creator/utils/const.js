import fs from 'fs';
import path from 'path';

const CURRENT_PATH = fs.realpathSync(process.cwd());

export const ROOT_DIR = path.resolve(CURRENT_PATH, '../../..');

export const COMPONENTS_ROOT_DIR = path.resolve(
  ROOT_DIR,
  'packages/@logossim/components',
);
