# Volyx Lens: Femi Jimoh's fork

This repository is a fork of **[Volyx Lens](https://github.com/dk3yyyy/volyx-lens)**, created and maintained by **[dk3yyyy](https://github.com/dk3yyyy)** (VolyxAI). The original app, its architecture, and almost all of its code are their work.

This fork is maintained by **Femi Jimoh** ([FemiDev10](https://github.com/FemiDev10)). It customises the overlay's interface and controls for personal use. It is not an official Volyx Lens release, and the original author has not endorsed it.

Volyx Lens is licensed under the [Apache License 2.0](LICENSE.md). This fork keeps that licence. The files changed here are listed below, as section 4(b) of the licence requires.

---

## What this fork changes

All changes are on `main`. Each one is a separate commit after upstream commit `e61e1a7`.

### 1. Shortcuts

| Shortcut | Action | Notes |
|---|---|---|
| `⌘\` | Hide or show the overlay | New. While the overlay is hidden, every other shortcut except Quit is released, so `⌘↵`, `⌘S` and `⌘`+arrows work normally in other apps. |
| `⌘↑` `⌘↓` `⌘←` `⌘→` | Nudge the overlay 60 px | New. Each press moves the window one step, clamped to the screen. |
| `⌘↵` | Assist | Unchanged. |
| `⌘S` | Solve screen | Changed from `⌘H`. |
| `⌘⇧C` | Add the current screen to Task Context | Unchanged. |
| `⌘⇧X` | Stop everything and quit | Unchanged. |

- **Files:** `main.js` (`DEFAULT_SHORTCUT_DEFS`, `shortcutDefinitions()`, `nudgeWindow()`, `toggleOverlayVisibility()`), `src/shortcut-defaults.js`, `src/shortcut-registry.js` (new `release()`).
- **Trade-off:** while the overlay is visible, these keys are global. `⌘S` doesn't save, and `⌘`+arrows don't move the text cursor in other apps. Press `⌘\` to hide the overlay and get them back.

### 2. Overlay redesign

- **Pill:** reduced to three controls: logo, Hide, Listen.
- **Action row:** reduced to the four AI actions: Assist · What should I say? · Follow-up questions · Recap.
- **"…" menu:** New session, Session context, Task Context, History, the Assist context picker, Settings, Quit, and Home. Quit used to sit next to Stop.
- **Composer:** new placeholder text, a round blue send button with an up-arrow icon, and `aria-pressed` on the Smart toggle.
- **UX fixes:**
  - Focus rings restored on the selects and inputs.
  - No hover effect on disabled buttons.
  - Hit targets of at least 28 px.
  - New session and Recap now use different icons.
- **Files:** `renderer/index.html`, `renderer/styles.css` ("Cluely-style overlay" section at the end), `renderer/renderer.js`, `renderer/icons.js`.

### 3. Mono theme

- A new black-and-white accent theme, `mono`, alongside Indigo, Sage and Ember.
- Pick it in **Settings → Appearance**. Sage is still the code default.
- **Files:** `src/appearance-themes.js`, `renderer/theme-boot.js`, `renderer/styles.css`, `renderer/index.html`.

### 4. Session history list

- The History panel groups sessions under day headers.
- Each row shows the session title, a duration chip such as `24:05`, and the start time such as `8:24am`.
- **Files:** `renderer/renderer.js` (`historyDayLabel`, `historyClock`, `historyDuration`, `historySessionTitle`), `renderer/styles.css`.

### 5. Home window

- A normal window that opens at launch and from **… → Home · all sessions**.
- It has a Start/Stop Listening button, a search box, and every saved session grouped by Today / Yesterday / date.
- Clicking a session opens it in the overlay.
- It uses its own narrow preload. It may only list sessions, toggle Listening and ask the overlay to open a session. Every `home:*` IPC call checks that it comes from the Home window.
- **Files:** `renderer/home.html`, `renderer/home.css`, `renderer/home.js`, `home-preload.js`, `main.js` ("home window" section), `package.json` (`home-preload.js` added to the build files).

### 6. Per-session context

- Open **… → Session context** to give the current session a name and notes, such as the role, company, people or agenda.
- **How answers use it:** the main process adds it to answer requests as fenced, untrusted reference data, ahead of the resume and job-description documents (`withSessionContext()`).
- **Saving and clearing:** it's stored on the saved history record (`title`, `sessionContext`) and cleared by New session.
- **Files:** `main.js`, `preload.js`, `src/meeting-store.js`, `renderer/index.html`, `renderer/renderer.js`, `renderer/styles.css`, `tests/session-context.test.js`.

### Tests

- `npm test` runs the full suite (`node --test`), and it passes.
- Tests that asserted the old layout or the old `⌘H` default were updated.
- `tests/session-context.test.js` was added.

---

## Run, build and install

Requires Node 22 or newer, on macOS (Apple silicon).

```bash
npm install
npm start          # run from source
npm test           # run the test suite
```

To build the app and install it in `/Applications` (unsigned, ad-hoc signed locally), quit Volyx Lens first (`⌘⇧X`), then run:

```bash
CSC_IDENTITY_AUTO_DISCOVERY=false npm run pack
codesign --force --deep -s - "dist/mac-arm64/Volyx Lens.app"
rm -rf "/Applications/Volyx Lens.app"
ditto "dist/mac-arm64/Volyx Lens.app" "/Applications/Volyx Lens.app"
```

After a rebuild, macOS may ask again for Microphone, Screen & System Audio Recording, and Keychain access.

Provider setup is the same as upstream: **Settings → Providers**, pick a provider, paste its API key, then **Use as default**.

---

## Keeping up with the original project

`origin` is this fork. `upstream` is the original repository.

```bash
git fetch upstream
git merge upstream/main     # resolve any conflicts, then run npm test
git push origin main
```

To offer a change back to the original author, open a pull request from a branch on this fork to `dk3yyyy/volyx-lens`. The original author decides whether to accept it.

---

## Notes for whoever works on this next

- **Main process:** `main.js` holds the windows, IPC, shortcuts, capture and answer requests. Search for the section comments, such as `// -------- home window --------` and `// -------- shortcuts --------`.
- **Overlay UI:** `renderer/index.html` and `renderer/renderer.js`.
- **Home UI:** `renderer/home.*`.
- **Trusted IPC:** the overlay window only accepts IPC through `handleTrusted` / `onTrusted`. The Home window uses `handleHome`. Keep new IPC channels behind one of these.
- **Adding a shortcut:** add it to both `DEFAULT_SHORTCUT_DEFS` in `main.js` and `src/shortcut-defaults.js`, then give it a handler in `shortcutDefinitions()`.
- **Before committing:** run `npm test`, and update this file when the fork changes.
- **Responsible use:** as upstream says, the capture protection is a privacy safeguard, not a way to hide use. Disclose AI assistance wherever it's required.
