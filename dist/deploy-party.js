// src/constants.ts
var MODULE_ID = "deploy-party";
var FLAGS = {
  // Set on the party marker token.
  IS_PARTY_TOKEN: "isPartyToken",
  FOLDER_UUID: "folderUuid",
  FOLDER_NAME: "folderName",
  // Set on each token spawned by a deploy, so it can find its way back.
  DEPLOY_BATCH_ID: "deployBatchId",
  ORIGIN_MARKER_ID: "originMarkerId",
  ORIGIN_FOLDER_UUID: "originFolderUuid",
  ORIGIN_FOLDER_NAME: "originFolderName"
};
var DEFAULT_TOKEN_IMAGE = `modules/${MODULE_ID}/assets/party-token.svg`;

// src/foundryApi.ts
function flags(doc) {
  return doc;
}
function tokenCreator(scene) {
  return scene;
}
function actorTokenSource(actor) {
  return actor;
}
function foldersOf(folder) {
  return folder;
}
function sceneTokens(scene) {
  return scene;
}

// src/settings.ts
function s() {
  return game.settings;
}
function loc(key, fallback) {
  const v = game.i18n?.localize(key) ?? key;
  return v === key ? fallback : v;
}
var SETTINGS = {
  DEPLOY_ON_DROP: "deployOnDrop",
  SHIFT_AFTER_DEPLOY: "shiftAfterDeployBehavior",
  INCLUDE_SUBFOLDERS: "includeSubfolders",
  AFTER_DEPLOY: "afterDeployBehavior",
  SPACING: "tokenSpacing",
  PARTY_TOKEN_SIZE: "partyTokenSize",
  DEFAULT_IMAGE: "defaultTokenImage"
};
var AFTER_DEPLOY_BEHAVIORS = {
  KEEP: "keep",
  HIDE: "hide",
  DELETE: "delete"
};
function registerModuleSettings() {
  s().register(MODULE_ID, SETTINGS.DEPLOY_ON_DROP, {
    name: loc(`${MODULE_ID}.SETTINGS.deployOnDrop.name`, "Deploy immediately on drop"),
    hint: loc(
      `${MODULE_ID}.SETTINGS.deployOnDrop.hint`,
      'When enabled, dragging a folder onto the canvas deploys every actor in it right away instead of creating a party marker to deploy later. Hold Shift while dropping to use the "Shift+Drop" marker behavior below instead of the usual one.'
    ),
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
  s().register(MODULE_ID, SETTINGS.SHIFT_AFTER_DEPLOY, {
    name: loc(`${MODULE_ID}.SETTINGS.shiftAfterDeployBehavior.name`, "Shift+Drop: party marker should instead"),
    hint: loc(
      `${MODULE_ID}.SETTINGS.shiftAfterDeployBehavior.hint`,
      'Only applies when "Deploy immediately on drop" is on and you hold Shift while dropping the folder: overrides "After deploying, the party marker should" for that one drop.'
    ),
    scope: "world",
    config: true,
    type: String,
    choices: {
      [AFTER_DEPLOY_BEHAVIORS.KEEP]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.keep`, "Stay on the scene"),
      [AFTER_DEPLOY_BEHAVIORS.HIDE]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.hide`, "Be hidden"),
      [AFTER_DEPLOY_BEHAVIORS.DELETE]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.delete`, "Be deleted")
    },
    default: AFTER_DEPLOY_BEHAVIORS.HIDE
  });
  s().register(MODULE_ID, SETTINGS.INCLUDE_SUBFOLDERS, {
    name: loc(`${MODULE_ID}.SETTINGS.includeSubfolders.name`, "Include subfolders when deploying"),
    hint: loc(
      `${MODULE_ID}.SETTINGS.includeSubfolders.hint`,
      "When enabled, Deploy also drops actors found in nested subfolders, not just the folder that was dragged onto the canvas."
    ),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
  s().register(MODULE_ID, SETTINGS.AFTER_DEPLOY, {
    name: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.name`, "After deploying, the party marker should"),
    hint: loc(
      `${MODULE_ID}.SETTINGS.afterDeployBehavior.hint`,
      "What happens to the party token itself once its members have been placed on the scene."
    ),
    scope: "world",
    config: true,
    type: String,
    choices: {
      [AFTER_DEPLOY_BEHAVIORS.KEEP]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.keep`, "Stay on the scene"),
      [AFTER_DEPLOY_BEHAVIORS.HIDE]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.hide`, "Be hidden"),
      [AFTER_DEPLOY_BEHAVIORS.DELETE]: loc(`${MODULE_ID}.SETTINGS.afterDeployBehavior.delete`, "Be deleted")
    },
    default: AFTER_DEPLOY_BEHAVIORS.DELETE
  });
  s().register(MODULE_ID, SETTINGS.SPACING, {
    name: loc(`${MODULE_ID}.SETTINGS.tokenSpacing.name`, "Deploy spacing (grid squares)"),
    hint: loc(
      `${MODULE_ID}.SETTINGS.tokenSpacing.hint`,
      "Gap between deployed tokens, measured in grid squares. Lower values pack tokens tighter together."
    ),
    scope: "world",
    config: true,
    type: Number,
    range: { min: 0.5, max: 5, step: 0.25 },
    default: 1
  });
  s().register(MODULE_ID, SETTINGS.PARTY_TOKEN_SIZE, {
    name: loc(`${MODULE_ID}.SETTINGS.partyTokenSize.name`, "Party marker size (grid squares)"),
    hint: loc(
      `${MODULE_ID}.SETTINGS.partyTokenSize.hint`,
      "Width and height of the party marker created when a folder is dropped onto the canvas."
    ),
    scope: "world",
    config: true,
    type: Number,
    range: { min: 0.5, max: 4, step: 0.5 },
    default: 1
  });
  s().register(MODULE_ID, SETTINGS.DEFAULT_IMAGE, {
    name: loc(`${MODULE_ID}.SETTINGS.defaultTokenImage.name`, "Default party marker image"),
    hint: loc(
      `${MODULE_ID}.SETTINGS.defaultTokenImage.hint`,
      "Artwork used for newly created party markers. Pick any image from your file system or a compendium pack."
    ),
    scope: "world",
    config: true,
    type: String,
    filePicker: "image",
    default: DEFAULT_TOKEN_IMAGE
  });
}
function getDeployOnDrop() {
  return Boolean(s().get(MODULE_ID, SETTINGS.DEPLOY_ON_DROP));
}
function getShiftAfterDeployBehavior() {
  return String(s().get(MODULE_ID, SETTINGS.SHIFT_AFTER_DEPLOY) ?? AFTER_DEPLOY_BEHAVIORS.HIDE);
}
function getIncludeSubfolders() {
  return Boolean(s().get(MODULE_ID, SETTINGS.INCLUDE_SUBFOLDERS));
}
function getAfterDeployBehavior() {
  return String(s().get(MODULE_ID, SETTINGS.AFTER_DEPLOY) ?? AFTER_DEPLOY_BEHAVIORS.HIDE);
}
function getSpacing() {
  const v = Number(s().get(MODULE_ID, SETTINGS.SPACING));
  return Number.isFinite(v) && v > 0 ? v : 1;
}
function getPartyTokenSize() {
  const v = Number(s().get(MODULE_ID, SETTINGS.PARTY_TOKEN_SIZE));
  return Number.isFinite(v) && v > 0 ? v : 1;
}
function getDefaultTokenImage() {
  const v = s().get(MODULE_ID, SETTINGS.DEFAULT_IMAGE);
  return typeof v === "string" && v.length > 0 ? v : DEFAULT_TOKEN_IMAGE;
}

