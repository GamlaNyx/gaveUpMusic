# Q3 Windows XP Desktop Challenge Design

## Goal

Build the Q3 recruitment challenge as an independent Vite + React application with a Windows XP-style desktop and a reusable window interaction shell. Players investigate a fictional album store, follow simulated blockchain records, discover an album-title password, purchase the Flag album, and read its lyrics.

The Q3 directory already contains the challenge brief, a Solidity draft, lyrics, local explorer-page references, and an empty src directory. These files are source material for implementation. The explorer snapshots are visual references only; their third-party scripts and page payloads are not embedded into the challenge.

## Audience and Constraints

- Audience: recruitment-game players with little or no blockchain experience.
- The interface should explain actions in plain Chinese while allowing the contract source and function names to remain visible as clues.
- Contract calls, balances, addresses, transactions, album ownership, and lyrics are simulated locally in the browser.
- No wallet extension, real RPC endpoint, real transaction, real token, or backend is used.
- State is session-local and resets on page reload; persistence is not required for this first version.
- The application must be independently runnable from D:\_projects\fcg\q3.

## Experience Structure

### Desktop shell

The first screen is a Windows XP desktop with wallpaper, desktop shortcuts, taskbar, start button/menu, system tray, and centered application windows. Double-clicking a desktop shortcut opens its application; taskbar buttons reopen active applications; window close buttons return to the desktop.

The XP shell is shared infrastructure. Challenge applications do not own desktop/window state and communicate through explicit callbacks and shared challenge state.

### Applications

The desktop has three primary applications:

1. Contract Viewer
2. Blockchain Explorer
3. Album Viewer

The desktop may also include a short 题目提示.txt file opened in a notepad-style window. It gives the premise and basic goal without naming the password or exact address trail.

## Challenge Data and State

Keep deterministic simulated chain data separate from view components, in a typed module under src/data:

- Challenge contract address and source text.
- Deployer address.
- Three recent transaction addresses A1, A2, and A3.
- Album addresses M1, M2, M3, and M4.
- Album metadata, lyrics, initial owners, and prices.
- Tip text and simulated function behavior.

Use stable fixture strings for addresses, but clearly treat them as in-game data. A shared challenge state tracks simulated player balance, album ownership, and acquired clues. It does not persist across reloads.

The default progression is:

    Contract Viewer tips
            |
            v
    Explorer: challenge contract -> deployer -> A1/A2/A3 -> A2 -> M4
            |
            v
    Album Viewer: M4 title "Chasing summer again" reveals benefit password
            |
            v
    Contract Viewer: benefit(password) twice -> balance 100
            |
            v
    buyAlbum(3) -> Flag album owner becomes player
            |
            v
    Album Viewer: M3 -> display Flag lyrics

### Contract Viewer behavior

- Recognize only the configured challenge contract address; unknown addresses show a clear not-recognized state.
- Display the provided AlbumStore source with local syntax highlighting or a contained code viewer. Do not load data/maize.css in a way that leaks styles into the desktop shell.
- Expose interactive controls for viewTip1, viewTip2, benefit(password), buyAlbum(id), and viewAlbumsAddress(id).
- viewTip1 returns a hint that the deployer uses album titles as passwords.
- viewTip2 returns a hint that the deployer recently bought an album.
- benefit(password) succeeds only for the configured M4 album title and only while the player's balance is at or below the configured threshold; each successful call credits 50 simulated units. Invalid password and rejected calls show understandable feedback without changing state.
- buyAlbum(3) requires 100 simulated units, deducts 100 on success, and changes the Flag album owner to the simulated player. Failed calls leave the balance and ownership unchanged.
- viewAlbumsAddress(1..3) returns the configured album address for each ID.

### Blockchain Explorer behavior

- Recognize only the configured challenge contract, deployer, A1, A2, and A3 addresses.
- Searching the challenge contract displays its deployer.
- Searching the deployer displays the three recent simulated transactions.
- A1 and A3 are decoy/unknown transactions. A2 is the album purchase and links to M4.
- Searching A2 displays the M4 album contract and a link that can be copied/opened in Album Viewer.
- Other addresses show a not-recognized state. No network request is made.

### Album Viewer behavior

- Recognize M1, M2, M3, and M4 only.
- Unknown addresses show 不存在的合约地址.
- For M1-M3, always show album metadata. Show lyrics only when the simulated player is the owner; otherwise explain that the lyrics are owner-only.
- M4 displays its album title and lyrics as public information. Its title is Chasing summer again, which is the password clue for benefit.
- After successful buyAlbum(3), opening M3 displays the Flag lyrics: DLNUFCG{A_5unny_d3y_ju8t_f0r_y0u}.
- The displayed flag remains client-side challenge content and is not treated as a secret from DevTools.

## Project Structure

    q3/
      public/
        imgs/
          壁纸.jpeg
          窗口参考图.jpg
          图标/
          记忆配对/
      src/
        components/
          desktop/
          modules/
        data/
        lib/
        App.tsx
        main.tsx
        styles.css
      tests/
      docs/
        superpowers/specs/
        superpowers/plans/
      package.json
      vite.config.ts

Copy the existing Q2 XP wallpaper and icon assets into Q3's own public/imgs tree. Q3 must not reference Q2 paths at runtime. The memory-game icons may be retained in the asset bundle if desired for consistency, but the initial Q3 design has no memory game and does not display them.

Keep the existing Q3 data/, draft/, and reference files intact. Implementation may copy only the selected source text and assets needed by the app; it must not move, rename, or delete the research snapshots or Solidity drafts.

## Visual and Interaction Requirements

- Match Q2's existing XP desktop chrome, icons, wallpaper treatment, start menu, taskbar, and centered windows.
- Use responsive behavior: a compact icon grid and full-width application windows on narrow screens; avoid clipped window content.
- Window bodies scroll independently when their content exceeds viewport height.
- Keep controls keyboard accessible, with labels for address/function inputs and visible focus.
- Use concise success/error feedback adjacent to the relevant application action.
- Do not embed the full external explorer pages or copy their remote tracking, wallet-connection, or analytics scripts.

## Error and Edge Cases

- Normalize entered addresses case-insensitively and trim surrounding whitespace.
- Invalid passwords do not grant balance.
- Unknown function IDs, album IDs, and addresses produce clear local errors.
- Insufficient balance does not change ownership.
- Repeated successful benefit calls follow the configured balance guard.
- Re-opening an application reflects current in-memory challenge state.
- Closing and reopening a window does not reset the simulated challenge state.
- Full page reload resets to the initial game state.

## Verification

- npm test covers address normalization, address routing, function behavior, balance changes, ownership changes, and the full happy-path progression.
- npm run build must complete without TypeScript or bundler errors.
- Browser smoke test at desktop and mobile viewports verifies all three applications open, interact, and remain usable without overlapping or clipping.
- End-to-end acceptance: read both tips; follow challenge address to deployer, then A2 to M4; use M4 title twice with benefit; buy album 3; open M3 and reveal the flag lyrics.

## Out of Scope

- Deploying Solidity contracts or connecting to a blockchain.
- Real wallet connections, signing, RPC calls, transactions, or token balances.
- Backend services, accounts, persistence, analytics, or multiplayer.
- Publishing Q3 to GitHub Pages or another host in this implementation phase.
