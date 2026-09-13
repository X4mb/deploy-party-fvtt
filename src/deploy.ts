import { FLAGS, MODULE_ID } from './constants.js';
import { flags } from './foundryApi.js';
import { collectActorsInFolder, spawnActorsAround } from './spawn.js';
import { AFTER_DEPLOY_BEHAVIORS, getAfterDeployBehavior, getIncludeSubfolders, loc } from './settings.js';

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
  const center = {
    x: tokenDoc.x + (tokenDoc.width * gridSize) / 2,
    y: tokenDoc.y + (tokenDoc.height * gridSize) / 2,
  };
  const batchId = foundry.utils.randomID();

  await flags(tokenDoc).setFlag(MODULE_ID, FLAGS.LAST_DEPLOY_BATCH_ID, batchId);
  await spawnActorsAround(scene, actors, center, {
    hidden: tokenDoc.hidden,
    extraFlags: () => ({
      [FLAGS.DEPLOY_BATCH_ID]: batchId,
      [FLAGS.ORIGIN_MARKER_ID]: tokenDoc.id,
      [FLAGS.ORIGIN_FOLDER_UUID]: folder.uuid,
      [FLAGS.ORIGIN_FOLDER_NAME]: folder.name,
    }),
  });
  await applyAfterDeployBehavior(tokenDoc);

  ui.notifications?.info(
    loc(`${MODULE_ID}.notifications.deployed`, 'Deployed {count} token(s) from "{name}".')
      .replace('{count}', String(actors.length))
      .replace('{name}', folder.name),
  );
}

/** Skips the marker entirely: drops every actor in `folder` straight onto the scene at `point`. */
export async function deployFolderDirectly(
  folder: Folder,
  point: { x: number; y: number },
  scene: Scene | null = (canvas?.scene as Scene | null) ?? null,
): Promise<void> {
  if (!scene) return;

  if (!game.user?.isGM) {
    ui.notifications?.warn(loc(`${MODULE_ID}.notifications.gmOnly`, 'Only the GM can do that.'));
    return;
  }

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

  await spawnActorsAround(scene, actors, point);

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