// src/spawn.ts
function collectActorsInFolder(folder, recursive) {
  const actors = [...folder.contents];
  if (recursive) {
    for (const sub of foldersOf(folder).getSubfolders(true)) {
      actors.push(...sub.contents);
    }
  }
  return actors;
}
function computeGridOffsets(count) {
  const columns = Math.max(1, Math.ceil(Math.sqrt(count)));
  const rows = Math.ceil(count / columns);
  const offsets = [];
  for (let i = 0; i < count; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    offsets.push({ col: col - (columns - 1) / 2, row: row - (rows - 1) / 2 });
  }
  return offsets;
}
async function spawnActorsAround(scene, actors, center, options = {}) {
  const grid = scene.grid;
  const gridSize = grid.size;
  const spacing = getSpacing();
  const offsets = computeGridOffsets(actors.length);
  const tokenDataList = [];
  for (let i = 0; i < actors.length; i++) {
    const actor = actors[i];
    const offset = offsets[i];
    const targetX = center.x + offset.col * gridSize * spacing;
    const targetY = center.y + offset.row * gridSize * spacing;
    const td = await actorTokenSource(actor).getTokenDocument({ hidden: options.hidden ?? false }, { parent: scene });
    const data = td.toObject();
    const width = Number(data.width ?? 1);
    const height = Number(data.height ?? 1);
    data.x = targetX - width * gridSize / 2;
    data.y = targetY - height * gridSize / 2;
    const extra = options.extraFlags?.(actor, i);
    if (extra) {
      data.flags = {
        ...data.flags,
        [MODULE_ID]: extra
      };
    }
    tokenDataList.push(data);
  }
  await tokenCreator(scene).createEmbeddedDocuments("Token", tokenDataList);
}

