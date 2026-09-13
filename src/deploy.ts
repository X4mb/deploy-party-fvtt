import { FLAGS, MODULE_ID } from './constants.js';
import { actorTokenSource, flags, foldersOf, tokenCreator } from './foundryApi.js';
import {
  AFTER_DEPLOY_BEHAVIORS,
  getAfterDeployBehavior,
  getIncludeSubfolders,
  getSpacing,
  loc,
} from './settings.js';

function collectActorsInFolder(folder: Folder, recursive: boolean): Actor[] {
  const actors = [...(folder.contents as Actor[])];
  if (recursive) {
    for (const sub of foldersOf(folder).getSubfolders(true)) {
      actors.push(...(sub.contents as Actor[]));
    }
  }
  return actors;
}

/** Lay `count` items out in a square-ish grid centered on the origin, in grid-cell units. */
function computeGridOffsets(count: number): Array<{ col: number; row: number }> {
  const columns = Math.max(1, Math.ceil(Math.sqrt(count)));
  const rows = Math.ceil(count / columns);
  const offsets: Array<{ col: number; row: number }> = [];
  for (let i = 0; i < count; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    offsets.push({ col: col - (columns - 1) / 2, row: row - (rows - 1) / 2 });
  }
  return offsets;
}

export async function deployParty(tokenDoc: TokenDocument): Promise<void> {
  const folderUuid = flags(tokenDoc).getFlag(MODULE_ID, FLAGS.FOLDER_UUID) as string | undefined;
  const folder = folderUuid ? ((await fromUuid(folderUuid)) as Folder | null) : null;

  if (!(folder instanceof Folder)) {
    const name = (flags(tokenDoc).getFlag(MODULE_ID, FLAGS.FOLDER_NAME) as string | undefined) ?? tokenDoc.name ?? '';
    ui.notifications?.warn(
      loc(`${MODULE_ID}.notifications.folderMissing`, 'The source folder for "{name}" no longer exists.').replace(
        '{name}',
        name,
      ),
    );
    return;
  }

  const scene = tokenDoc.parent as Scene | null;
  if (!scene) return;

  const actors = collectActorsInFolder(folder, getIncludeSubfolders());
  if (!actors.length) {
    ui.notifications?.warn(
      loc(`${MODULE_ID}.notifications.folderEmpty`, 'The folder "{name}" has no actors to deploy.').replace(
        '{name}',
        folder.name,
      ),
    );
    return;
  }

  const grid = scene.grid as unknown as { size: number };
  const gridSize = grid.size;
  const spacing = getSpacing();
  const centerX = tokenDoc.x + (tokenDoc.width * gridSize) / 2;
  const centerY = tokenDoc.y + (tokenDoc.height * gridSize) / 2;
  const offsets = computeGridOffsets(actors.length);

  const batchId = foundry.utils.randomID();

  const tokenDataList: Record<string, unknown>[] = [];
  for (let i = 0; i < actors.length; i++) {
    const actor = actors[i];
    const offset = offsets[i];
    const targetX = centerX + offset.col * gridSize * spacing;
    const targetY = centerY + offset.row * gridSize * spacing;

    const td = await actorTokenSource(actor).getTokenDocument({ hidden: tokenDoc.hidden }, { parent: scene });

    const data = td.toObject() as Record<string, unknown>;
    const width = Number(data.width ?? 1);
    const height = Number(data.height ?? 1);
    data.x = targetX - (width * gridSize) / 2;
    data.y = targetY - (height * gridSize) / 2;
    data.flags = {
      ...(data.flags as Record<string, unknown> | undefined),
      [MODULE_ID]: {
        [FLAGS.DEPLOY_BATCH_ID]: batchId,
        [FLAGS.ORIGIN_MARKER_ID]: tokenDoc.id,
        [FLAGS.ORIGIN_FOLDER_UUID]: folder.uuid,
        [FLAGS.ORIGIN_FOLDER_NAME]: folder.name,
      },
    };
    tokenDataList.push(data);
  }

  await flags(tokenDoc).setFlag(MODULE_ID, FLAGS.LAST_DEPLOY_BATCH_ID, batchId);
  await tokenCreator(scene).createEmbeddedDocuments('Token', tokenDataList);
  await applyAfterDeployBehavior(tokenDoc);

  ui.notifications?.info(
    loc(`${MODULE_ID}.notifications.deployed`, 'Deployed {count} token(s) from "{name}".')
      .replace('{count}', String(actors.length))
      .replace('{name}', folder.name),
  );
}

async function applyAfterDeployBehavior(tokenDoc: TokenDocument): Promise<void> {
  const behavior = getAfterDeployBehavior();
  if (behavior === AFTER_DEPLOY_BEHAVIORS.DELETE) await tokenDoc.delete();
  else if (behavior === AFTER_DEPLOY_BEHAVIORS.HIDE) await tokenDoc.update({ hidden: true });
}
