# Q3 XP Desktop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an independently runnable Q3 Vite + React challenge with an XP desktop, local artwork, and three simulated blockchain/album applications that lead to the Flag lyrics.

**Architecture:** A shared React desktop shell owns open-window and taskbar state. A typed fixture and pure state/query functions provide deterministic local address lookup, function results, balance changes, and album ownership; application components render those results without network calls.

**Tech Stack:** Node.js 24, Vite, React, TypeScript, Vitest, jsdom, React Testing Library, Testing Library user-event, Playwright.

**Spec:** docs/superpowers/specs/2026-10-02-q3-windows-xp-desktop-design.md

## Global Constraints

- All blockchain addresses, transactions, album ownership, balances, function calls, and lyrics are local simulation data; do not add RPC, wallet, signing, transaction, backend, or real-token integrations.
- Keep Q3 independently runnable from D:\_projects\fcg\q3 and do not reference Q2 paths at runtime.
- Keep existing data/, draft/, and explorer reference files intact; only copy selected source text and assets into the app.
- Put copied Q2 wallpaper and icon assets under public/imgs/.
- Preserve the intended path: challenge contract -> deployer -> A2 -> M4 title -> two benefit calls -> buy album 3 -> reveal M3 lyrics.
- Do not embed external explorer tracking, wallet-connection, or analytics scripts.
- Reset simulated challenge state on page reload; closing/reopening a window preserves it.

## Review Focus

- Case and whitespace variants of addresses resolve identically; pin this in Task 2 query tests.
- Invalid benefit passwords do not alter balance; pin this in Task 2 state tests.
- Insufficient balance does not alter album ownership; pin this in Task 2 state tests.
- Closing a window preserves challenge state; pin this in Task 3 shell tests.
- M3 lyrics remain hidden before purchase and appear after purchase; pin this in Task 4 UI tests.

---

### Task 1: Bootstrap the standalone app and copy XP assets

**Files:**
- Create: package.json, package-lock.json, .nvmrc, index.html, tsconfig.json, vite.config.ts, vitest.config.ts, playwright.config.ts
- Create: src/vite-env.d.ts, src/main.tsx, src/App.tsx, src/styles.css
- Create: tests/setup.test.ts, tests/setup.ts
- Copy: public/imgs/壁纸.jpeg, public/imgs/窗口参考图.jpg, public/imgs/图标/*, public/imgs/记忆配对/*

**Interfaces:**
- Produces scripts for dev, test, and build; src/main.tsx mounts App into #root; Vitest uses jsdom and tests/setup.ts.

- [ ] **Step 1: Install project dependencies.** Run `npm install react react-dom` and `npm install -D vite typescript @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/user-event @playwright/test` in q3. Set .nvmrc to 24 and package.json engines.node to >=24.
- [ ] **Step 2: Create project and test configuration.** Add scripts: `dev: vite`, `test: vitest run`, `test:e2e: playwright test`, `build: tsc -b && vite build`. Configure Vite React plugin, strict TypeScript, Vitest jsdom with include limited to tests/**/*.test.{ts,tsx}, Playwright Chromium with baseURL http://127.0.0.1:5173 and a managed Vite webServer, and tests/setup.ts. Add an initial smoke test that imports App and asserts it renders the desktop root.
- [ ] **Step 3: Run the scaffold test before implementing the shell.** Run: `npm test -- --run tests/setup.test.ts`. Expected: it fails because App has no desktop root yet.
- [ ] **Step 4: Create the minimal entry and App shell.** Add index.html with the Chinese title, React root in main.tsx, and an App root element. Add Vite's client type reference.
- [ ] **Step 5: Copy Q2 XP resources into Q3.** Copy from `D:\_projects\fcg\q2-copy\public\imgs` into q3 `public\imgs`; do not move or edit q2 files. Copy wallpaper, window reference image, all desktop icons, and all memory-game icons. Compare source/destination file counts.
- [ ] **Step 6: Run tests and production build.** Run: `npm test` and `npm run build`. Expected: the scaffold test and build pass.
- [ ] **Step 7: Commit the app scaffold and assets.** Commit only Q3 package/config/entry files, initial test, and public/imgs assets.

### Task 2: Implement deterministic challenge fixtures and simulation rules

**Files:**
- Create: src/types.ts, src/data/challenge.ts, src/data/contractSource.ts
- Create: src/lib/normalizeAddress.ts, src/lib/explorerLookup.ts, src/lib/albumLookup.ts, src/lib/challengeState.ts
- Create: tests/explorer-lookup.test.ts, tests/album-lookup.test.ts, tests/challenge-state.test.ts

