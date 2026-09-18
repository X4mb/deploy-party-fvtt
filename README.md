# Deploy Party

> Drag a folder of actors onto the canvas. Right-click it. Deploy. **Minimum:** Foundry v14. Works with **any game system**.

## What it does

1. **Drag** an Actor folder from the sidebar onto the scene → a single **party marker** token appears.
2. **Right-click** the marker → click **Deploy** in the Token HUD → every actor in that folder is placed as its own token, arranged around the marker in your chosen **Deploy layout** (grid, line, circle, or scatter).
3. **Right-click** the marker or any deployed token → click **Recall** to remove the deployed tokens and bring the marker back (reusing it if it's still around, rebuilding it from the folder if not).

Deploy is safe to click again on a marker that's already out: it only spawns actors from the folder that aren't currently deployed under that marker, so adding a new member to the folder and hitting Deploy again just tops up the party instead of duplicating everyone.

Each actor uses its own prototype token, so vision, disposition, and size come out the way that actor is already configured — no system-specific code.

Prefer to skip the marker? Turn on **Deploy immediately on drop** and dragging a folder deploys it straight away, then applies **After deploying, the party marker should** to decide the marker's fate. Hold **Shift** while dropping to use **Shift+Drop: party marker should instead** for that one drop — e.g. normally delete the marker, but Shift-drop to keep it around hidden for a quick recall later.

## Settings (world scope, GM only)

- **Deploy immediately on drop** — skip the marker; deploy the folder as soon as it's dropped
- **Shift+Drop: party marker should instead** — overrides the setting below for one Shift-held drop (default: hidden)
- **Include subfolders when deploying**
- **After deploying, the party marker should** — stay, hide, or delete (default: deleted)
- **Deploy layout** — grid, line, circle, or scatter (default: grid)
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
