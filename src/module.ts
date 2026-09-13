import { registerCanvasDrop } from './canvasDrop.js';
import { MODULE_ID } from './constants.js';
import { deployParty } from './deploy.js';
import { createPartyTokenFromFolder } from './partyToken.js';
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
      createPartyTokenFromFolder,
    };
  }
});