**Interfaces:**
- `ChallengeData`: contractAddress, deployerAddress, transactionAddresses, albums, tips, benefitPassword, benefitAward, benefitMaxBalance, playerAddress, contractSource.
- `ChallengeData.transactionAddresses`: `{ a1: string; a2: string; a3: string }`.
- `ChallengeData.albums`: `{ M1: Album; M2: Album; M3: Album; M4: Album }`; Album is `{ address: string; id: number | 'M4'; name: string; artist: string; price: number; initialOwner: string; lyrics: string }`.
- `ChallengeData.tips`: `{ tip1: string; tip2: string }`.
- `ChallengeState`: `balance: number` and `albumOwners: Record<number | 'M4', string>`.
- `ExplorerResult`: `{ kind: 'contract'; address: string; deployerAddress: string } | { kind: 'account'; address: string; transactions: SimulatedTransaction[] } | { kind: 'transaction'; address: string; transactionType: 'album-purchase' | 'unknown'; albumAddress?: string } | { kind: 'not-found'; address: string }`.
- `SimulatedTransaction`: `{ address: string; transactionType: 'album-purchase' | 'unknown'; albumAddress?: string }`.
- `AlbumViewResult`: `{ kind: 'album'; album: Album; showLyrics: boolean; lyrics?: string } | { kind: 'not-found'; address: string }`.
- `ChallengeAction`: `{ type: 'benefit'; password: string } | { type: 'buy-album'; albumId: number }`.
- `ActionResult`: `{ state: ChallengeState; ok: boolean; message: string; value?: string | number }`.
- `normalizeAddress(value: string): string`.
- `lookupExplorerAddress(value: string, data: ChallengeData): ExplorerResult`.
- `lookupAlbumAddress(value: string, state: ChallengeState, data: ChallengeData): AlbumViewResult`.
- `applyChallengeAction(state: ChallengeState, action: ChallengeAction, data: ChallengeData): ActionResult`.

