import { DEFAULT_TOKEN_IMAGE, MODULE_ID } from './constants.js';

type SettingsAPI = {
  register(namespace: string, key: string, data: Record<string, unknown>): void;
  get(namespace: string, key: string): unknown;
};

function s(): SettingsAPI {
  return game.settings as unknown as SettingsAPI;
}

/** Resolve i18n key when module lang is loaded; otherwise show the English fallback. */
export function loc(key: string, fallback: string): string {
  const v = game.i18n?.localize(key) ?? key;
  return v === key ? fallback : v;
}

export const SETTINGS = {
  DEPLOY_ON_DROP: 'deployOnDrop',
  SHIFT_AFTER_DEPLOY: 'shiftAfterDeployBehavior',
  INCLUDE_SUBFOLDERS: 'includeSubfolders',
  AFTER_DEPLOY: 'afterDeployBehavior',
  LAYOUT: 'deployLayout',
  SPACING: 'tokenSpacing',
  PARTY_TOKEN_SIZE: 'partyTokenSize',
  DEFAULT_IMAGE: 'defaultTokenImage',
} as const;

export const AFTER_DEPLOY_BEHAVIORS = {
  KEEP: 'keep',
  HIDE: 'hide',
  DELETE: 'delete',
} as const;

export const DEPLOY_LAYOUTS = {
  GRID: 'grid',
  LINE: 'line',
  CIRCLE: 'circle',
  SCATTER: 'scatter',
} as const;

