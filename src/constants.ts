export const MODULE_ID = 'deploy-party';

/** Token flags namespace: deploy-party.<key> */
export const FLAGS = {
  // Set on the party marker token.
  IS_PARTY_TOKEN: 'isPartyToken',
  FOLDER_UUID: 'folderUuid',
  FOLDER_NAME: 'folderName',

  // Set on each token spawned by a deploy, so it can find its way back.
  DEPLOY_BATCH_ID: 'deployBatchId',
  ORIGIN_MARKER_ID: 'originMarkerId',
  ORIGIN_FOLDER_UUID: 'originFolderUuid',
  ORIGIN_FOLDER_NAME: 'originFolderName',
} as const;

export const DEFAULT_TOKEN_IMAGE = `modules/${MODULE_ID}/assets/party-token.svg`;