- [ ] **Step 1: Write query and album-access tests.** Check contract -> deployer, deployer -> exactly A1/A2/A3, A2 -> M4, A1/A3 -> unknown transaction, unrecognized address -> not found; check M1-M3 lyrics are hidden unless the player is owner and M4 title/lyrics are public. Check case and surrounding whitespace normalization.
- [ ] **Step 2: Run the focused tests and confirm missing-module failure.** Run: `npm test -- --run tests/explorer-lookup.test.ts tests/album-lookup.test.ts`. Expected: missing module or export failures.
- [ ] **Step 3: Create the fixture and player-facing contract source.** Put deterministic fictional addresses and album metadata in challenge.ts. Use exact tip messages from the approved spec. Put only the challenge-facing commented source in contractSource.ts, based on Q3's source material; do not expose the separate solved implementation from data/题目原代码.md.
- [ ] **Step 4: Implement pure address and lookup helpers.** Return explicit discriminated result variants. Make lookups case-insensitive and trim whitespace. Do not call fetch or any blockchain library.
- [ ] **Step 5: Run query tests.** Run: `npm test -- --run tests/explorer-lookup.test.ts tests/album-lookup.test.ts`. Expected: route and owner-gating tests pass.
- [ ] **Step 6: Write state transition tests.** Assert correct password adds 50, incorrect password preserves balance, two successful calls reach 100, buyAlbum(3) deducts 100 and transfers owner to player, insufficient balance changes neither balance nor owner, and an unknown album ID returns failure without state change.
- [ ] **Step 7: Implement immutable action transitions.** `applyChallengeAction` returns a new state only on success. Invalid password, unknown album, and insufficient funds return `ok: false` and unchanged state.
- [ ] **Step 8: Run all domain tests.** Run: `npm test`. Expected: all fixtures, query, album visibility, and action tests pass.
- [ ] **Step 9: Commit tested fixtures and simulation logic.** Commit only src/types.ts, src/data/*, src/lib/*, and tests/explorer-lookup.test.ts, tests/album-lookup.test.ts, tests/challenge-state.test.ts.

### Task 3: Build the reusable XP desktop and window shell

**Files:**
- Create: src/components/desktop/Desktop.tsx, DesktopIcon.tsx, Taskbar.tsx, StartMenu.tsx, WindowFrame.tsx
- Create: src/components/modules/PromptFile.tsx
- Modify: src/App.tsx, src/styles.css
- Create: tests/desktop-shell.test.tsx

**Interfaces:**
- `AppId = 'contract' | 'explorer' | 'album' | 'prompt'`.
- App owns `activeWindow: AppId | null` and shared ChallengeState.
- Desktop receives `openWindow(id: AppId)` and completed IDs; it never owns challenge data.
- WindowFrame receives `title`, `icon`, `onClose`, `children`, and optional `wide`.
- Desktop shortcut accessible names are 合约查看器, 区块链浏览器, 专辑查看器, and 题目提示.txt; WindowFrame uses role=dialog with the visible title as its accessible name.

- [ ] **Step 1: Write shell interaction tests.** Assert all shortcuts render; double-click opens the matching named dialog; close hides it; start menu can open an app; closing and reopening does not recreate/reset the shared state.
- [ ] **Step 2: Run the shell test and confirm failure.** Run: `npm test -- --run tests/desktop-shell.test.tsx`. Expected: shell interaction assertions fail.
- [ ] **Step 3: Implement App-owned window and game state.** Keep activeWindow and challenge state at App level. Pass callbacks to Desktop and application slots.
- [ ] **Step 4: Implement reusable XP shell components.** Add wallpaper desktop, icon shortcuts, taskbar buttons, start menu, titlebar window controls, close behavior, and the notepad-style prompt.
- [ ] **Step 5: Style desktop and responsive layout.** Use local assets through Vite BASE_URL. Add compact 3-column shortcuts on narrow screens, independently scrollable window content, visible focus, and no clipped controls.
- [ ] **Step 6: Run shell tests and build.** Run: `npm test -- --run tests/desktop-shell.test.tsx` and `npm run build`. Expected: tests and build pass.
- [ ] **Step 7: Commit the XP shell.** Commit only desktop components, prompt, App shell, styles, and shell test.

### Task 4: Implement the three apps and end-to-end challenge flow

**Files:**
- Create: src/components/modules/ContractViewer.tsx, BlockchainExplorer.tsx, AlbumViewer.tsx
- Modify: src/App.tsx, src/styles.css
- Create: tests/challenge-flow.test.tsx

**Interfaces:**
- ContractViewer consumes `{ data: ChallengeData; state: ChallengeState; onAction(action: ChallengeAction): ActionResult; onViewAlbumsAddress(albumId: number): string | null }`.
- BlockchainExplorer consumes `{ data: ChallengeData; onOpenAlbum(address: string): void }`.
- AlbumViewer consumes `{ data: ChallengeData; state: ChallengeState; address: string; onAddressChange(address: string): void }`.
- App applies successful actions to shared ChallengeState and passes current state to each application.
- Contract Viewer buttons are labeled 查看 tip1, 查看 tip2, 调用 benefit, 购买专辑, 查询专辑地址; Explorer and Album Viewer address fields are labeled 搜索地址.

- [ ] **Step 1: Write a complete user-flow test.** Open the dialog 合约查看器 and click 查看 tip1 and 查看 tip2; open 区块链浏览器, fill 搜索地址 with the fixture contract/deployer/A2 addresses and click 查询 at each stage; use its M4 action to open 专辑查看器; read the album title; return to 合约查看器, call benefit twice with that title, assert balance 100, and buy album 3; open M3 in 专辑查看器 and assert the Flag lyrics appear.
- [ ] **Step 2: Add failure-path assertions.** Verify wrong password leaves balance unchanged, unknown address shows not found, and insufficient balance does not reveal M3 lyrics.
- [ ] **Step 3: Run the flow test and confirm failure.** Run: `npm test -- --run tests/challenge-flow.test.tsx`. Expected: missing app behavior assertions fail.
- [ ] **Step 4: Implement Contract Viewer controls.** Render player-facing source, contract address lookup, viewTip1/viewTip2, benefit password input, buy album ID input, viewAlbumsAddress input, current balance, and local success/error results.
- [ ] **Step 5: Implement Explorer search/results.** Render address search and concise Etherscan-inspired result rows for the configured contract, deployer, transactions, and M4 link. No remote network requests.
- [ ] **Step 6: Implement Album Viewer.** Render metadata for M1-M4, unknown-address feedback, owner-gated M1-M3 lyrics, and public M4 title/lyrics.
- [ ] **Step 7: Wire applications to App state.** Successful actions update one immutable shared state; app close/reopen preserves it. Failed actions do not update it.
- [ ] **Step 8: Run full tests and production build.** Run: `npm test` and `npm run build`. Expected: full flow, failure paths, and build all pass.
- [ ] **Step 9: Commit all three applications and integration tests.** Commit only module components, App wiring, styles, and challenge-flow test.

### Task 5: Responsive polish, docs, and final acceptance

**Files:**
- Modify: src/styles.css, README.md, package.json, playwright.config.ts
- Create: tests/e2e/challenge-flow.spec.ts

**Interfaces:**
- Playwright runs Chromium against Vite at http://127.0.0.1:5173 and exercises the rendered UI at desktop and mobile viewport sizes.

- [ ] **Step 1: Add Playwright desktop acceptance.** In tests/e2e/challenge-flow.spec.ts, run the full progression using role/name selectors: open Contract Viewer and read both tips; search the contract, deployer, and A2 in Explorer; open M4; read its title; return to Contract Viewer, call benefit twice and buy album 3; open M3 and assert the flag lyric is visible.
- [ ] **Step 2: Add mobile layout acceptance.** At viewport 390x844, open each application, assert window bounds stay within the viewport, documentElement.scrollWidth is not wider than window.innerWidth, and tall window content can scroll.
- [ ] **Step 3: Add keyboard and accessible-name assertions.** Check address fields, function buttons, shortcuts, taskbar buttons, and window close buttons have accessible names and can receive keyboard focus.
- [ ] **Step 4: Polish dense application layouts.** Make source text independently scrollable; let explorer transaction rows wrap; constrain app controls to the window width at 390px viewport; keep titlebar controls visible.
- [ ] **Step 5: Document project use.** README includes npm install, npm run dev, npm test, npm run test:e2e, npx playwright install chromium, and npm run build.
- [ ] **Step 6: Run final acceptance.** Run `npm test`, `npm run build`, `npx playwright install chromium`, start `npm run dev -- --host 127.0.0.1`, run `npm run test:e2e`, then stop the server.
- [ ] **Step 7: Commit responsive polish, e2e tests, and README.** Commit only final CSS, README, package script/config, and browser test.
