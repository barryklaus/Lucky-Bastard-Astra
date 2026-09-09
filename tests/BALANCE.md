# Weapon balance study

The test runs exactly 1,000 autonomous fights at 60 simulation steps per second. Each fight uses mirrored health, damage, defense, speed, body, height and fighting style. The only combat difference is that one fighter starts with one of the 36 weapons. Armed ownership alternates between the left and right fighter, and every weapon is sampled across the same rotating body and style set.

| Metric | Before | After |
| --- | ---: | ---: |
| Armed win rate | 24.4% | 59.1% |
| Unarmed win rate | 75.6% | 40.9% |
| Armed contact rate | 56.5% | 74.2% |
| Unarmed contact rate | 73.3% | 71.9% |
| Mean fight time | 15.0 s | 14.1 s |
| Pole-family win rate | 9.0% | 51.5% |
| Pole-family contact rate | 21.8% | 70.4% |

The original imbalance came from three mechanics working together: weapons used a fixed preferred range regardless of their reach, collision checked only the exact weapon tip, and armed attacks spent more time and stamina than their damage justified. Fighters also discarded weapons too often.

The corrected game derives fighting distance from the fighter's arm and equipped weapon, checks contact along the outer striking section visible on screen, shortens weapon recovery, reduces weapon stamina cost, and makes voluntary throws less common. Weapon damage was then compressed to prevent the contact fix from making the armed side overwhelming.

The accepted balance bands are 54–65% overall armed wins, 40–78% wins for every weapon family, at least 68% armed contact, and under 18 seconds average fight time. The final seeded run passes all four gates. A second 1,000-fight holdout using untouched random seeds also passes, with 57.7% armed wins and 72.7% armed contact. Full per-family and per-weapon results are stored in `balance-results.json` and `balance-holdout-results.json`.
