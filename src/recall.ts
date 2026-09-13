import { FLAGS, MODULE_ID } from './constants.js';
import { flags, sceneTokens } from './foundryApi.js';
import { createPartyTokenFromFolder, isActorFolder } from './partyToken.js';
import { loc } from './settings.js';

export function isPartyMarker(tokenDoc: TokenDocument): boolean {
  return Boolean(flags(tokenDoc).getFlag(MODULE_ID, FLAGS.IS_PARTY_TOKEN));
}

export function isDeployedMember(tokenDoc: TokenDocument): boolean {
  return Boolean(flags(tokenDoc).getFlag(MODULE_ID, FLAGS.DEPLOY_BATCH_ID));
}

/**
 * Undoes a deploy: deletes every token spawned in the same batch as `tokenDoc` (which may be
 * the party marker itself, or one of the deployed members) and brings the marker back —
 * reusing it in place if it's still on the scene, otherwise recreating one from the source folder.
 */
export async function recallParty(tokenDoc: TokenDocument): Promise<void> {
  const scene = tokenDoc.parent as Scene | null;
  if (!scene) return;

  const batchId = (
    isPartyMarker(tokenDoc)
      ? flags(tokenDoc).getFlag(MODULE_ID, FLAGS.LAST_DEPLOY_BATCH_ID)
      : flags(tokenDoc).getFlag(MODULE_ID, FLAGS.DEPLOY_BATCH_ID)
  ) as string | undefined;

  const members = batchId
    ? sceneTokens(scene).tokens.contents.filter(
        (t) => flags(t).getFlag(MODULE_ID, FLAGS.DEPLOY_BATCH_ID) === batchId,
      )
    : [];

  if (!members.length) {
    ui.notifications?.warn(
      loc(`${MODULE_ID}.notifications.nothingToRecall`, 'Nothing from this party is currently deployed.'),
    );
    return;
  }

  const grid = scene.grid as unknown as { size: number };
  const gridSize = grid.size;
  let sumX = 0;
  let sumY = 0;
  for (const member of members) {
    sumX += member.x + (member.width * gridSize) / 2;
    sumY += member.y + (member.height * gridSize) / 2;
  }
  const centroid = { x: sumX / members.length, y: sumY / members.length };

  const markerId = isPartyMarker(tokenDoc)
    ? tokenDoc.id
    : (flags(tokenDoc).getFlag(MODULE_ID, FLAGS.ORIGIN_MARKER_ID) as string | undefined);
  const marker = markerId ? sceneTokens(scene).tokens.get(markerId) : undefined;

  const memberIds = members.map((m) => m.id).filter((id): id is string => Boolean(id));
  await sceneTokens(scene).deleteEmbeddedDocuments('Token', memberIds);

  if (marker) {
    await marker.update({
      x: centroid.x - (marker.width * gridSize) / 2,
      y: centroid.y - (marker.height * gridSize) / 2,
      hidden: false,
    });
  } else {
    const folderUuid = (
      isPartyMarker(tokenDoc)
        ? flags(tokenDoc).getFlag(MODULE_ID, FLAGS.FOLDER_UUID)
        : flags(tokenDoc).getFlag(MODULE_ID, FLAGS.ORIGIN_FOLDER_UUID)
    ) as string | undefined;
    const folder = folderUuid ? ((await fromUuid(folderUuid)) as unknown) : null;
    if (isActorFolder(folder)) {
      await createPartyTokenFromFolder(folder, centroid, scene);
    } else {
      ui.notifications?.warn(
        loc(
          `${MODULE_ID}.notifications.markerGone`,
          'The party marker and its source folder are both gone; the deployed tokens were removed without a new marker.',
        ),
      );
    }
  }

  ui.notifications?.info(
    loc(`${MODULE_ID}.notifications.recalled`, 'Recalled {count} token(s).').replace('{count}', String(members.length)),
  );
}
