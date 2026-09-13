export const MODULE_ID = 'deploy-party';

/** Token flags namespace: deploy-party.<key> */
export const FLAGS = {
  IS_PARTY_TOKEN: 'isPartyToken',
  FOLDER_UUID: 'folderUuid',
  FOLDER_NAME: 'folderName',
} as const;

export const DEFAULT_TOKEN_IMAGE = `modules/${MODULE_ID}/assets/party-token.svg`;
