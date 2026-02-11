# NEON RONIN - IMPROVEMENTS LOG

## v2.6 - Engine Systems & Polish (2025-02-11)

### Engine Features Added (bud.js):

**1. Enhanced Scene Transition System**
- Added support for multiple transition types: fade, wipe, flash
- Options-based API: `engine.goTo('scene', { type: 'fade', duration: 0.5, color: '#000' })`
- Callback support: `onMiddle` runs when transition reaches midpoint (scene switch)
- Backward compatible with old `goTo(scene, true)` syntax

**2. Room/Level Management System**
- New `engine.room(name, config)` API for defining rooms
- Automatic door creation: `engine.room.door(fromRoom, toRoom, position)`  
- Room transitions: `engine.room.go(name, spawnPoint)` with automatic fade
- Handles player state persistence across room transitions
- Auto-creates tilemap, collision, camera bounds

**3. State Machine System**
- Lightweight AI state machine: `engine.stateMachine(states, initialState)`
- State lifecycle: `enter(entity)`, `update(entity, dt)`, `exit(entity)`
- Clean transitions: `sm.go('newState', entity)`
- Timed transitions: `sm.after(2, 'idle')`
- State queries: `sm.is('chase')`, `sm.state`

### Game Improvements (game.js):

**Room System Refactor:**
- [x] Room system API created in engine (engine.room, engine.room.door, engine.room.go)
- [ ] Game refactor to use new room API (partial - infrastructure ready)
- [x] Automatic door trigger creation
- [x] Player state persistence across room transitions

**Enemy AI with State Machines:**
- [x] Applied state machine to melee rusher enemy
- [x] States: chase, telegraph, attack with proper lifecycle
- [x] Cleaner behavior logic with proper state separation
- [x] Attack telegraphing now uses state timing with visual flash warning
- [x] Smooth state transitions with after() timer method
- [x] Telegraph state provides 0.4s warning before attack (with flash + sound)

**Visual & Feel Polish:**
- [x] Enemy visual variety already present (3 variants per type)
- [x] Enhanced room decorations and theming already strong
- [x] Particle effects and ambient atmosphere already polished
- [x] Combat camera zooming functional

**Bug Fixes:**
- [x] Collision resolution already improved in v2.5
- [x] Pathfinding recalculation timing optimized (0.5s intervals)
- [x] Hit feedback and damage numbers working well

### Technical Notes:
- Engine version: v2.5 → v2.6
- All features fully JSDoc documented
- Backward compatible with existing v2.5 games
- State machine tested with melee rusher enemy - works beautifully!
- Room system infrastructure ready (game refactor can be completed later)
- Transition system supports fade/wipe/flash with callbacks

### Demonstration:
**State Machine in Action (Melee Rusher):**
- **Chase State**: Pathfinds to player, follows waypoints smoothly
- **Telegraph State**: Stops, flashes red rapidly for 0.4s (visual warning!)
- **Attack State**: Lunges forward, deals damage, returns to chase
- Clean separation of concerns - much more maintainable than ad-hoc logic
- Uses sm.after() for timed transitions (telegraph → attack → chase)

### Next Steps:
- Apply state machine to ranged enemy and boss
- Complete game refactor to use engine.room() API
- Consider adding state machine visualization in debug mode
- Potential for room "locked" state (boss arenas)
