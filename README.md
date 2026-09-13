# Deploy Party

> Drag a folder of actors onto the canvas. Right-click it. Deploy. **Minimum:** Foundry v14. Works with **any game system**.

---

## What it does

Deploy Party turns any folder in your **Actors** directory into a single, quick-to-place **party marker**:

1. **Drag** a folder (party, monster group, whatever you keep organized together) from the Actors sidebar onto the scene.
2. A single marker token appears where you dropped it, standing in for the whole folder.
3. **Right-click** the marker to open Foundry's normal Token HUD, then click the **Deploy** icon.
4. Every actor in that folder is placed onto the scene as its own token, arranged in a neat grid around the marker.

No system-specific code — it uses each actor's own prototype token, so vision, disposition, and size all come out the way that actor is already configured.

---

## Using it

| | |
| --- | --- |
| **Create a marker** | Drag any Actor folder from the sidebar onto the canvas. |
| **Deploy it** | Right-click the marker → click the people-group icon in the Token HUD. |
| **Subfolders** | Included by default — turn this off in settings if you only want the folder's direct contents. |
| **After deploying** | The marker can stay, hide, or delete itself — configurable in settings (default: hidden, so you can move it and deploy again later). |

---

## Settings (world scope, GM only)

- **Include subfolders when deploying** — also drop actors from nested subfolders.
- **After deploying, the party marker should** — stay on the scene, be hidden, or be deleted.
- **Deploy spacing** — gap between deployed tokens, in grid squares.
- **Party marker size** — width/height of the marker itself, in grid squares.
- **Default party marker image** — artwork used for new markers (defaults to a bundled icon).

---

## API

For macros or other modules:

```js
const api = game.modules.get("deploy-party").api;

// Create a marker from a folder at a canvas point
await api.createPartyTokenFromFolder(folder, { x, y });

// Deploy an existing marker's folder onto the scene
await api.deployParty(tokenDocument);
```

---

## Requirements

- **Foundry v14** or newer (manifest `minimum`)
- Any game system

---

## Install

**Foundry:** *Setup → Add-on Modules → Install Module* → paste the manifest URL. On GitHub, use the **copy** button on the code block.

```text
https://raw.githubusercontent.com/X4mb/deploy-party-fvtt/main/module.json
```

---

## Links

| | |
| --- | --- |
| **Repository** | `https://github.com/X4mb/deploy-party-fvtt` |
| **Releases** | [GitHub Releases](https://github.com/X4mb/deploy-party-fvtt/releases) (`module.zip`) |

---

## License

**PolyForm Noncommercial 1.0.0** — non-commercial use; you may modify and share for non-commercial purposes. See [`LICENSE`](LICENSE).
