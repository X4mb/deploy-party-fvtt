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
  INCLUDE_SUBFOLDERS: 'includeSubfolders',
  AFTER_DEPLOY: 'afterDeployBehavior',
  SPACING: 'tokenSpacing',
  PARTY_TOKEN_SIZE: 'partyTokenSize',
  DEFAULT_IMAGE: 'defaultTokenImage',
} as const;

export const AFTER_DEPLOY_BEHAVIORS = {
  KEEP: 'keep',
  HIDE: 'hide',
  DELETE: 'delete',
} as const;

export function registerModuleSettings(): void {
  s().register(MODULE_ID, SETTINGS.DEPLOY_ON_DROP, {
    name: loc(`${MODULE_ID}.SETTINGS.deployOnDrop.name`, 'Deploy immediately on drop'),
    hint: loc(
      `${MODULE_ID}.SETTINGS.deployOnDrop.hint`,
      'When enabled, dragging a folder onto the canvas deploys every actor in it right away instead of creating a party marker to deploy later.',
    ),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
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
    default: AFTER_DEPLOY_BEHAVIORS.HIDE,
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

export function getIncludeSubfolders(): boolean {
  return Boolean(s().get(MODULE_ID, SETTINGS.INCLUDE_SUBFOLDERS));
}

export function getAfterDeployBehavior(): string {
  return String(s().get(MODULE_ID, SETTINGS.AFTER_DEPLOY) ?? AFTER_DEPLOY_BEHAVIORS.HIDE);
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