export function registerModuleSettings(): void {
  s().register(MODULE_ID, SETTINGS.DEPLOY_ON_DROP, {
    name: loc(`${MODULE_ID}.SETTINGS.deployOnDrop.name`, 'Deploy immediately on drop'),
    hint: loc(
      `${MODULE_ID}.SETTINGS.deployOnDrop.hint`,
      'When enabled, dragging a folder onto the canvas deploys every actor in it right away instead of creating a party marker to deploy later. Hold Shift while dropping to use the "Shift+Drop" marker behavior below instead of the usual one.',
    ),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  s().register(MODULE_ID, SETTINGS.SHIFT_AFTER_DEPLOY, {
    name: loc(`${MODULE_ID}.SETTINGS.shiftAfterDeployBehavior.name`, 'Shift+Drop: party marker should instead'),
    hint: loc(
      `${MODULE_ID}.SETTINGS.shiftAfterDeployBehavior.hint`,
      'Only applies when "Deploy immediately on drop" is on and you hold Shift while dropping the folder: overrides "After deploying, the party marker should" for that one drop.',
    ),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      [AFTER_DEPLOY_BEHAVIORS.KEEP]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.keep`, 'Stay on the scene'),
      [AFTER_DEPLOY_BEHAVIORS.HIDE]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.hide`, 'Be hidden'),
      [AFTER_DEPLOY_BEHAVIORS.DELETE]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.delete`, 'Be deleted'),
    },
    default: AFTER_DEPLOY_BEHAVIORS.HIDE,
  });

  s().register(MODULE_ID, SETTINGS.INCLUDE_SUBFOLDERS, {
    name: loc(`${MODULE_ID}.SETTINGS.includeSubfolders.name`, 'Include subfolders when deploying'),
    hint: loc(
      `${MODULE_ID}.SETTINGS.includeSubfolders.hint`,
      'When enabled, Deploy also drops actors found in nested subfolders, not just the folder that was dragged onto the canvas.',
    ),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  s().register(MODULE_ID, SETTINGS.AFTER_DEPLOY, {
    name: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.name`, 'After deploying, the party marker should'),
    hint: loc(
      `${MODULE_ID}.SETTINGS.afterDeployBehavior.hint`,
      'What happens to the party token itself once its members have been placed on the scene.',
    ),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      [AFTER_DEPLOY_BEHAVIORS.KEEP]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.keep`, 'Stay on the scene'),
      [AFTER_DEPLOY_BEHAVIORS.HIDE]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.hide`, 'Be hidden'),
      [AFTER_DEPLOY_BEHAVIORS.DELETE]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.delete`, 'Be deleted'),
    },
    default: AFTER_DEPLOY_BEHAVIORS.DELETE,
  });

  s().register(MODULE_ID, SETTINGS.LAYOUT, {
    name: loc(`${MODULE_ID}.SETTINGS.deployLayout.name`, 'Deploy layout'),
    hint: loc(
      `${MODULE_ID}.SETTINGS.deployLayout.hint`,
      'How deployed tokens are arranged around the party marker.',
    ),
    scope: 'world',
    config: true,
    type: String,
    choices: {
      [DEPLOY_LAYOUTS.GRID]: loc(`${MODULE_ID}.SETTINGS.deployLayout.grid`, 'Grid'),
      [DEPLOY_LAYOUTS.LINE]: loc(`${MODULE_ID}.SETTINGS.deployLayout.line`, 'Line'),
      [DEPLOY_LAYOUTS.CIRCLE]: loc(`${MODULE_ID}.SETTINGS.deployLayout.circle`, 'Circle'),
      [DEPLOY_LAYOUTS.SCATTER]: loc(`${MODULE_ID}.SETTINGS.deployLayout.scatter`, 'Scatter'),
    },
    default: DEPLOY_LAYOUTS.GRID,
  });

  s().register(MODULE_ID, SETTINGS.SPACING, {
    name: loc(`${MODULE_ID}.SETTINGS.tokenSpacing.name`, 'Deploy spacing (grid squares)'),
    hint: loc(
      `${MODULE_ID}.SETTINGS.tokenSpacing.hint`,
      'Gap between deployed tokens, measured in grid squares. Lower values pack tokens tighter together.',
    ),
    scope: 'world',
    config: true,
    type: Number,
    range: { min: 0.5, max: 5, step: 0.25 },
    default: 1,
  });

  s().register(MODULE_ID, SETTINGS.PARTY_TOKEN_SIZE, {
    name: loc(`${MODULE_ID}.SETTINGS.partyTokenSize.name`, 'Party marker size (grid squares)'),
    hint: loc(
      `${MODULE_ID}.SETTINGS.partyTokenSize.hint`,
      'Width and height of the party marker created when a folder is dropped onto the canvas.',
    ),
    scope: 'world',
    config: true,
    type: Number,
    range: { min: 0.5, max: 4, step: 0.5 },
    default: 1,
  });

  s().register(MODULE_ID, SETTINGS.DEFAULT_IMAGE, {
    name: loc(`${MODULE_ID}.SETTINGS.defaultTokenImage.name`, 'Default party marker image'),
    hint: loc(
      `${MODULE_ID}.SETTINGS.defaultTokenImage.hint`,
      'Artwork used for newly created party markers. Pick any image from your file system or a compendium pack.',
    ),
    scope: 'world',
    config: true,
    type: String,
    filePicker: 'image',
    default: DEFAULT_TOKEN_IMAGE,
  });
}

export function getDeployOnDrop(): boolean {
  return Boolean(s().get(MODULE_ID, SETTINGS.DEPLOY_ON_DROP));
}

export function getShiftAfterDeployBehavior(): string {
  return String(s().get(MODULE_ID, SETTINGS.SHIFT_AFTER_DEPLOY) ?? AFTER_DEPLOY_BEHAVIORS.HIDE);
}

export function getIncludeSubfolders(): boolean {
  return Boolean(s().get(MODULE_ID, SETTINGS.INCLUDE_SUBFOLDERS));
}

export function getAfterDeployBehavior(): string {
  return String(s().get(MODULE_ID, SETTINGS.AFTER_DEPLOY) ?? AFTER_DEPLOY_BEHAVIORS.HIDE);
}

export function getDeployLayout(): string {
  const v = String(s().get(MODULE_ID, SETTINGS.LAYOUT) ?? DEPLOY_LAYOUTS.GRID);
  return Object.values(DEPLOY_LAYOUTS).includes(v as (typeof DEPLOY_LAYOUTS)[keyof typeof DEPLOY_LAYOUTS])
    ? v
    : DEPLOY_LAYOUTS.GRID;
}

export function getSpacing(): number {
  const v = Number(s().get(MODULE_ID, SETTINGS.SPACING));
  return Number.isFinite(v) && v > 0 ? v : 1;
}

export function getPartyTokenSize(): number {
  const v = Number(s().get(MODULE_ID, SETTINGS.PARTY_TOKEN_SIZE));
  return Number.isFinite(v) && v > 0 ? v : 1;
}

export function getDefaultTokenImage(): string {
  const v = s().get(MODULE_ID, SETTINGS.DEFAULT_IMAGE);
  return typeof v === 'string' && v.length > 0 ? v : DEFAULT_TOKEN_IMAGE;
}