// src/partyToken.ts
function isActorFolder(doc) {
  return doc instanceof Folder && doc.type === "Actor";
}
async function createPartyTokenFromFolder(folder, point, scene = canvas?.scene ?? null) {
  if (!scene) return null;
  if (!game.user?.isGM) {
    ui.notifications?.warn(loc(`${MODULE_ID}.notifications.gmOnly`, "Only the GM can do that."));
    return null;
  }
  const grid = scene.grid;
  const gridSize = grid.size;
  const size = getPartyTokenSize();
  const created = await tokenCreator(scene).createEmbeddedDocuments("Token", [
    {
      name: folder.name,
      width: size,
      height: size,
      x: point.x - size * gridSize / 2,
      y: point.y - size * gridSize / 2,
      texture: { src: getDefaultTokenImage() || DEFAULT_TOKEN_IMAGE },
      disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
      flags: {
        [MODULE_ID]: {
          [FLAGS.IS_PARTY_TOKEN]: true,
          [FLAGS.FOLDER_UUID]: folder.uuid,
          [FLAGS.FOLDER_NAME]: folder.name
        }
      }
    }
  ]);
  if (!collectActorsInFolder(folder, getIncludeSubfolders()).length) {
    ui.notifications?.warn(
      loc(
        `${MODULE_ID}.notifications.markerEmptyFolder`,
        'The folder "{name}" has no actors to deploy yet \u2014 add some (or enable subfolders) before deploying this marker.'
      ).replace("{name}", folder.name)
    );
  }
  return created[0] ?? null;
}

