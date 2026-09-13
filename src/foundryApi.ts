/**
 * Narrow, hand-written views of the Foundry API surface this module touches.
 * The published `foundry-vtt-types` package only models `flags.core` and doesn't
 * know about third-party module namespaces, so we route those calls through here
 * instead of sprinkling `as unknown as X` casts through the feature code.
 */

export type FlagHolder = {
  getFlag(scope: string, key: string): unknown;
  setFlag(scope: string, key: string, value: unknown): Promise<unknown>;
};

export function flags(doc: unknown): FlagHolder {
  return doc as unknown as FlagHolder;
}

export type EmbeddedTokenCreator = {
  createEmbeddedDocuments(embeddedName: 'Token', data: Record<string, unknown>[]): Promise<unknown[]>;
};

export function tokenCreator(scene: unknown): EmbeddedTokenCreator {
  return scene as unknown as EmbeddedTokenCreator;
}

export type ActorTokenSource = {
  getTokenDocument(data?: Record<string, unknown>, context?: { parent: unknown }): Promise<TokenDocument>;
};

export function actorTokenSource(actor: unknown): ActorTokenSource {
  return actor as unknown as ActorTokenSource;
}

export type FoldersOf = {
  getSubfolders(recursive?: boolean): Folder[];
};

export function foldersOf(folder: unknown): FoldersOf {
  return folder as unknown as FoldersOf;
}
