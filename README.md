# 🌍🎵 Bud Engine

A single-file 2D web game engine with pixel physics, procedural sound, and emergent ecosystems.

## The Composition
🎮 **Play now: [https://lovejzzz.github.io/BudEngine/](https://lovejzzz.github.io/BudEngine/)**

A god-simulation where building the world = composing music. Your instrument is the Earth.

## v4.6 — Phase 2+3 Redesign
**Focus: Release mode (the game), self-testing API, debug overlay**

New in v4.6:
- **Release Mode** 🚀: The core game mechanic — "Can you build a world that sustains itself after you stop touching it?" Tap RELEASE button → 3-second countdown → palette disappears, input disabled, timer counts up. If all creatures die: release FAILS (red message shows how long your world lasted). If creatures survive 5 minutes: release SUCCEEDS (green "YOUR COMPOSITION LIVES" message). Stats displayed: peak creatures, time survived, survivor types
- **Enhanced Soundscape During Release**: 2x creature sound chance — listening to your composition is the point of release mode
- **Self-Testing API**: Canvas inspection tools for AI iteration without screenshots
  - `engine.test.snapshot()` — full canvas as base64 PNG
  - `engine.test.snapshotRegion(x, y, w, h)` — region snapshot
  - `engine.test.pixelAt(x, y)` — returns `{r, g, b, a}` at canvas coordinates
  - `engine.test.creatureCount()` — returns `{worm, fish, bug, bird, ant, total}`
  - `engine.test.worldStats()` — returns `{totalCells, materials, fertility, oxygen}`
  - `engine.test.eval(code)` — evaluate code in engine context for hot reload
- **Debug Overlay**: `engine.debug.overlay` toggle shows FPS, active chunks, creature counts by type, memory usage, creature positions (tiny yellow dots). Toggle via `engine.debug.toggle()` or by tapping epoch text 3x quickly
- Release mode transforms The Composition into a complete game loop: build → release → watch → learn → iterate

## v4.5 — Phase 1 Redesign
**Focus: Trim bloat, add ants (social builders), add root systems**

New in v4.5:
- **Ants** 🐜: Social creatures that CONSTRUCT. Colony builders that carry dirt/sand, dig tunnels, cluster together into emergent colonies. Population cap: 30. Tiny high-pitched clicks (3000 Hz). Brown glow for visibility.
- **Ant Colony AI**: Ants bias movement toward nearby ants (within 10 cells), creating natural clustering. 5% chance to pick up dirt/sand, 3% chance to drop (prefers placing next to solid blocks — builds ant hills!)
- **Ant Tunneling**: 2% chance to dig through adjacent dirt, converts it to air and starts carrying
- **Root Systems**: Plants grow underground root networks (woody brown, darker than dirt). Roots spread downward/sideways through dirt, absorb water, boost fertility in 5-cell radius
- **Root Growth**: 0.5% chance per frame (2% near water), max depth 15 cells below surface plant
- **Root Death**: When plant is cut/dies, roots die after 180 frames (~3 seconds) and convert to decay — cutting down a plant kills its root system
- **TRIMMED**: Removed score system (epoch progression now purely ecosystem milestones), removed conducting mode gestures (CONDUCT button is placeholder), removed Neon Ronin demo references, removed non-ecosystem biome scenarios

## Features
- **Pixel-Art UI** (v4.4): ALL UI elements rendered as pixel art on the main canvas. No HTML overlays — everything is part of the pixel world. 3x5 bitmap font, material palette with actual material color swatches, mode buttons, HUD with creature icons, O₂ bars, health indicators, day/night icons. Material tooltips with 2-second auto-dismiss. Touch-routed through pixel UI for seamless interaction. "Everything on the UI will be pixel using our engine, no more normal buttons, this is its own world and art" — SKYX
- **Pixel Physics**: 30+ materials with real scientific properties — emergent reactions, no hardcoded interactions
- **Living Ecosystem**: Worms 🪱, fish 🐟, bugs 🐛, birds 🐦, **ants** 🐜 — visible multi-pixel creatures that eat, reproduce, and die. Soil fertility, O₂/CO₂ balance, food chains. Birds are apex predators (eat bugs, disperse seeds). **Ants are colony builders** (carry dirt, dig tunnels, construct ant hills)
- **Root Systems** (v4.5): Plants grow underground root networks (woody brown, visible). Roots spread through dirt, absorb water, boost fertility. When plant dies, roots die too — realistic plant ecology
- **Creature Glow Effect** (v4.3.2): Semi-transparent colored halos around creatures for better visibility. Worm=pink, fish=orange, bug=green, bird=blue (brighter). Makes creatures visible even in complex terrain
- **Day/Night Cycle** (v4.3): 14-minute day/night cycle with smooth sinusoidal brightness. Temperature drops at night, worms surface, bugs chirp more. Sun ☀️ and moon 🌙 indicators in HUD
- **Fertile Soil Visualization** (v4.3): Dirt color reflects fertility — rich dark-green for fertile (>0.7), grayish for depleted (<0.3). Worms enrich soil by eating decay, plants deplete it
- **Population Dynamics Graph** (v4.3): Real-time sparkline chart shows last 60 seconds of population history. Toggle with 📊 button. Worm=pink, fish=orange, bug=green, bird=blue
- **Epoch Progression** (v4.3): Genesis → Formation (terrain built) → Life (creatures survive 60s) → Civilization (50+ creatures) → Transcendence (self-sustaining 5 min)
- **Auto-Garden** (v4.3.2): Garden scenario loads automatically 1.5s after page load — every visitor starts with a living world. No more empty void on arrival
- **Pinch-to-Zoom** (v4.3.2): Mobile pinch gesture zooms camera 0.5x-3.0x. Zoom level indicator shows current scale. Explore ecosystems up close
- **Material Tooltips** (v4.3.2): Tap a material in the palette to see its name and key properties. Stone shows density/melting point, creatures show ecological role. 2-second auto-dismiss
- **Ecosystem Health Indicator** (v4.3.2): Color-coded heart ❤️ shows ecosystem balance. Green (healthy) = 3+ creature types, O₂ >60%, fertility >0.4. Yellow (stressed) = 2 types or moderate vitals. Red (dying) = <2 types or critical vitals
- **Scientific Acoustic Physics**: ALL sounds derived from real physics formulas, not arbitrary frequencies. Impact sounds use f = (1/(2*L)) * sqrt(E/ρ) with actual Young's modulus and density. Water splashes use real bubble acoustics. Fire sounds from turbulent combustion. Creature bioacoustics (worms: 20-60Hz infrasound, fish: swim bladder resonance 100-500Hz, bugs: stridulation 1000-4000Hz, birds: high-pitched tweets 2000Hz, **ants: tiny clicks 3000Hz**). Sounds are what physics predicts they should be
- **Biology**: Plants → vegetation → wood lifecycle. Seeds spread with wind (and by birds). Decay composts into fertile soil
- **Seasons & Weather**: Spring/Summer/Fall/Winter with rain, snow, wind
- **Erosion**: Water, wind, and thermal erosion reshape terrain over geological time
- **Procedural Worlds**: Seeded generation with 7 biomes and cave systems
- **Time Acceleration**: Watch millions of years unfold — rivers carve canyons, forests cycle
- **Zero Dependencies**: Single file (bud.js), pure Canvas2D, works everywhere
- **Mobile-First**: Welcome screen, touch gestures, scrollable palette, iPhone safe areas

## Quick Start
**Play online:** [https://lovejzzz.github.io/BudEngine/](https://lovejzzz.github.io/BudEngine/)

First visit shows a welcome screen — tap to begin. The Garden ecosystem loads automatically (v4.3.2: now on EVERY page load, not just first visit) with worms in dirt, fish in water, bugs on surfaces, birds flying above, **ants building colonies on the dirt surface**, and plants growing **underground root systems**. Creatures now have glowing halos for visibility. Tap materials in the palette to see tooltips with properties. Watch the colored heart ❤️ indicator to monitor ecosystem health. Pinch to zoom on mobile. Observe the day/night cycle (14 min), dirt color changing as worms enrich it, **root networks spreading underground**, **ants carrying dirt to build ant hills**, and population dynamics in the 📊 sparkline graph.

Or run locally — open `composition.html` in any browser (mobile or desktop).

Dev sandbox: `test-pixel-physics.html`

## Acoustic Physics — "Think the sound that makes sense scientifically"
Every sound in Bud Engine is derived from real physics, not arbitrary frequency ranges:

**Impact Sounds** — Real physics formula: `f = (1/(2*L)) * sqrt(E/ρ)`
- Stone impact = high frequency ring (high Young's modulus, high density)
- Dirt impact = low dull thud (low Young's modulus, medium density)
- Decay time from material dampening property

**Water/Liquid Sounds** — Real bubble acoustics: `f = (1/r) * sqrt(3*gamma*P/rho_water)`
- Bubble radius 1-5mm → frequency 650-3250 Hz
- Multiple bubbles with slight variations = natural splash
- Flow sounds: low-frequency rumble from turbulent flow

**Fire/Combustion** — Turbulent combustion physics
- Broadband noise filtered through bandpass
- Center frequency scales with temperature (hotter = higher freq)
- Crackling: random impulses from wood popping (rapid thermal expansion)

**Chemical Reactions** — Exothermic reactions create thermal expansion → pressure waves
- Acid + metal: high-frequency hiss (hydrogen gas release)
- Water + lava: explosive pop + sustained steam hiss
- Reaction energy scales amplitude

**Creature Bioacoustics** — Real biology:
- Worms: 20-60 Hz infrasound from soil displacement (barely audible, move faster at night)
- Fish: Swim bladder resonance 100-500 Hz, short pulsed sounds
- Bugs: Stridulation 1000-4000 Hz, rapid click series (temperature affects chirp rate via Dolbear's law)
- Birds (v4.3): High-pitched tweets 2000 Hz, fly horizontally with slight vertical drift, glide down gradually, RARE (max 10 population cap), disperse plant seeds
- **Ants (v4.5)**: Tiny high-pitched clicks 3000 Hz (resonance dampening 0.8), colony builders that carry dirt/sand and construct ant hills, cluster together using emergent colony AI

All frequencies calculated from material properties: `youngsModulus`, `density`, `dampening`, `speedOfSound`, `acousticImpedance`. The Composition sounds like Earth should.

## For AI Developers
Full testing API:
- `engine.test.loadScenario(name)` — load scenarios
- `engine.test.step(n)` — advance simulation
- `engine.test.snapshot()` — capture canvas
- `engine.test.getPhysicsState()` — query state
- `engine.test.generateWorld(seed, biome)` — procedural generation
- `engine.debug.*` — overlay, logging, property watching

## Tech
- Single file: `bud.js` (~12000 lines, zero deps)
- Canvas2D rendering
- Web Audio API procedural synthesis
- Works on iPhone Safari, Chrome, Firefox, Edge

## License
MIT
