# Lucky Bastard — Astra v1

An original adult-cartoon automatic fighting survival game made with HTML, CSS, vanilla JavaScript, and Canvas 2D. Contains strong language and optional cartoon gore. Reduced Gore and Performance quality are enabled by default.

## Combat pace update

The latest build speeds up attacks, approach movement, recovery, and stamina regeneration. The four-second knockout cinematic and 15-second trivia timer retain their original timing.

## Play

Open **index.html** in a current browser. No installation, build step, server, internet connection, or external assets are needed. All artwork is drawn by the game's own Canvas code. For GitHub Pages, upload the contents of this folder and enable Pages for the containing branch.

1. Customize your fighter using the four creator tabs. Appearance does not change combat stats.
2. Choose a fighting style and starting weapon, then enter the arena.
3. Combat is automatic. Choose one of three rewards after each win. Health restores between rounds.
4. Survive 25 rounds across five environments. Bosses appear every fifth round.
5. On defeat, one 15-second trivia attempt is available per environment. A correct answer revives your fighter at 60% health. An incorrect answer or timeout ends the run. Second Wind is a separate, single-use ability.

The Training Lab offers infinite health, individual combat actions, all weapons, all special attacks, arena selection, automatic sparring, and a rare finishing attack. Reset returns both fighters to their starting positions.

Use **Pause** or **Escape** to pause combat. Sound, quality, and Reduced Gore can be changed in the pause menu. Sound is synthesized locally and starts only after a user gesture. Save & Leave stores the start-of-round build on this browser. Resume Run restarts that round. Browser storage may be unavailable in some private/file browsing configurations; normal play still works.

## Files

- `index.html`, `style.css`: interface and responsive layouts.
- `js/core.js`: constants, appearance choices, drawing utilities, preferences.
- `js/rig.js`, `faces.js`, `animation.js`: original layered character artwork, faces, poses, connected limb solving.
- `js/fighters.js`, `combat.js`, `physics.js`: fighters, autonomous decisions, contact checks, throws and finishing effects.
- `js/weapons.js`, `abilities.js`: 36 weapon designs and 30 unlockable abilities.
- `js/arenas.js`, `crowd.js`: five cached 2400 × 720 arenas and animated spectators.
- `js/dialogue.js`, `trivia.js`: 336 fighter lines, 30 crowd shouts, and exactly 1,000 generated/curated trivia records across 16 categories.
- `js/progression.js`, `game.js`, `ui.js`: survival run, rendering loop, menus, training and controls.
- `js/camera.js`, `particles.js`, `audio.js`: camera, bounded effects and synthesized sound.
- `tests/`: developer validation and test results; not required for play.

Trivia includes deterministic mathematical variants and curated factual questions; choices are shuffled on presentation. There is no instant replay, remote telemetry, asset download, or network dependency. Scenery and audience projectiles cannot remove health.

Artwork and characters are original to this project. The animated style uses hand-authored organic paths and reusable pose families, with appearance-dependent proportions and silhouettes.
