import { registerCanvasDrop } from './canvasDrop.js';
import { MODULE_ID } from './constants.js';
import { deployFolderDirectly, deployParty } from './deploy.js';
import { createPartyTokenFromFolder } from './partyToken.js';
import { recallParty } from './recall.js';
import { registerModuleSettings } from './settings.js';
import { registerTokenHudButton } from './hud.js';

Hooks.once('init', () => {
  registerModuleSettings();
  registerCanvasDrop();
  registerTokenHudButton();
});

Hooks.once('ready', () => {
  const mod = game.modules?.get(MODULE_ID);
  if (mod) {
    (mod as { api?: Record<string, unknown> }).api = {
      deployParty,
      deployFolderDirectly,
      createPartyTokenFromFolder,
      recallParty,
    };
  }
});