// src/deploy.ts
async function deployParty(tokenDoc, options = {}) {
  if (!game.user?.isGM) {
    ui.notifications?.warn(loc(`${MODULE_ID}.notifications.gmOnly`, "Only the GM can do that."));
    return;
  }
  const folderUuid = flags(tokenDoc).getFlag(MODULE_ID, FLAGS.FOLDER_UUID);
  const folder = folderUuid ? await fromUuid(folderUuid) : null;
  if (!(folder instanceof Folder)) {
    const name = flags(tokenDoc).getFlag(MODULE_ID, FLAGS.FOLDER_NAME) ?? tokenDoc.name ?? "";
    ui.notifications?.warn(
      loc(`${MODULE_ID}.notifications.folderMissing`, 'The source folder for "{name}" no longer exists.').replace(
        "{name}",
        name
      )
    );
    return;
  }
  const scene = tokenDoc.parent;
  if (!scene) return;
  const actors = collectActorsInFolder(folder, getIncludeSubfolders());
  if (!actors.length) {
    ui.notifications?.warn(
      loc(`${MODULE_ID}.notifications.folderEmpty`, 'The folder "{name}" has no actors to deploy.').replace(
        "{name}",
        folder.name
      )
    );
    return;
  }
  const grid = scene.grid;
  const gridSize = grid.size;
  const center = {
    x: tokenDoc.x + tokenDoc.width * gridSize / 2,
    y: tokenDoc.y + tokenDoc.height * gridSize / 2
  };
  const batchId = foundry.utils.randomID();
  await spawnActorsAround(scene, actors, center, {
    hidden: tokenDoc.hidden,
    extraFlags: () => ({
      [FLAGS.DEPLOY_BATCH_ID]: batchId,
      [FLAGS.ORIGIN_MARKER_ID]: tokenDoc.id,
      [FLAGS.ORIGIN_FOLDER_UUID]: folder.uuid,
      [FLAGS.ORIGIN_FOLDER_NAME]: folder.name
    })
  });
  await applyAfterDeployBehavior(tokenDoc, options.afterDeployBehavior);
  ui.notifications?.info(
    loc(`${MODULE_ID}.notifications.deployed`, 'Deployed {count} token(s) from "{name}".').replace("{count}", String(actors.length)).replace("{name}", folder.name)
  );
}
async function deployFolderDirectly(folder, point, scene = canvas?.scene ?? null, afterDeployBehavior) {
  const marker = await createPartyTokenFromFolder(folder, point, scene);
  if (!marker) return;
  await deployParty(marker, { afterDeployBehavior });
}
async function applyAfterDeployBehavior(tokenDoc, override) {
  const behavior = override ?? getAfterDeployBehavior();
  if (behavior === AFTER_DEPLOY_BEHAVIORS.DELETE) await tokenDoc.delete();
  else if (behavior === AFTER_DEPLOY_BEHAVIORS.HIDE) await tokenDoc.update({ hidden: true });
}

// src/canvasDrop.ts
function registerCanvasDrop() {
  Hooks.on("dropCanvasData", (_canvas, rawData, rawEvent) => {
    const data = rawData;
    if (data?.type !== "Folder") return true;
    void handleFolderDrop(data, rawEvent);
    return false;
  });
}
async function handleFolderDrop(data, event) {
  const folder = await fromUuid(data.uuid);
  if (!isActorFolder(folder)) return;
  const point = { x: data.x, y: data.y };
  if (getDeployOnDrop()) {
    const behavior = event?.shiftKey ? getShiftAfterDeployBehavior() : getAfterDeployBehavior();
    await deployFolderDirectly(folder, point, void 0, behavior);
  } else {
    await createPartyTokenFromFolder(folder, point);
  }
}

