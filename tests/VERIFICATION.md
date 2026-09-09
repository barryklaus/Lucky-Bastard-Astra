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

## Grapple contact and integrated shirt damage update

Both hands now lock to the opponent's animated shoulder joints throughout all six grapple motions: suplex, slam, javelin, carry, airplane spin and crowd throw. Automated checks sample four stages of every motion and report zero shoulder drift while keeping both arms within their real two-segment reach. Lift and carry placement follows the shoulder midpoint, which prevents stretched rubber arms and disconnected grips. A native Canvas contact sheet was inspected across grab, lift, carry and suplex stages.

Damaged shirts now change the torso silhouette itself. At 50% and 76% damage, the shirt hem gains progressively deeper irregular tears with edge threads; the old skin-colored patch painted over the moving shirt has been removed. The complete validation suite passes. Asset cache identifiers are now 1.0.9.

## 1,000-fight weapon balance update

The fixed-seed balance harness runs exactly 1,000 mirrored-stat fights, alternates which side owns the weapon, covers all 36 weapons, and rotates every weapon through the same body and fighting-style variants. Before correction, armed fighters won 24.4% and pole weapons won 9.0%. With cinematic timing enabled, the final run records 59.1% armed wins, 51.5% pole wins, 74.2% armed contact and a 14.1-second mean fight. A separate 1,000-fight holdout records 57.7% armed wins and 72.7% contact. Every weapon family stays within the accepted 40–78% win band in both sets. Weapon spacing now follows actual reach, visible contact checks the outer striking section rather than a single tip pixel, attack cost and cadence are proportional to output, and fighters discard weapons less often. Asset cache identifiers are now 1.0.10.

## Cinematic slow-motion update

Final blows now freeze for 140 ms, run at 7% speed through the opening impact, rise through 22% and 55% speed, then accelerate during the last 1.75 seconds so detached parts and falls still complete inside the required four-second hold. Head sway, body sway and step-back jump trigger a 22%-speed dodge window lasting 480–620 ms with a quick camera focus. Tests verify all three dodge types, the ultra-slow final opening, the unchanged four-second transition, and settled finisher physics. Asset cache identifiers are now 1.0.11.

## Spectacle systems update

Nine selected weapons route lethal hits into eight authored outcomes, including face flattening, embedded implements, chair folding, launched heads, confetti decapitation and a laser-sword waist split. A lethal combination at three or more confirmed hits activates the gold momentum camera treatment without changing the four-second final hold. Full positive popularity now starts a 2.5-second crowd takeover whose bounded projectile pool includes tomatoes, drink cups, cans and sneakers. Crowd objects only stagger and drain stamina. Training Lab controls expose all three systems directly. Automated checks cover outcome selection and artwork, momentum activation, crowd duration, its 36-object bound, and the nonlethal rule. Asset cache identifiers are now 1.0.12.

## Two-arm guard update

The neutral combat pose now places both fists beyond their shoulder silhouette and above the shoulder line, with separately solved upper arms and forearms forming a readable L guard. The rear arm stays in its correct depth layer while remaining visible outside the torso. Chaos-gremlin fighters and a stable minority of other personalities lower both hands during a brief 2.6-second brave window in an 11-second idle cycle. Automated geometry checks cover all ten body types and both facing directions, and a native Canvas contact sheet verifies the final silhouettes. Asset cache identifiers are now 1.0.13.
