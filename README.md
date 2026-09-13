# Deploy Party

> Drag a folder of actors onto the canvas. Right-click it. Deploy. **Minimum:** Foundry v14. Works with **any game system**.

## What it does

1. **Drag** an Actor folder from the sidebar onto the scene → a single **party marker** token appears.
2. **Right-click** the marker → click **Deploy** in the Token HUD → every actor in that folder is placed as its own token, arranged around the marker.
3. **Right-click** the marker or any deployed token → click **Recall** to remove the deployed tokens and bring the marker back (reusing it if it's still around, rebuilding it from the folder if not).

Each actor uses its own prototype token, so vision, disposition, and size come out the way that actor is already configured — no system-specific code.

## Settings (world scope, GM only)

- **Include subfolders when deploying**
- **After deploying, the party marker should** — stay, hide, or delete (default: hidden)
- **Deploy spacing** and **party marker size** (grid squares)
- **Default party marker image**

## API

```js
const api = game.modules.get("deploy-party").api;

await api.createPartyTokenFromFolder(folder, { x, y }); // create a marker
await api.deployParty(tokenDocument);                   // deploy its folder
await api.recallParty(tokenDocument);                   // undo a deploy
```

## Install

```text
https://raw.githubusercontent.com/X4mb/deploy-party-fvtt/main/module.json
```

Foundry: *Setup → Add-on Modules → Install Module* → paste the manifest URL above.

## Links

- **Repository:** https://github.com/X4mb/deploy-party-fvtt
- **Releases:** https://github.com/X4mb/deploy-party-fvtt/releases (`module.zip`)

## License

**PolyForm Noncommercial 1.0.0** — non-commercial use; modify and share freely. See [`LICENSE`](LICENSE).