// src/recall.ts
function isPartyMarker(tokenDoc) {
  return Boolean(flags(tokenDoc).getFlag(MODULE_ID, FLAGS.IS_PARTY_TOKEN));
}
function isDeployedMember(tokenDoc) {
  return Boolean(flags(tokenDoc).getFlag(MODULE_ID, FLAGS.DEPLOY_BATCH_ID));
}
function findDeployedMembers(tokenDoc, scene) {
  if (isPartyMarker(tokenDoc)) {
    return sceneTokens(scene).tokens.contents.filter(
      (t) => flags(t).getFlag(MODULE_ID, FLAGS.ORIGIN_MARKER_ID) === tokenDoc.id
    );
  }
  const batchId = flags(tokenDoc).getFlag(MODULE_ID, FLAGS.DEPLOY_BATCH_ID);
  if (!batchId) return [];
  return sceneTokens(scene).tokens.contents.filter(
    (t) => flags(t).getFlag(MODULE_ID, FLAGS.DEPLOY_BATCH_ID) === batchId
  );
}
async function confirmRecall(count) {
  const result = await foundry.applications.api.DialogV2.confirm({
    window: { title: loc(`${MODULE_ID}.recall.confirmTitle`, "Recall Party") },
    content: `<p>${loc(
      `${MODULE_ID}.recall.confirmBody`,
      "Recall {count} token(s)? They will be deleted from the scene \u2014 any HP, conditions, or other changes tracked on an unlinked token will be lost."
    ).replace("{count}", String(count))}</p>`,
    rejectClose: false,
    modal: true
  });
  return result === true;
}
async function recallParty(tokenDoc) {
  if (!game.user?.isGM) {
    ui.notifications?.warn(loc(`${MODULE_ID}.notifications.gmOnly`, "Only the GM can do that."));
    return;
  }
  const scene = tokenDoc.parent;
  if (!scene) return;
  const members = findDeployedMembers(tokenDoc, scene);
  if (!members.length) {
    ui.notifications?.warn(
      loc(`${MODULE_ID}.notifications.nothingToRecall`, "Nothing from this party is currently deployed.")
    );
    return;
  }
  if (!await confirmRecall(members.length)) return;
  const grid = scene.grid;
  const gridSize = grid.size;
  let sumX = 0;
  let sumY = 0;
  for (const member of members) {
    sumX += member.x + member.width * gridSize / 2;
    sumY += member.y + member.height * gridSize / 2;
  }
  const centroid = { x: sumX / members.length, y: sumY / members.length };
  const markerId = isPartyMarker(tokenDoc) ? tokenDoc.id : flags(tokenDoc).getFlag(MODULE_ID, FLAGS.ORIGIN_MARKER_ID);
  const marker = markerId ? sceneTokens(scene).tokens.get(markerId) : void 0;
  const memberIds = members.map((m) => m.id).filter((id) => Boolean(id));
  await sceneTokens(scene).deleteEmbeddedDocuments("Token", memberIds);
  if (marker) {
    await marker.update({
      x: centroid.x - marker.width * gridSize / 2,
      y: centroid.y - marker.height * gridSize / 2,
      hidden: false
    });
  } else {
    const folderUuid = isPartyMarker(tokenDoc) ? flags(tokenDoc).getFlag(MODULE_ID, FLAGS.FOLDER_UUID) : flags(tokenDoc).getFlag(MODULE_ID, FLAGS.ORIGIN_FOLDER_UUID);
    const folder = folderUuid ? await fromUuid(folderUuid) : null;
    if (isActorFolder(folder)) {
      await createPartyTokenFromFolder(folder, centroid, scene);
    } else {
      ui.notifications?.warn(
        loc(
          `${MODULE_ID}.notifications.markerGone`,
          "The party marker and its source folder are both gone; the deployed tokens were removed without a new marker."
        )
      );
    }
  }
  ui.notifications?.info(
    loc(`${MODULE_ID}.notifications.recalled`, "Recalled {count} token(s).").replace("{count}", String(members.length))
  );
}

// src/hud.ts
function toElement(html) {
  if (html instanceof HTMLElement) return html;
  const jq = html;
  return jq?.[0] instanceof HTMLElement ? jq[0] : null;
}
function addHudButton(column, className, icon, title, onClick) {
  if (column.querySelector(`.${className}`)) return;
  const button = document.createElement("div");
  button.classList.add("control-icon", className);
  button.setAttribute("role", "button");
  button.title = title;
  button.innerHTML = `<i class="fa-solid ${icon}"></i>`;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  });
  column.appendChild(button);
}
function registerTokenHudButton() {
  Hooks.on("renderTokenHUD", (hud, html) => {
    const token = hud.object;
    const doc = token?.document;
    if (!doc || !doc.isOwner) return;
    const isMarker = isPartyMarker(doc);
    const isMember = isDeployedMember(doc);
    if (!isMarker && !isMember) return;
    const root = toElement(html);
    if (!root) return;
    const column = root.querySelector(".col.right") ?? root.querySelector(".col.left") ?? root;
    if (isMarker) {
      addHudButton(
        column,
        "deploy-party-hud-deploy",
        "fa-people-group",
        loc(`${MODULE_ID}.hud.deploy`, "Deploy party"),
        () => void deployParty(doc)
      );
    }
    addHudButton(
      column,
      "deploy-party-hud-recall",
      "fa-people-arrows",
      loc(`${MODULE_ID}.hud.recall`, "Recall party"),
      () => void recallParty(doc)
    );
  });
}

// src/module.ts
Hooks.once("init", () => {
  registerModuleSettings();
  registerCanvasDrop();
  registerTokenHudButton();
});
Hooks.once("ready", () => {
  const mod = game.modules?.get(MODULE_ID);
  if (mod) {
    mod.api = {
      deployParty,
      deployFolderDirectly,
      createPartyTokenFromFolder,
      recallParty
    };
  }
});
//# sourceMappingURL=deploy-party.js.map
