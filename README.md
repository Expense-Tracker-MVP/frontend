# 💰 Expense Tracker (Electron + React + Vite + TypeScript)

A cross-platform desktop application for tracking personal expenses. It uses a modern frontend stack (React + Vite + TypeScript) bundled into a desktop app using Electron and packaged via `electron-builder` for Windows, macOS, and Linux.

## Table of contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick start (dev)](#quick-start-dev)
- [Available scripts](#available-scripts)
- [Build & distribution](#build--distribution)
- [Packaging notes (electron-builder)](#packaging-notes-electron-builder)
- [Troubleshooting & tips](#troubleshooting--tips)
- [Contributing](#contributing)
- [License](#license)

## Tech stack

- React 19 + Vite 7
- TypeScript across renderer and Electron main process
- Electron 39 as the desktop runtime
- electron-builder for creating OS installers/bundles
- ESLint + typescript-eslint for linting

## Prerequisites

- Node.js (LTS recommended, v18+ or as required by your environment)
- npm (comes with Node.js) or an alternative package manager
- On Windows: PowerShell is fine (this README uses PowerShell command examples)

If you plan to create installers you may also need platform-specific tooling (code signing, notarization keys) — these are optional for local testing.

## Quick start (dev)

```powershell
npm install
npm run transpile:electron
npm run build
npm run dev:electron
```

Notes:
- `dev:electron` launches Electron pointing to `dist-react` folder;

## Available scripts

Below are the scripts defined in `package.json` and what they do:

- `npm run dev:react` — Start the Vite dev server for the renderer (React).
- `npm run dev:electron` — Start the Electron process (main). Run this after `dev:react` in a second terminal.
- `npm run build` — Runs `tsc -b` (build TypeScript projects) and `vite build` to create a production renderer build (output in `dist-react/`).
- `npm run lint` — Run ESLint over the workspace.
- `npm run preview` — Serve the built production frontend locally for quick checks (`vite preview`).
- `npm run transpile:electron` — Transpile Electron main process TypeScript files using the electron-specific tsconfig at `src/electron/tsconfig.json` (output goes to `dist-electron/main.js` as configured).
- `npm run dist:win` — Helper that transpiles the Electron code, builds the renderer, then runs `electron-builder --win --x64` to build Windows installer/artifacts.
- `npm run dist:mac` — Same as above, but targets macOS ARM64 (`--mac --arm64`).
- `npm run dist:linux` — Same flow but targets Linux x64.

## Build & distribution

Typical packaging flow (what the `dist:*` scripts do):

1. Transpile the Electron main process TypeScript into JavaScript (`npm run transpile:electron`). This writes to `dist-electron/` (see `main` in `package.json`).
2. Build the frontend (renderer) with Vite (`npm run build`), producing `dist-react/` with an optimized bundle and `index.html`.
3. Run `electron-builder` to package both pieces into platform installers or distributables.

Output summary (project defaults in this repo):

- Renderer build: `dist-react/`
- Electron main: `dist-electron/main.js`
- Packaged installers/artifacts: created by `electron-builder` in the repository root's `dist` (or as configured by `electron-builder` settings / `electron-builder.json`).

Example (Windows build):

```powershell
npm run transpile:electron; npm run build; electron-builder --win --x64
```

Note: running `npm run dist:win` bundles these three steps into a single command.

## Packaging notes (electron-builder)

- The project includes an `electron-builder.json` at the repo root. Adjust it for app name, icons, signing, and other platform-specific options before publishing real releases.
- For macOS distribution or signing you may need an Apple Developer ID and notarization steps (outside the scope of this README).
- For Windows code signing you'll need a certificate and related configuration; unsigned builds will show warnings on some platforms.

## Troubleshooting & tips

- If there are issues running `npm run dist:*` commands:
-- Ensure the terminal has admin privileges

## License

This project is licensed under the MIT License — see the included `LICENSE` file for details.
