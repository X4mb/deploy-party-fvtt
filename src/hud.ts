import { FLAGS, MODULE_ID } from './constants.js';
import { deployParty } from './deploy.js';
import { flags } from './foundryApi.js';
import { loc } from './settings.js';

function toElement(html: unknown): HTMLElement | null {
  if (html instanceof HTMLElement) return html;
  const jq = html as { 0?: HTMLElement } | undefined;
  return jq?.[0] instanceof HTMLElement ? jq[0] : null;
}

/** Right-clicking a token opens the core Token HUD; we drop a "Deploy" icon into it for party markers. */
export function registerTokenHudButton(): void {
  Hooks.on('renderTokenHUD', (hud: unknown, html: unknown) => {
    const token = (hud as { object?: Token }).object;
    const doc = token?.document;
    if (!doc || !flags(doc).getFlag(MODULE_ID, FLAGS.IS_PARTY_TOKEN)) return;
    if (!doc.isOwner) return;

    const root = toElement(html);
    if (!root) return;

    if (root.querySelector('.deploy-party-hud-button')) return;

    const column = root.querySelector('.col.right') ?? root.querySelector('.col.left') ?? root;

    const button = document.createElement('div');
    button.classList.add('control-icon', 'deploy-party-hud-button');
    button.setAttribute('role', 'button');
    button.title = loc(`${MODULE_ID}.hud.deploy`, 'Deploy party');
    button.innerHTML = '<i class="fa-solid fa-people-group"></i>';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      void deployParty(doc);
    });

    column.appendChild(button);
  });
}
