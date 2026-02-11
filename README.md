# Bud Engine

**A 2D web game engine designed for AI-human collaboration**

![Version](https://img.shields.io/badge/version-1.5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Size](https://img.shields.io/badge/size-~50KB-orange)

## 🤖 Philosophy

Bud Engine is built so an AI developer can write, **TEST**, and iterate on games independently before handing polished results to a human. The killer feature is the **AI Testing API + Auto-Playtest Bot**.

No more "I think this is balanced" — let the AI bot play 1000 runs and tell you exactly where your game breaks.

## ✨ What's New in v1.5

- ✅ **Fixed UI button click detection** - Canvas buttons now work reliably (timing issue resolved)
- ✨ **Enhanced procedural art** - All sprites now have gradients, glow effects, and outlines
- 🧱 **Enemy wall collision** - Enemies no longer walk through walls
- 🎬 **Scene transitions** - Smooth fade in/out between scenes  
- 🔧 **Improved collision resolution** - Entities no longer get stuck in walls
- 💫 **Visual polish** - Player trail particles, wave announcements, better feel
- 🎨 **New color helpers** - `lightenColor()` and `darkenColor()` for gradient generation

## ⚡ Features

- **Single-File Architecture** — Just `bud.js`. No build tools, no npm, no webpack. Works in any browser.
- **Procedural Art System** — No external assets needed. Generate sprites, tiles, and particles from code.
- **AI Testing API** — Inject input, inspect state, control time, record/replay sessions.
- **Auto-Playtest Bot** — Built-in AI that plays your game using configurable strategies (survive, aggressive, explore, random, idle).
- **Entity-Component System** — Tag-based entity organization with collision callbacks.
- **Physics & Collision** — AABB and circle colliders, spatial grid, raycasting.
- **Tilemap System** — Build dungeons and levels with auto-collision generation.
- **Particle System** — Explosions, trails, pickups.
- **Procedural Sound** — Web Audio API synthesized sounds (no audio files).
- **Scene Management** — Menu → Gameplay → Game Over flow.
- **Camera System** — Follow, smooth lerp, shake, zoom.

## 📦 Installation

Download `bud.js` and include it in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Game</title>
</head>
<body>
    <script src="bud.js"></script>
    <script src="game.js"></script>
</body>
</html>
```

That's it. No npm install, no build step.

## 🚀 Quick Start

```javascript
const engine = new BudEngine({ width: 1280, height: 720 });

engine.scene('game', {
    enter() {
        // Spawn player
        const player = engine.spawn('player', {
            x: 640, y: 360,
            sprite: engine.art.character({ 
                body: 'circle', 
                color: '#00ffcc', 
                size: 20,
                eyes: true,
                glow: true
            }),
            collider: { type: 'circle', radius: 16 },
            health: 100,
            speed: 200
        });

        // Camera follows player
        engine.cameraFollow(player);
    },

    update(dt) {
        const player = engine.findOne('player');
        
        // WASD movement
        if (engine.input.key('w')) player.y -= player.speed * dt;
        if (engine.input.key('s')) player.y += player.speed * dt;
        if (engine.input.key('a')) player.x -= player.speed * dt;
        if (engine.input.key('d')) player.x += player.speed * dt;
    }
});

engine.goTo('game');
engine.start();
```

## 🧪 AI Testing API

The magic sauce. This is what makes Bud Engine unique.

### State Inspection

```javascript
const state = engine.test.getState();
// { entities: [...], player: {x, y, health}, enemies: [...], fps: 60, ... }

engine.test.query('enemies within 100 of player');
engine.test.count('enemy'); // Number of enemies alive
```

### Input Injection

```javascript
engine.test.input('w', true);      // Hold W key
engine.test.input('w', false);     // Release W key
engine.test.click(worldX, worldY); // Click at world position
engine.test.moveMouse(worldX, worldY);
```

### Time Control

```javascript
engine.test.step();        // Advance 1 frame
engine.test.step(60);      // Advance 60 frames (1 second)
engine.test.fastForward(5); // Skip 5 seconds instantly (no render)
engine.test.pause();
engine.test.resume();
```

### Auto-Playtest Bot

```javascript
const results = engine.test.autoplay({
    strategy: 'survive',  // or 'aggressive', 'explore', 'random', 'idle'
    duration: 60,         // seconds
    runs: 50,             // number of playtests
    report: true
});

console.log(results);
// {
//   avgSurvival: 34.2,
//   minSurvival: 2.1,
//   maxSurvival: 60,
//   deaths: 23,
//   avgScore: 1250,
//   bugs: ['entity fell through floor at frame 892'],
//   balanceNotes: ['wave 3 has 0% clear rate']
// }
```

**Strategies:**
- `survive` — Dodge enemies, shoot when safe, pick up health
- `aggressive` — Rush toward enemies, always shooting
- `explore` — Try to visit every tile/room
- `random` — Random inputs (fuzz testing)
- `idle` — Do nothing (test spawn camping)

## 🎮 Demo Games

### Top-Down Shooter
**Features:** 5-room dungeon, 3 enemy types (patrol, chaser, turret), wave system, health pickups.  
**Tested:** 30+ second average survival with autoplay bot (survive strategy).  
[Play Demo](demos/shooter/index.html) | [Source](demos/shooter/game.js)

### Platformer
**Features:** 3 levels, coins, spikes, jump physics.  
**Tested:** All levels completable by autoplay bot.  
[Play Demo](demos/platformer/index.html) | [Source](demos/platformer/game.js)

## 📚 Core API

### Entity System

```javascript
// Spawn entity
const player = engine.spawn('player', {
    x: 100, y: 100,
    sprite: engine.art.character({ body: 'circle', color: '#00ffcc' }),
    collider: { type: 'circle', radius: 16 },
    health: 100,
    tags: ['player', 'friendly']
});

// Find entities
const enemies = engine.findByTag('enemy');
const player = engine.findOne('player');

// Destroy entity
engine.destroy(entity);
```

### Collision

```javascript
engine.onCollision('bullet', 'enemy', (bullet, enemy) => {
    enemy.health -= 25;
    engine.destroy(bullet);
    
    if (enemy.health <= 0) {
        engine.destroy(enemy);
        engine.sound.play('explode');
    }
});
```

### Procedural Art

```javascript
// Character sprites
engine.art.character({ 
    body: 'circle',      // circle, square, diamond, capsule, triangle, star, hexagon
    color: '#00ffcc', 
    size: 20,
    eyes: true,
    glow: true 
});

// Enemy sprites
engine.art.enemy({ 
    body: 'diamond', 
    color: '#ff3333', 
    spikes: true 
});

// Tiles
engine.art.tile({ 
    type: 'metal',       // metal, organic, circuit, brick
    pattern: 'grid',     // grid, dots, stripes
    color: '#1a1a2e' 
});
```

### Tilemap

```javascript
const map = engine.tilemap(32); // 32px tiles

map.fill(0, 0, 20, 15, 'floor');     // Fill rectangle
map.rect(0, 0, 20, 15, 'wall');      // Draw rectangle border
map.door(10, 0, 'north');            // Create opening
map.room(5, 5, 8, 6, 'floor', 'wall'); // Room with walls + auto doors
```

### Particles

```javascript
engine.particles.emit(x, y, {
    count: 20,
    color: ['#ff4400', '#ff8800', '#ffcc00'],
    speed: [50, 150],
    life: [0.3, 0.8],
    size: [2, 6],
    gravity: 100,
    fade: true
});
```

### Sound

```javascript
engine.sound.play('shoot');   // Procedural laser sound
engine.sound.play('hit');     // Impact sound
engine.sound.play('explode'); // Explosion
engine.sound.play('pickup');  // Pickup chime
engine.sound.play('jump');    // Jump sound
```

### UI

```javascript
engine.ui.healthBar(player, { 
    x: 20, y: 20, 
    width: 200, 
    color: '#ff3333' 
});

engine.ui.text('Wave: 5', { 
    x: 640, y: 20, 
    align: 'center', 
    font: '24px monospace' 
});

engine.ui.screen('gameover', {
    title: 'GAME OVER',
    subtitle: 'Score: 1250',
    button: { text: 'RESTART', action: () => engine.restart() }
});
```

### Scene Management

```javascript
engine.scene('menu', {
    enter() { /* setup */ },
    update(dt) { /* game logic */ },
    draw(ctx) { /* extra rendering */ },
    exit() { /* cleanup */ }
});

engine.goTo('menu');
```

## 🎨 Style Guide

Bud Engine uses a **dark theme with neon accents** as its signature aesthetic:

- Background: `#0a0a14`
- Primary: `#00ffcc` (cyan)
- Secondary: `#ff3333` (red)
- Accent: `#ff8800` (orange)
- Fonts: Monospace everywhere

All demo games follow this aesthetic. No placeholder art — everything should look intentional.

## 🧪 Testing Your Game

After building your game:

1. Run the autoplay bot
2. Check the results
3. Fix any issues found
4. Re-run until bot reports healthy stats

**Example workflow:**

```javascript
// Run 50 playtests with 'survive' strategy
const results = engine.test.autoplay({
    strategy: 'survive',
    duration: 60,
    runs: 50,
    report: true
});

// Check balance
if (results.avgSurvival < 30) {
    console.log('⚠️  Game too difficult');
}

if (results.deaths === 0) {
    console.log('⚠️  Game too easy');
}

// Check for bugs
if (results.bugs.length > 0) {
    console.error('🐛 Bugs found:', results.bugs);
}
```

**DO NOT ship untested.** The whole point of this engine is testability.

## 📝 License

MIT License - Do whatever you want with it.

## 🤝 Contributing

This is a single-file engine by design. Contributions should:
- Not add external dependencies
- Not break the single-file philosophy
- Include tests (using the testing API)
- Follow the neon aesthetic

## 🔮 Roadmap

- [ ] Pathfinding for autoplay bot
- [ ] Better mobile touch controls
- [ ] Sprite animation system
- [ ] Multiplayer support (WebRTC)
- [ ] Visual editor (maybe?)

## 💡 Philosophy

**"If an AI can't test it, it's not testable enough."**

Bud Engine is designed for a future where AI writes games, tests them exhaustively, and only hands off polished, balanced results to humans. The testing API is first-class, not an afterthought.

Traditional game development:
1. Write code
2. Play manually
3. "I think this is balanced"
4. Ship it

Bud Engine development:
1. Write code
2. Run autoplay bot (1000 runs)
3. Fix issues bot found
4. Ship with data-backed confidence

---

**Built with ❤️ for AI-human collaboration**

[Documentation](index.html) | [GitHub](https://github.com/lovejzzz/BudEngine) | [Demos](demos/)
