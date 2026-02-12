# 🌍🎵 Bud Engine

A single-file 2D web game engine with pixel physics, procedural sound, and emergent ecosystems.

## The Composition
🎮 **Play now: [https://lovejzzz.github.io/BudEngine/](https://lovejzzz.github.io/BudEngine/)**

A god-simulation where building the world = composing music. Your instrument is the Earth.

## Features
- **Pixel Physics**: 30+ materials with real scientific properties — emergent reactions, no hardcoded interactions
- **Living Ecosystem**: Worms 🪱, fish 🐟, bugs 🐛 — visible multi-pixel creatures that eat, reproduce, and die. Soil fertility, O₂/CO₂ balance, food chains
- **Scientific Acoustic Physics**: ALL sounds derived from real physics formulas, not arbitrary frequencies. Impact sounds use f = (1/(2*L)) * sqrt(E/ρ) with actual Young's modulus and density. Water splashes use real bubble acoustics. Fire sounds from turbulent combustion. Creature bioacoustics (worms: 20-60Hz infrasound, fish: swim bladder resonance 100-500Hz, bugs: stridulation 1000-4000Hz). Sounds are what physics predicts they should be
- **Conducting Mode**: Become a god — swipe for wind, tap for rain, long-press for warmth. Shape the ecosystem with gestures
- **Biology**: Plants → vegetation → wood lifecycle. Seeds spread with wind. Decay composts into fertile soil
- **Seasons & Weather**: Spring/Summer/Fall/Winter with rain, snow, wind
- **Erosion**: Water, wind, and thermal erosion reshape terrain over geological time
- **Procedural Worlds**: Seeded generation with 7 biomes and cave systems
- **Time Acceleration**: Watch millions of years unfold — rivers carve canyons, forests cycle
- **Zero Dependencies**: Single file (bud.js), pure Canvas2D, works everywhere
- **Mobile-First**: Welcome screen, touch gestures, scrollable palette, iPhone safe areas

## Quick Start
**Play online:** [https://lovejzzz.github.io/BudEngine/](https://lovejzzz.github.io/BudEngine/)

First visit shows a welcome screen — tap to begin. The Garden ecosystem loads automatically with worms in dirt, fish in water, bugs on surfaces, and plants growing. Switch to 🎵 Conduct mode to interact with gestures.

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
- Worms: 20-60 Hz infrasound from soil displacement (barely audible)
- Fish: Swim bladder resonance 100-500 Hz, short pulsed sounds
- Bugs: Stridulation 1000-4000 Hz, rapid click series (temperature affects chirp rate via Dolbear's law)

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
