import { deployFolderDirectly } from './deploy.js';
import { createPartyTokenFromFolder, isActorFolder } from './partyToken.js';
import { getDeployOnDrop } from './settings.js';

interface DropCanvasFolderData {
  type: string;
  uuid: string;
  x: number;
  y: number;
}

/**
 * Foundry only knows how to turn a dropped "Actor" onto the canvas; dropping a "Folder"
 * does nothing by default. We intercept that case here and either build a party marker,
 * or (if the "deploy immediately" setting is on) deploy the folder's actors right away.
 * Holding Shift while dropping inverts the setting for that one drop.
 */
export function registerCanvasDrop(): void {
  Hooks.on('dropCanvasData', (_canvas: Canvas, rawData: unknown, rawEvent: unknown): boolean => {
    const data = rawData as DropCanvasFolderData;
    if (data?.type !== 'Folder') return true;
    void handleFolderDrop(data, rawEvent as DragEvent | undefined);
    return false;
  });
}

async function handleFolderDrop(data: DropCanvasFolderData, event?: DragEvent): Promise<void> {
  const folder = (await fromUuid(data.uuid)) as unknown;
  if (!isActorFolder(folder)) return;

  const point = { x: data.x, y: data.y };
  const deployImmediately = event?.shiftKey ? !getDeployOnDrop() : getDeployOnDrop();

  if (deployImmediately) {
    await deployFolderDirectly(folder, point);
  } else {
    await createPartyTokenFromFolder(folder, point);
  }
}
