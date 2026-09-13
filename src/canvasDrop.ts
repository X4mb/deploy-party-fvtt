import { createPartyTokenFromFolder, isActorFolder } from './partyToken.js';

interface DropCanvasFolderData {
  type: string;
  uuid: string;
  x: number;
  y: number;
}

/**
 * Foundry only knows how to turn a dropped "Actor" onto the canvas; dropping a "Folder"
 * does nothing by default. We intercept that case here and build a party marker instead.
 */
export function registerCanvasDrop(): void {
  Hooks.on('dropCanvasData', (_canvas: Canvas, rawData: unknown): boolean => {
    const data = rawData as DropCanvasFolderData;
    if (data?.type !== 'Folder') return true;
    void handleFolderDrop(data);
    return false;
  });
}

async function handleFolderDrop(data: DropCanvasFolderData): Promise<void> {
  const folder = (await fromUuid(data.uuid)) as unknown;
  if (!isActorFolder(folder)) return;
  await createPartyTokenFromFolder(folder, { x: data.x, y: data.y });
}
