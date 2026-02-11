# 🌍🎵 Bud Engine

A single-file 2D web game engine with pixel physics, procedural sound, and emergent ecosystems.

## The Composition
🎮 **Play now: [https://lovejzzz.github.io/BudEngine/](https://lovejzzz.github.io/BudEngine/)**

A god-simulation where building the world = composing music. Your instrument is the Earth.

## Features
- **Pixel Physics**: 30 materials with real scientific properties — emergent reactions, no hardcoded interactions
- **Acoustic Physics**: Procedural sound from material properties via Web Audio (no audio files)
- **Living Ecosystem**: Worms, fish, bugs — creatures that eat, reproduce, die. Soil fertility, O₂/CO₂ balance, food chains
- **Biology**: Plants, vegetation, fungus, decay — the foundation of life
- **Seasons & Weather**: Spring/Summer/Fall/Winter with rain, snow, wind
- **Erosion**: Water, wind, and thermal erosion reshape terrain over geological time
- **Procedural Worlds**: Seeded generation with 7 biomes and cave systems
- **Time Acceleration**: Watch millions of years unfold — rivers carve canyons, forests cycle
- **Zero Dependencies**: Single file (bud.js), pure Canvas2D, works everywhere

## Quick Start
**Play online:** [https://lovejzzz.github.io/BudEngine/](https://lovejzzz.github.io/BudEngine/)

Or run locally — open `composition.html` in any browser (mobile or desktop). Hit 🌿 Garden for a pre-built ecosystem.

Dev sandbox: `test-pixel-physics.html`

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
