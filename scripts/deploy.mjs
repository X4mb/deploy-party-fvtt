/**
 * Copies built assets into the local Foundry VTT user data folder.
 * Runs automatically after `npm run build`.
 *
 * Override destination: set FOUNDRY_MODULE_PATH to the full `deploy-party` folder
 * (e.g. `D:/FoundryVTT/Data/modules/deploy-party`).
 */
import { cpSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const dest =
  process.env.FOUNDRY_MODULE_PATH?.trim() ||
  (() => {
    const local = process.env.LOCALAPPDATA;
    if (!local) return null;
    return join(local, 'FoundryVTT', 'Data', 'modules', 'deploy-party');
  })();

if (!dest) {
  console.warn(
    '[deploy-party] Skip Foundry deploy: set LOCALAPPDATA (Windows) or FOUNDRY_MODULE_PATH to your Data/modules/deploy-party folder.',
  );
  process.exit(0);
}

if (!existsSync(join(root, 'dist', 'deploy-party.js'))) {
  console.error('[deploy-party] dist/deploy-party.js missing — run esbuild first.');
  process.exit(1);
}

mkdirSync(join(dest, 'dist'), { recursive: true });
mkdirSync(join(dest, 'lang'), { recursive: true });
mkdirSync(join(dest, 'assets'), { recursive: true });
cpSync(join(root, 'dist'), join(dest, 'dist'), { recursive: true });
cpSync(join(root, 'lang'), join(dest, 'lang'), { recursive: true });
cpSync(join(root, 'assets'), join(dest, 'assets'), { recursive: true });
copyFileSync(join(root, 'module.json'), join(dest, 'module.json'));
console.log(`[deploy-party] Deployed -> ${dest}`);
