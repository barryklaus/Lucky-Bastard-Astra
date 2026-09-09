# Verification

- All 20 JavaScript files parse and initialize in a DOM/Canvas test harness.
- 1,000 unique trivia prompts with four unique choices and exactly one included answer.
- 36 distinct weapon paths, 30 abilities, 25 special sequences, 336 fighter dialogue strings, and 30 crowd shouts.
- All 36 weapon contact checks and all 25 special sequence contact checks pass.
- Autonomous fights complete across all five difficulty tiers.
- A complete 25-level run succeeds using offered rewards and allowed resurrection.
- Four-second final hold, progression, resurrection, non-damaging crowd objects, persistent detached heads, and a zero-drift planted walking foot pass simulation tests.
- Native Canvas rendering checks cover ten body/head combinations and all five complete 2400 × 720 arena backgrounds.
- Live browser checks: creator, customization tabs, training punch and kick, rare final-blow cinematic, a completed survival fight, reward selection, and progression into round two.
- Live portrait 390 × 844: scrollable creator with no horizontal overflow, full-height combat, separated speech, and training controls below the fighters.
- Live landscape 844 × 390: full fight scene and usable menus.
- Browser console reported no warnings or errors during these checks. The rolling counter displayed 60 FPS on this host. This is not a guarantee on other hardware.

The browser testing tool blocked file:// navigation. Direct double-click launch was therefore not browser-verified. The build uses classic local script files and local CSS, with no fetch, imports, installation, or network dependency. Physical Retina and 4K hardware were not available; viewport checks do not replace device testing.

The artwork uses a shared articulated rig and authored pose families. Named special attacks reuse these families; this is not a collection of independently frame-animated sequences. Trivia includes deterministic mathematical variants, and dialogue includes authored lines with alternate endings.

## Faster combat update

Attack, movement, recovery and stamina timings were retuned. All simulation checks pass after this update, including a successful 25-level run, all weapon/special contacts, planted-foot drift, and the unchanged four-second knockout hold. Across the same 30 seeded matchups, mean time to knockout changed from 28.9 seconds to 18.6 seconds. The latest timing changes have not been visually rechecked because the host Mac is locked.

## Basic math trivia update

Advanced maths has been replaced with basic arithmetic and counting. A focused trivia check verified all 1,000 unique prompts, all four-choice answer sets, all 925 numerical/counting answers independently from the question text, and draw-without-replacement behavior. Times tables use factors 1–10; division questions have whole-number answers. The 15-second timer and resurrection rules are unchanged. See `trivia-results.txt`.

## Standard gore and faster action update

Gore defaults on. Tests cover head, arm, leg, and upper-body detachment using original rig layers, source-layer removal, floor settling before the four-second hold ends, reset/restoration, guaranteed first-knockout decapitation, Reduced Gore substitutes, and bounded blood pools. A native Canvas contact sheet was visually inspected for all four finishers in flight and after landing. The 30 seeded matchups now average 14.1 seconds to knockout. All weapon and special contacts, progression, and resurrection checks still pass. The latest changes have not been rechecked in the live browser because the host Mac is locked.

## Wrist orientation and ear attachment update

Pixel checks verify that victory, open, block and relaxed hand fingers extend away from the elbow in four directions. A connected-pixel check verifies both ears across all 40 head/ear combinations. Native Canvas sheets were inspected for victory, guard, idle, punch and weapon poses with both fighter facings, and all head/ear variants. The complete existing suite passes, including all 36 weapon contacts and all 25 special contacts. Browser verification and publishing remain blocked by the locked Mac. Asset cache identifiers are now 1.0.6.

## Low-top sneakers update

All eight footwear IDs now draw low-top sneakers, including previously saved selections. Creator labels use sneaker names and the shared renderer covers fighters, spectators and detached legs. The existing native Canvas character sheet was visually inspected across all eight styles. The existing suite passes, including planted walking feet, kick and weapon contact, finishers, wrist orientation and ear attachment. Browser verification remains unavailable while the Mac is locked. Asset cache identifiers are now 1.0.7.

## Belt removal and upper-eyelid update

All waistband, belt-line and buckle artwork has been removed from the shared rig, which covers fighters, spectators and detached upper bodies. A native Canvas sheet was inspected across all ten body types, ten tops and eight bottoms. Upper eyelids now overlay the complete upper half of both eyeballs from corner to corner. A second sheet covers all six eye types across neutral, focused, angry, scared, smug and hurt states. The full validation suite passes. Asset cache identifiers are now 1.0.8.
