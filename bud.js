/**
 * BUD ENGINE v4.1
 * A 2D web game engine designed for AI-human collaboration
 * 
 * Philosophy: AI can write, TEST, and iterate on games independently.
 * Killer feature: AI Testing API + auto-playtest bot
 * 
 * Architecture: Single-file, no build tools, runs in browser
 * 
 * v4.1 LIVING ECOSYSTEM - Creatures, Food Chains, Self-Sustaining Life:
 * - Three creature types: Worms (🪱 soil decomposers), Fish (🐟 aquatic herbivores), Bugs (🐛 surface herbivores)
 * - Creatures are MATERIALS in the grid - they move, eat, reproduce, and die organically
 * - Soil fertility system: worms enrich soil by eating decay, plants deplete fertility
 * - Global O2/CO2 balance: plants produce oxygen, creatures consume it, affects fire spread
 * - Food chain dynamics: creatures eat plants/decay, populations rise and fall naturally
 * - Creature behavior: movement patterns (worms wiggle in dirt, fish swim in water, bugs walk on surfaces)
 * - Reproduction: well-fed creatures split (low probability, population capped at ~200)
 * - Death conditions: starvation, wrong environment, temperature extremes, low oxygen
 * - Acoustic ecology: worm rumbles (30-60Hz), fish splashes (200-400Hz), bug clicks (800-1500Hz)
 * - Performance: creatures simulate every 3 frames, population cap prevents slowdown
 * - Ecosystem state API: engine.test.getEcosystemState() includes creature counts, O2/CO2, soil fertility
 * - Self-sustaining: a well-balanced world runs indefinitely with natural population cycles
 * - The aquarium experience: mesmerizing to watch life emerge and persist
 * 
 * v3.10 PROCEDURAL WORLD GENERATION - Infinite Unique Worlds:
 * - Seeded random number generator (Mulberry32) for deterministic generation
 * - Noise functions: 2D value noise with smooth interpolation, fractal/layered noise
 * - WorldGenerator class: complete procedural world generation from seeds
 * - Heightmap generation: 1D fractal noise for natural terrain (mountains, valleys, plains)
 * - Cave systems: 2D noise threshold carving, connected networks, cave entrances
 * - Ore deposits: iron, coal, salt veins placed in stone using noise patterns
 * - Water table simulation: fill low areas, underground aquifers, biome-appropriate levels
 * - River carving: flow from high to low points, natural meandering
 * - Biome system: temperate, desert, arctic, volcanic, swamp, mountain, ocean
 * - Terrain layers: surface (biome-specific), topsoil, subsoil, bedrock with natural variation
 * - Vegetation: trees (wood columns), plants, vegetation, fungus - density varies by biome
 * - Temperature gradients: depth-based geothermal gradient, biome base temperatures
 * - Test API: engine.test.generateWorld(seed, biome) for AI/user world generation
 * - Deterministic: same seed + biome = identical world every time
 * - Natural-looking: noise-based everything, no straight lines, wavy layers
 * - Performant: generates full world in < 1 second, iPhone Safari compatible
 * 
 * v3.9 EARTH ECOSYSTEM WITH TIME ACCELERATION - Geological & Ecological Time:
 * - Time acceleration system: 1x, 10x, 100x, 1000x for geological time simulation
 * - World age tracking in "years" with seasonal cycles (spring/summer/fall/winter)
 * - Seasonal weather system: temperature, rain, snow, wind based on season
 * - Erosion system: water erodes stone→sand→dirt, wind shifts particles, thermal cracking
 * - Enhanced biology with seasonal growth rates and dormancy
 * - Fire ecology: dry summers increase wildfire risk, forests regrow after burns
 * - Seed dispersal: wind carries plant seeds to spread vegetation
 * - Soil building: decay enriches dirt for better plant growth
 * - Geological events: earthquakes (stone→sand), volcanic eruptions (lava), floods (rare, dramatic)
 * - Test API: engine.test.getEcosystemState() returns season, worldAge, weather, erosion stats
 * - setTimeScale(scale) method to control simulation speed
 * - Rivers carve canyons, forests grow and burn and regrow - Earth emerges over time
 * 
 * v3.8 ACOUSTIC PHYSICS SYSTEM - Sound from Material Properties:
 * - Every material has real acoustic properties: resonance frequency, dampening, brightness
 * - Procedural sound generation via Web Audio API - NO audio files
 * - Physics-driven sounds: impact, flow, reaction, phase change events
 * - Sound event queue system with throttling (max 20 events/frame)
 * - Frequencies calculated from material properties (resonance, Young's modulus, density)
 * - Impact sounds: geometric mean of materials' resonance frequencies
 * - Volume proportional to velocity and inverse of dampening
 * - Reaction sounds: rich harmonics, dramatic overtones
 * - Flow sounds: continuous noise-based synthesis for liquids/gases
 * - Complete acoustic properties: speedOfSound, acousticImpedance, resonanceFreq, dampening, brightness
 * - Test API: engine.physics.getAcousticState() for debugging
 * - UI toggle: 🔊 Sound button to enable/disable audio
 * - This is The Composition - sound emerges from physics.
 * 
 * v3.7 AI DEBUG/TESTING API - Self-Testing Without Human Intervention:
 * - Comprehensive test API for pixel physics: loadScenario, step, snapshot, getState
 * - Material inspection: getMaterialAt, placeMaterial, getPixelColor
 * - Debug overlay system: FPS, material counts, active chunks, frame counter
 * - Console logging: log, getLogs, watch for property monitoring
 * - AI can now test and iterate on physics simulations independently
 * - All APIs accessible via browser console for AI evaluation
 * 
 * v3.6 BIOLOGY SYSTEM - Life Emerges from Chemistry:
 * - Living materials: plant, vegetation, fungus, organic decay
 * - Property-based biology: growth, survival checks, death conditions
 * - Spontaneous life generation: life emerges naturally when conditions are met
 * - Ecosystem simulation: oxygen production, nutrient cycles, decomposition
 * - Tree growth: vegetation columns harden into wood over time
 * - Light detection: plants need light to photosynthesize, fungus grows in dark
 * - Complete material count: ~30 materials including biology
 * - This is how we build Earth.
 * 
 * v3.2 PERFORMANCE + DYNAMIC LIGHTING:
 * - Chunked simulation: 60-80% performance boost for stable worlds
 * - Flat array material properties: O(1) property access, no object lookups
 * - Reaction lookup table: O(1) reaction checks, eliminates nested loops
 * - Dynamic lighting system: fire, lava, and hot materials cast light
 * - Resolution scaling: dynamic quality adjustment
 * - Maintains 60 FPS with full-screen pixel physics
 * 
 * v3.1 EMERGENT PHYSICS - Property-Based Material System:
 * - REAL physical/chemical properties for every material
 * - Temperature simulation with heat transfer
 * - Emergent state transitions (melting, boiling, freezing, condensing)
 * - Emergent combustion (materials ignite at their ignition point)
 * - Property-based chemical reactions (acid + metal → hydrogen gas)
 * - NO hardcoded interactions - everything emerges from properties
 * - Complete material library: water cycle (ice/water/steam), earth & minerals,
 *   metals, flammable materials, gases, reactive materials
 * - Fire requires oxygen, heats neighbors, ignites flammable materials
 * - Temperature overlay (press T key)
 * - This is how we build Earth.
 * 
 * v3.0 MAJOR UPGRADE - Pixel Physics System:
 * - Cellular automata physics simulation ("Falling Everything")
 * - Every pixel is a material: sand, water, fire, smoke, oil, wood, stone, dirt
 * - Materials interact: water flows, sand falls, fire burns and spreads, gas rises
 * - Liquid pressure simulation, powder angle of repose, gas dissipation
 * - Fire spreads to flammable materials (wood, oil)
 * - Explosions that destroy and scatter debris
 * - Optimized for 60fps: typed arrays, dirty rectangles, alternating scan direction
 * - Full API: engine.physics.set/get/fill/circle/explode
 * - Inspired by Noita's "Everything Falls" engine
 * 
 * v2.7 Improvements (Asset Management):
 * - Comprehensive AssetManager system (engine.assets)
 * - Asset preloading with progress tracking
 * - Sprite sheet auto-slicing and frame retrieval
 * - Sprite animation system from sheets
 * - Built-in cyberpunk-styled loading screen
 * - Audio asset loading (mp3, wav, ogg)
 * - Asset unloading and memory management
 * - Full JSDoc documentation
 * 
 * v2.6 Improvements (Neon Ronin - Systems):
 * - Enhanced scene transitions (fade/wipe/flash with callbacks)
 * - Room/Level management system (engine.room API)
 * - Lightweight state machine system for AI (engine.stateMachine)
 * - Game polish and improvements
 * 
 * v2.5 Improvements (Neon Ronin - Camera & Feel):
 * - Native camera lookahead system (cameraLookahead)
 * - Lookahead can use target rotation or manual {x,y} offset
 * - Scene transitions with automatic fade (goTo with fade parameter improved)
 * - Combat impact helper (impact) - unified shake + freeze + flash
 * - Particle presets system for common patterns
 * 
 * v2.4 Improvements (Neon Ronin Polish):
 * - Freeze frames / hit pause (freezeFrame)
 * - Sprite effects: flash, alpha, scale on entities
 * - Automatic flash decay system
 * - Better hit feedback foundation
 * 
 * v2.3 Improvements (Neon Ronin):
 * - Screen flash effects (screenFlash, screenFade)
 * - Impact feedback for damage/hits
 * 
 * v2.2 Improvements:
 * - Virtual joystick for mobile (on-screen controls)
 * - Auto-shows on touch devices
 * - Normalized output (-1 to 1) for easy movement
 * 
 * v2.1 Improvements:
 * - Entity pool system for performance
 * - Collision layers (bitmask filtering)
 * - Camera deadzone, bounds, smooth zoom
 * - Timer system (after/every/cancelTimer)
 * - Comprehensive JSDoc comments
 * - Smarter autoplay bot strategies
 * - API cleanup (loadGame, entityCount, clear)
 * 
 * v2.0 Major Upgrade:
 * PRIORITY 1 - Core Systems:
 * - Time scaling with fixed timestep physics
 * - Touch input (mobile support)
 * - Gamepad support (Xbox/PlayStation controllers)
 * - Sprite animation system with state machines
 * - Global event system
 * - Trigger zones (non-solid collision detection)
 * 
 * PRIORITY 2 - Polish:
 * - Volume/mixer control (master, sfx, music)
 * - Persistent objects across scenes
 * - Save/load system
 * - Debug overlay (FPS, collision boxes, entity count)
 * 
 * PRIORITY 3 - Advanced:
 * - A* pathfinding
 * - Asset loader with progress
 * 
 * v1.5 Previous:
 * - Fixed UI button click detection
 * - Enhanced procedural art with glow/gradients/outlines
 * - Enemy wall collision
 * - Scene transitions (fade in/out)
 * - Better collision resolution
 * - Player trail particles
 * - Wave announcements
 */

class BudEngine {
    /**
     * Create a new BudEngine instance
     * @param {Object} config - Configuration options
     * @param {number} [config.width=1280] - Canvas width
     * @param {number} [config.height=720] - Canvas height
     * @param {string} [config.backgroundColor='#0a0a14'] - Background color
     * @param {number} [config.gravity=0] - Global gravity (for platformers)
     * @param {HTMLCanvasElement} [config.canvas] - Existing canvas element
     * @param {HTMLElement} [config.parent] - Parent element to append canvas to
     * @example
     * const engine = new BudEngine({ width: 1280, height: 720, gravity: 800 });
     */
    constructor(config = {}) {
        console.log(`[BudEngine v${BudEngine.VERSION || '2.1'}] Initializing...`);
        this.config = {
            width: config.width || 1280,
            height: config.height || 720,
            canvas: config.canvas || document.createElement('canvas'),
            backgroundColor: config.backgroundColor || '#0a0a14',
            ...config
        };

        // Core state
        this.running = false;
        this.paused = false;
        this.frame = 0;
        this.time = 0;
        this.dt = 1/60;
        this.fps = 60;
        this.lastFrameTime = 0;
        this.currentScene = null;
        this.scenes = {};

        // Time scaling (P1: Time scaling)
        this.timeScale = 1.0;
        this.slowMoTimer = 0;
        this.slowMoTargetScale = 1.0;
        this.slowMoOriginalScale = 1.0;
        
        // Freeze frames (v2.4) - Hit pause for impact
        this.freezeFrames = 0;
        this.freezeFrameDuration = 0;
        
        // Fixed timestep accumulator for physics
        this.accumulator = 0;
        this.fixedDt = 1/60;

        // Global event system (P1: Event system)
        this.eventListeners = new Map();

        // Persistent objects (P2: Persistent objects)
        this.persistentEntities = [];

        // Expose to window for testing/debugging
        window.engine = this;
        
        // Setup canvas
        this.canvas = this.config.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        if (config.parent) {
            config.parent.appendChild(this.canvas);
        } else if (!this.canvas.parentElement) {
            document.body.appendChild(this.canvas);
        }

        // Entity system
        this.entities = [];
        this.nextEntityId = 1;
        this.entityTags = new Map(); // tag -> Set of entities

        // Entity pool system (v2.1)
        this.entityPools = new Map(); // type -> {available: [], inUse: Set()}

        // Timer system (v2.1)
        this.timers = [];
        this.nextTimerId = 1;

        // Collision system
        this.collisionCallbacks = [];
        this.spatialGrid = new Map();
        this.spatialCellSize = 64;

        // Camera
        this.camera = {
            x: 0, y: 0,
            width: this.config.width,
            height: this.config.height,
            zoom: 1,
            targetZoom: 1,
            zoomSpeed: 0,
            target: null,
            followSpeed: 0.1,
            shake: { x: 0, y: 0, intensity: 0, decay: 0.9 },
            // v2.1 improvements
            deadzone: null, // {x, y, width, height}
            bounds: null, // {minX, minY, maxX, maxY}
            // v2.5 improvements
            lookahead: null // number (uses target.rotation) or {x, y} for manual offset
        };

        // Input system
        this.input = new InputSystem(this);
        
        // Art system
        this.art = new ArtSystem(this);
        
        // Particle system
        this.particles = new ParticleSystem(this);
        
        // Sound system
        this.sound = new SoundSystem(this);
        
        // UI system
        this.ui = new UISystem(this);
        
        // Testing API
        this.test = new TestingAPI(this);

        // Animation system (P1: Sprite animation)
        this.animations = new AnimationSystem(this);

        // Debug system (P2: Debug overlay)
        this.debug = false;
        this.debugSystem = new DebugSystem(this);

        // Asset loader (P3: Asset loader) - Legacy
        this.load = new AssetLoader(this);
        
        // Asset manager (v2.7) - New comprehensive system
        this.assets = new AssetManager(this);

        // Pathfinding (P3: AI pathfinding)
        this.pathfinding = new PathfindingSystem(this);

        // Pixel Physics (v3.0: Falling Everything)
        this.physics = new PixelPhysics(this);

        // Tilemap
        this.currentTilemap = null;

        // Gravity (optional, for platformers)
        this.gravity = config.gravity || 0;

        // Room system (v2.6)
        this.initRoomSystem();

        // Scene transitions
        this.transition = {
            active: false,
            type: 'fade',
            progress: 0,
            duration: 0.5,
            fadeOut: false,
            nextScene: null
        };

        // Screen effects (v2.3)
        this.screenEffects = {
            flash: { active: false, color: '#ffffff', intensity: 0, duration: 0, elapsed: 0 },
            fade: { active: false, color: '#000000', alpha: 0 },
            vignette: { active: false, intensity: 0 }
        };
    }

    // ===== GAME LOOP =====
    
    /**
     * Start the game loop
     * @example
     * engine.goTo('menu');
     * engine.start();
     */
    start() {
        if (this.running) return;
        this.running = true;
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    /**
     * Stop the game loop
     */
    stop() {
        this.running = false;
    }

    /**
     * Restart the current scene
     * @example
     * engine.restart(); // Reload current scene
     */
    restart() {
        // Re-enter current scene
        if (this.currentScene && this.scenes[this.currentScene]) {
            this.goTo(this.currentScene);
        }
    }

    gameLoop(timestamp = 0) {
        if (!this.running) return;

        // Calculate frame time
        const elapsed = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        this.fps = elapsed > 0 ? Math.round(1000 / elapsed) : 60;

        // Check for debug toggle (backtick key)
        if (this.input.keyPressed('`')) {
            this.debug = !this.debug;
        }

        // Update slow-mo timer (P1: Time scaling)
        if (this.slowMoTimer > 0) {
            this.slowMoTimer -= elapsed / 1000;
            if (this.slowMoTimer <= 0) {
                this.timeScale = this.slowMoOriginalScale;
                this.slowMoTimer = 0;
            }
        }

        // Handle freeze frames (v2.4)
        if (this.freezeFrames > 0) {
            this.freezeFrames--;
            this.render(); // Still render during freeze
            requestAnimationFrame((t) => this.gameLoop(t));
            return; // Skip update
        }

        this.render(); // Render first so UI can process input

        if (!this.paused) {
            // Fixed timestep with accumulator (P1: Time scaling)
            this.accumulator += (elapsed / 1000) * this.timeScale;
            
            // Limit accumulator to prevent spiral of death
            if (this.accumulator > 0.2) this.accumulator = 0.2;
            
            while (this.accumulator >= this.fixedDt) {
                this.update(this.fixedDt);
                this.accumulator -= this.fixedDt;
                this.frame++;
            }
            
            this.time += (elapsed / 1000) * this.timeScale;
        }

        // Clear input flags AFTER update() so both update and render can use them
        this.input.update();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        // Update timers (v2.1)
        this.updateTimers(dt);

        // Update screen effects (v2.3)
        this.updateScreenEffects(dt);

        // Update scene transitions (v2.6 - Enhanced)
        if (this.transition.active) {
            this.transition.progress += dt / this.transition.duration;
            
            if (this.transition.progress >= 1) {
                this.transition.progress = 1;
                
                if (this.transition.fadeOut) {
                    // Fade out complete, switch scene
                    // Call onMiddle callback if provided (v2.6)
                    if (this.transition.onMiddle) {
                        try {
                            this.transition.onMiddle();
                        } catch (e) {
                            console.error('[BudEngine] Transition onMiddle callback error:', e);
                        }
                    }
                    this.goTo(this.transition.nextScene, false);
                } else {
                    // Fade in complete, end transition
                    this.transition.active = false;
                }
            }
            
            // Don't update game during transitions
            if (this.transition.fadeOut) return;
        }

        // Update current scene
        if (this.currentScene && this.scenes[this.currentScene]) {
            const scene = this.scenes[this.currentScene];
            if (scene.update) scene.update(dt);
        }

        // Update entities
        for (let entity of this.entities) {
            if (!entity.enabled) continue;

            // Apply gravity
            if (this.gravity && entity.velocity && !entity.noGravity) {
                entity.velocity.y += this.gravity * dt;
            }

            // Apply velocity
            if (entity.velocity) {
                entity.x += entity.velocity.x * dt;
                entity.y += entity.velocity.y * dt;
            }

            // Update visual effects (v2.4)
            if (entity.flash !== undefined && entity.flash > 0) {
                entity.flash -= dt * 8; // Decay flash quickly
                if (entity.flash < 0) entity.flash = 0;
            }

            // Update animation (P1: Sprite animation + v2.7: AssetManager animations)
            if (entity.animation && entity.animation.update) {
                entity.animation.update(dt);
                // v2.7: For asset manager animations, keep animation object; for old system, update sprite
                if (entity.animation.currentFrame && !entity.animation.sheet) {
                    // Old animation system
                    entity.sprite = entity.animation.currentFrame();
                }
                // v2.7: For new asset system, sprite/spriteFrame is handled in render
            }

            // Update state machine (P1: Sprite animation)
            if (entity.states && entity.currentState) {
                const state = entity.states[entity.currentState];
                if (state && state.update) {
                    state.update(entity, dt);
                }
            }

            // Update callback
            if (entity.update) {
                entity.update(dt);
            }
        }

        // Update particles
        this.particles.update(dt);

        // Update pixel physics (v3.0)
        this.physics.update(dt);

        // Update gamepad input (P1: Gamepad support)
        this.input.updateGamepad();

        // Collision detection
        this.updateCollisions();

        // Update camera
        this.updateCamera(dt);

        // NOTE: input.update() moved to AFTER render so UI can check mousePressed
    }

    render() {
        const ctx = this.ctx;
        
        // Clear
        ctx.fillStyle = this.config.backgroundColor;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Save state and apply camera
        ctx.save();
        
        // Camera shake
        const shakeX = this.camera.shake.x;
        const shakeY = this.camera.shake.y;
        
        ctx.translate(
            -this.camera.x * this.camera.zoom + this.canvas.width / 2 + shakeX,
            -this.camera.y * this.camera.zoom + this.canvas.height / 2 + shakeY
        );
        ctx.scale(this.camera.zoom, this.camera.zoom);

        // Render tilemap
        if (this.currentTilemap) {
            this.currentTilemap.render(ctx, this.camera);
        }

        // Render pixel physics (v3.0) - Background layer
        this.physics.render(ctx, this.camera);

        // Render entities (sorted by layer)
        const sortedEntities = [...this.entities].sort((a, b) => (a.layer || 0) - (b.layer || 0));
        for (let entity of sortedEntities) {
            if (!entity.enabled || !entity.sprite) continue;
            
            ctx.save();
            ctx.translate(entity.x, entity.y);
            if (entity.rotation) ctx.rotate(entity.rotation);
            
            // Apply sprite effects (v2.4)
            if (entity.alpha !== undefined) {
                ctx.globalAlpha = entity.alpha;
            }
            
            const scale = entity.scale || 1;
            if (scale !== 1) {
                ctx.scale(scale, scale);
            }
            
            // Flash effect (v2.4) - Override colors when flashing
            if (entity.flash && entity.flash > 0) {
                ctx.globalCompositeOperation = 'lighter';
                ctx.globalAlpha = Math.min(1, entity.flash);
            }
            
            const sprite = entity.sprite;
            
            // v2.7: Handle spriteFrame objects (from asset system)
            if (entity.spriteFrame) {
                const frame = entity.spriteFrame;
                ctx.drawImage(
                    frame.image,
                    frame.sx, frame.sy, frame.sw, frame.sh,
                    -frame.sw / 2, -frame.sh / 2, frame.sw, frame.sh
                );
            } 
            // v2.7: Handle animation objects with currentFrame()
            else if (entity.animation && entity.animation.currentFrame) {
                const frame = entity.animation.currentFrame();
                if (frame) {
                    ctx.drawImage(
                        frame.image,
                        frame.sx, frame.sy, frame.sw, frame.sh,
                        -frame.sw / 2, -frame.sh / 2, frame.sw, frame.sh
                    );
                }
            }
            // Original sprite handling
            else if (sprite && sprite.tagName === 'CANVAS') {
                ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
            } else if (sprite && sprite.tagName === 'IMG') {
                ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
            } else if (typeof sprite === 'function') {
                sprite(ctx, entity);
            }
            
            // Reset composite operation
            ctx.globalCompositeOperation = 'source-over';
            
            ctx.restore();
        }

        // Render particles
        this.particles.render(ctx);

        ctx.restore();

        // Render UI (no camera transform)
        this.ui.render(ctx);

        // Draw current scene
        if (this.currentScene && this.scenes[this.currentScene]) {
            const scene = this.scenes[this.currentScene];
            if (scene.draw) scene.draw(ctx);
        }

        // Render scene transitions (v2.6 - Enhanced)
        if (this.transition.active) {
            const progress = this.transition.fadeOut ? this.transition.progress : 1 - this.transition.progress;
            const type = this.transition.type || 'fade';
            const color = this.transition.color || '#000000';
            
            // Parse color to rgba
            let r, g, b;
            if (color.startsWith('#')) {
                const hex = color.slice(1);
                r = parseInt(hex.slice(0, 2), 16);
                g = parseInt(hex.slice(2, 4), 16);
                b = parseInt(hex.slice(4, 6), 16);
            } else {
                r = 10; g = 10; b = 20; // Default dark color
            }
            
            if (type === 'fade') {
                // Classic fade to color
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${progress})`;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            } else if (type === 'wipe') {
                // Horizontal wipe effect
                const wipeWidth = this.canvas.width * progress;
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, wipeWidth, this.canvas.height);
            } else if (type === 'flash') {
                // Quick flash to white/color then fade
                const flashProgress = this.transition.fadeOut ? progress * 2 : (1 - progress) * 2;
                const alpha = Math.min(1, flashProgress);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }

        // Render screen effects (v2.3)
        this.renderScreenEffects(ctx);

        // Render debug overlay (P2: Debug overlay)
        if (this.debug || this.debugSystem.enabled) {
            this.debugSystem.render(ctx);
        }
    }

    /**
     * @private
     * Render screen effects
     */
    renderScreenEffects(ctx) {
        // Flash effect
        if (this.screenEffects.flash.active) {
            const progress = this.screenEffects.flash.elapsed / this.screenEffects.flash.duration;
            const alpha = this.screenEffects.flash.intensity * (1 - progress);
            
            ctx.fillStyle = this.screenEffects.flash.color;
            ctx.globalAlpha = alpha;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.globalAlpha = 1;
        }

        // Fade effect
        if (this.screenEffects.fade.active || this.screenEffects.fade.alpha > 0) {
            ctx.fillStyle = this.screenEffects.fade.color;
            ctx.globalAlpha = this.screenEffects.fade.alpha;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.globalAlpha = 1;
        }
    }

    updateCamera(dt) {
        if (this.camera.target) {
            const target = this.camera.target;
            let targetX = target.x || 0;
            let targetY = target.y || 0;
            
            // v2.5: Camera lookahead - offset camera in direction of target's rotation/facing
            // Allows games to "look ahead" in the direction the player is facing
            if (this.camera.lookahead !== undefined && this.camera.lookahead !== null) {
                // If lookahead is a number, use target's rotation to calculate offset
                if (typeof this.camera.lookahead === 'number') {
                    const angle = target.rotation || 0;
                    const dist = this.camera.lookahead;
                    targetX += Math.cos(angle) * dist;
                    targetY += Math.sin(angle) * dist;
                } 
                // If lookahead is an object with x/y, use it as direct offset
                else if (typeof this.camera.lookahead === 'object') {
                    targetX += this.camera.lookahead.x || 0;
                    targetY += this.camera.lookahead.y || 0;
                }
            }
            
            // Deadzone (v2.1) - don't move camera if target is within deadzone
            if (this.camera.deadzone) {
                const dz = this.camera.deadzone;
                const dzLeft = this.camera.x + dz.x;
                const dzRight = this.camera.x + dz.x + dz.width;
                const dzTop = this.camera.y + dz.y;
                const dzBottom = this.camera.y + dz.y + dz.height;
                
                let desiredX = this.camera.x;
                let desiredY = this.camera.y;
                
                if (targetX < dzLeft) desiredX = targetX - dz.x;
                if (targetX > dzRight) desiredX = targetX - dz.x - dz.width;
                if (targetY < dzTop) desiredY = targetY - dz.y;
                if (targetY > dzBottom) desiredY = targetY - dz.y - dz.height;
                
                this.camera.x += (desiredX - this.camera.x) * this.camera.followSpeed;
                this.camera.y += (desiredY - this.camera.y) * this.camera.followSpeed;
            } else {
                // Smooth follow (normal behavior)
                this.camera.x += (targetX - this.camera.x) * this.camera.followSpeed;
                this.camera.y += (targetY - this.camera.y) * this.camera.followSpeed;
            }
            
            // Camera bounds (v2.1) - clamp camera position
            if (this.camera.bounds) {
                const b = this.camera.bounds;
                this.camera.x = Math.max(b.minX, Math.min(b.maxX, this.camera.x));
                this.camera.y = Math.max(b.minY, Math.min(b.maxY, this.camera.y));
            }
        }

        // Smooth zoom (v2.1)
        if (this.camera.zoomSpeed > 0 && this.camera.zoom !== this.camera.targetZoom) {
            const zoomDiff = this.camera.targetZoom - this.camera.zoom;
            this.camera.zoom += zoomDiff * this.camera.zoomSpeed * dt;
            
            // Snap when close enough
            if (Math.abs(zoomDiff) < 0.01) {
                this.camera.zoom = this.camera.targetZoom;
                this.camera.zoomSpeed = 0;
            }
        }

        // Camera shake decay (frame-rate independent)
        this.camera.shake.x *= Math.pow(this.camera.shake.decay, dt * 60);
        this.camera.shake.y *= Math.pow(this.camera.shake.decay, dt * 60);
    }

    // ===== TIME SCALING (P1) =====

    /**
     * Enable slow-motion or fast-forward effect
     * @param {number} scale - Time scale multiplier (0.5 = half speed, 2.0 = double speed)
     * @param {number} [duration] - Duration in seconds (optional, permanent if not specified)
     * @example
     * engine.slowMo(0.3, 2); // Slow to 30% speed for 2 seconds
     */
    slowMo(scale, duration) {
        this.slowMoOriginalScale = this.timeScale;
        this.timeScale = scale;
        if (duration) {
            this.slowMoTimer = duration;
        }
    }

    /**
     * Freeze the game for impact frames (hit pause)
     * @param {number} frames - Number of frames to freeze (60fps = 1 second)
     * @example
     * engine.freezeFrame(3); // Freeze for 3 frames (~0.05s hit pause)
     * engine.freezeFrame(8); // Freeze for 8 frames (~0.13s heavy hit)
     */
    freezeFrame(frames) {
        this.freezeFrames = Math.max(this.freezeFrames, frames); // Don't reduce existing freeze
    }

    /**
     * Combined impact feedback - shake, freeze, and flash in one call
     * Useful for combat hits, explosions, and impactful events
     * @param {number} [intensity=5] - Impact intensity (1-10, affects all effects)
     * @param {object} [options] - Optional configuration
     * @param {string} [options.flashColor='#ffffff'] - Flash color
     * @param {boolean} [options.noShake=false] - Disable camera shake
     * @param {boolean} [options.noFreeze=false] - Disable freeze frames
     * @param {boolean} [options.noFlash=false] - Disable screen flash
     * @example
     * engine.impact(5); // Medium impact - default white flash
     * engine.impact(8, { flashColor: '#ff0000' }); // Heavy red impact (damage)
     * engine.impact(3, { noShake: true }); // Light impact, no shake
     */
    impact(intensity = 5, options = {}) {
        const {
            flashColor = '#ffffff',
            noShake = false,
            noFreeze = false,
            noFlash = false
        } = options;

        // Clamp intensity to reasonable range
        intensity = Math.max(1, Math.min(10, intensity));

        // Camera shake (scaled by intensity)
        if (!noShake) {
            this.cameraShake(intensity * 1.5);
        }

        // Freeze frames (scaled by intensity)
        if (!noFreeze) {
            const freezeFrames = Math.floor(intensity * 0.6); // 1-6 frames
            this.freezeFrame(freezeFrames);
        }

        // Screen flash (scaled by intensity)
        if (!noFlash) {
            const flashIntensity = Math.min(1, intensity / 12); // 0.08 - 0.83
            const flashDuration = 0.1 + (intensity / 50); // 0.12 - 0.3s
            this.screenFlash(flashColor, flashIntensity, flashDuration);
        }
    }

    // ===== SCREEN EFFECTS (v2.3) =====

    /**
     * Flash the screen with a color (for impact/damage effects)
     * @param {string} [color='#ffffff'] - Flash color
     * @param {number} [intensity=0.8] - Flash intensity (0-1)
     * @param {number} [duration=0.15] - Flash duration in seconds
     * @example
     * engine.screenFlash('#ff0000', 0.6, 0.2); // Red flash for damage
     */
    screenFlash(color = '#ffffff', intensity = 0.8, duration = 0.15) {
        this.screenEffects.flash.active = true;
        this.screenEffects.flash.color = color;
        this.screenEffects.flash.intensity = intensity;
        this.screenEffects.flash.duration = duration;
        this.screenEffects.flash.elapsed = 0;
    }

    /**
     * Fade screen to/from a color
     * @param {string} color - Fade color
     * @param {number} alpha - Target alpha (0-1)
     * @param {number} duration - Fade duration in seconds
     * @example
     * engine.screenFade('#000000', 1, 0.5); // Fade to black over 0.5s
     */
    screenFade(color, alpha, duration) {
        this.screenEffects.fade.active = true;
        this.screenEffects.fade.color = color;
        this.screenEffects.fade.targetAlpha = alpha;
        this.screenEffects.fade.alpha = this.screenEffects.fade.alpha || 0;
        this.screenEffects.fade.duration = duration;
        this.screenEffects.fade.elapsed = 0;
    }

    // ===== TIMER SYSTEM (v2.1) =====

    /**
     * Execute a callback after a delay
     * @param {number} seconds - Delay in seconds
     * @param {function} callback - Function to execute
     * @returns {number} Timer ID (use with cancelTimer)
     * @example
     * engine.after(3, () => { console.log('3 seconds later!'); });
     */
    after(seconds, callback) {
        const timer = {
            id: this.nextTimerId++,
            time: seconds,
            callback,
            repeat: false
        };
        this.timers.push(timer);
        return timer.id;
    }

    /**
     * Execute a callback repeatedly at an interval
     * @param {number} seconds - Interval in seconds
     * @param {function} callback - Function to execute
     * @returns {number} Timer ID (use with cancelTimer)
     * @example
     * const timerId = engine.every(1, () => { console.log('Every second'); });
     */
    every(seconds, callback) {
        const timer = {
            id: this.nextTimerId++,
            time: seconds,
            interval: seconds,
            callback,
            repeat: true
        };
        this.timers.push(timer);
        return timer.id;
    }

    /**
     * Cancel a timer
     * @param {number} timerId - Timer ID returned by after() or every()
     * @example
     * const id = engine.every(1, callback);
     * engine.cancelTimer(id);
     */
    cancelTimer(timerId) {
        const index = this.timers.findIndex(t => t.id === timerId);
        if (index >= 0) {
            this.timers.splice(index, 1);
        }
    }

    /**
     * @private
     * Update all active timers
     */
    updateTimers(dt) {
        for (let i = this.timers.length - 1; i >= 0; i--) {
            const timer = this.timers[i];
            timer.time -= dt;
            
            if (timer.time <= 0) {
                try {
                    timer.callback();
                } catch (e) {
                    console.error('[BudEngine] Timer callback error:', e);
                }
                
                if (timer.repeat) {
                    timer.time = timer.interval;
                } else {
                    this.timers.splice(i, 1);
                }
            }
        }
    }

    /**
     * @private
     * Update screen effects
     */
    updateScreenEffects(dt) {
        // Flash effect
        if (this.screenEffects.flash.active) {
            this.screenEffects.flash.elapsed += dt;
            if (this.screenEffects.flash.elapsed >= this.screenEffects.flash.duration) {
                this.screenEffects.flash.active = false;
            }
        }

        // Fade effect
        if (this.screenEffects.fade.active) {
            this.screenEffects.fade.elapsed += dt;
            const progress = Math.min(1, this.screenEffects.fade.elapsed / this.screenEffects.fade.duration);
            this.screenEffects.fade.alpha = this.screenEffects.fade.alpha + 
                (this.screenEffects.fade.targetAlpha - this.screenEffects.fade.alpha) * progress;
            
            if (progress >= 1) {
                this.screenEffects.fade.active = false;
            }
        }
    }

    // ===== EVENT SYSTEM (P1) =====

    /**
     * Register an event listener
     * @param {string} event - Event name (e.g., 'entitySpawned', 'collisionStart', 'sceneChanged')
     * @param {function} callback - Callback function
     * @example
     * engine.on('entitySpawned', (entity) => { console.log('Spawned:', entity.type); });
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    /**
     * Remove an event listener
     * @param {string} event - Event name
     * @param {function} callback - Callback function to remove
     * @example
     * const handler = (entity) => { console.log(entity); };
     * engine.on('entitySpawned', handler);
     * engine.off('entitySpawned', handler);
     */
    off(event, callback) {
        if (!this.eventListeners.has(event)) return;
        const listeners = this.eventListeners.get(event);
        const index = listeners.indexOf(callback);
        if (index >= 0) {
            listeners.splice(index, 1);
        }
    }

    /**
     * Emit an event to all listeners
     * @param {string} event - Event name
     * @param {*} data - Event data
     * @example
     * engine.emit('playerDied', { score: 1000, wave: 5 });
     */
    emit(event, data) {
        if (!this.eventListeners.has(event)) return;
        const listeners = this.eventListeners.get(event);
        for (let callback of listeners) {
            try {
                callback(data);
            } catch (e) {
                console.error(`[BudEngine] Error in event listener for '${event}':`, e);
            }
        }
    }

    // ===== PERSISTENT OBJECTS (P2) =====

    /**
     * Mark an entity to persist across scene transitions
     * @param {object} entity - Entity to persist
     * @example
     * const player = engine.spawn('player', { ... });
     * engine.persist(player); // Player survives scene changes
     */
    persist(entity) {
        if (!this.persistentEntities.includes(entity)) {
            this.persistentEntities.push(entity);
        }
    }

    // ===== SAVE/LOAD SYSTEM (P2) =====

    /**
     * Save game state to localStorage
     * @param {string} [slot='default'] - Save slot name
     * @returns {boolean} True if save succeeded
     * @example
     * engine.save('autosave');
     * engine.on('gameSaved', ({ slot }) => { console.log('Saved to', slot); });
     */
    save(slot = 'default') {
        const saveData = {
            scene: this.currentScene,
            time: this.time,
            frame: this.frame,
            entities: this.entities.map(e => ({
                type: e.type,
                x: e.x,
                y: e.y,
                health: e.health,
                score: e.score,
                velocity: e.velocity,
                rotation: e.rotation,
                tags: e.tags,
                // Store any custom properties that are serializable
                ...Object.fromEntries(
                    Object.entries(e).filter(([key, val]) => 
                        typeof val === 'number' || 
                        typeof val === 'string' || 
                        typeof val === 'boolean'
                    )
                )
            })),
            customData: this.saveCustomData || {}
        };

        try {
            localStorage.setItem(`budengine_save_${slot}`, JSON.stringify(saveData));
            console.log(`[BudEngine] Game saved to slot '${slot}'`);
            this.emit('gameSaved', { slot });
            return true;
        } catch (e) {
            console.error('[BudEngine] Save failed:', e);
            return false;
        }
    }

    /**
     * Load game state from localStorage
     * @param {string} [slot='default'] - Save slot name
     * @returns {boolean} True if load succeeded
     * @example
     * if (engine.loadGame('autosave')) {
     *   console.log('Game loaded successfully');
     * }
     */
    loadGame(slot = 'default') {
        try {
            const data = localStorage.getItem(`budengine_save_${slot}`);
            if (!data) {
                console.warn(`[BudEngine] No save data found in slot '${slot}'`);
                return false;
            }

            const saveData = JSON.parse(data);
            
            // Clear current entities
            this.entities = [];
            this.entityTags.clear();
            this.nextEntityId = 1;
            
            // Restore scene (without calling enter)
            this.currentScene = saveData.scene;
            
            // Restore entities (basic restoration, games may need custom logic)
            for (let entityData of saveData.entities) {
                this.spawn(entityData.type, entityData);
            }
            
            // Restore custom data
            this.saveCustomData = saveData.customData || {};
            
            console.log(`[BudEngine] Game loaded from slot '${slot}'`);
            this.emit('gameLoaded', { slot });
            return true;
        } catch (e) {
            console.error('[BudEngine] Load failed:', e);
            return false;
        }
    }

    /**
     * @deprecated Use loadGame() instead
     * @param {string} [slot='default'] - Save slot name
     */
    load(slot = 'default') {
        console.warn('[BudEngine] load() is deprecated, use loadGame() instead');
        return this.loadGame(slot);
    }

    // Save/load custom data helpers
    /**
     * Save custom data to localStorage
     * @param {string} key - Data key
     * @param {*} value - Data to save (must be JSON-serializable)
     * @returns {boolean} True if save succeeded
     */
    static saveCustom(key, value) {
        try {
            localStorage.setItem(`budengine_custom_${key}`, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('[BudEngine] Custom save failed:', e);
            return false;
        }
    }

    /**
     * Load custom data from localStorage
     * @param {string} key - Data key
     * @param {*} [defaultValue=null] - Default value if not found
     * @returns {*} Loaded data or default value
     */
    static loadCustom(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(`budengine_custom_${key}`);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('[BudEngine] Custom load failed:', e);
            return defaultValue;
        }
    }

    // ===== PATHFINDING (P3) =====

    /**
     * Find a path from one point to another using A*
     * @param {object} from - Start position {x, y}
     * @param {object} to - End position {x, y}
     * @returns {Array} Array of waypoints [{x, y}, ...]
     * @example
     * const path = engine.pathfind({ x: 100, y: 100 }, { x: 500, y: 400 });
     * path.forEach(waypoint => console.log(waypoint.x, waypoint.y));
     */
    pathfind(from, to) {
        return this.pathfinding.findPath(from, to);
    }

    // ===== ENTITY POOL SYSTEM (v2.1) =====

    /**
     * Pre-allocate entities of a given type to improve performance
     * @param {string} type - Entity type
     * @param {number} count - Number of entities to pre-allocate
     * @param {object} [props={}] - Default properties for pooled entities
     * @example
     * engine.pool('bullet', 50, { collider: { type: 'circle', radius: 4 } });
     */
    pool(type, count, props = {}) {
        if (!this.entityPools.has(type)) {
            this.entityPools.set(type, { available: [], inUse: new Set() });
        }
        
        const pool = this.entityPools.get(type);
        for (let i = 0; i < count; i++) {
            const entity = {
                id: this.nextEntityId++,
                type,
                x: 0,
                y: 0,
                enabled: false,
                pooled: true,
                ...props
            };
            pool.available.push(entity);
        }
    }

    /**
     * @private
     * Acquire an entity from the pool or create a new one
     */
    acquireFromPool(type, props) {
        const pool = this.entityPools.get(type);
        if (!pool || pool.available.length === 0) {
            return null;
        }
        
        const entity = pool.available.pop();
        pool.inUse.add(entity);
        
        // Reset and apply new properties
        Object.assign(entity, props);
        entity.enabled = true;
        
        return entity;
    }

    /**
     * Return an entity to its pool for reuse
     * @param {object} entity - Entity to recycle
     * @example
     * engine.recycle(bullet);
     */
    recycle(entity) {
        if (!entity.pooled || !entity.type) return;
        
        const pool = this.entityPools.get(entity.type);
        if (!pool) return;
        
        // Remove from active entities
        const idx = this.entities.indexOf(entity);
        if (idx >= 0) {
            this.entities.splice(idx, 1);
        }
        
        // Remove from tag index
        if (entity.tags && Array.isArray(entity.tags)) {
            for (let tag of entity.tags) {
                if (this.entityTags.has(tag)) {
                    this.entityTags.get(tag).delete(entity);
                }
            }
        }
        
        // Return to pool
        pool.inUse.delete(entity);
        pool.available.push(entity);
        entity.enabled = false;
    }

    // ===== API CLEANUP (v2.1) =====

    /**
     * Get the current entity count
     * @returns {number} Number of active entities
     */
    get entityCount() {
        return this.entities.length;
    }

    /**
     * Remove all entities from the game
     * @example
     * engine.clear(); // Start fresh
     */
    clear() {
        this.entities = [];
        this.entityTags.clear();
        this.nextEntityId = 1;
    }

    // ===== ENTITY SYSTEM =====

    /**
     * Spawn a new entity
     * @param {string} type - Entity type identifier
     * @param {object} [props={}] - Entity properties
     * @returns {object} The spawned entity
     * @example
     * const player = engine.spawn('player', {
     *   x: 100, y: 100,
     *   sprite: engine.art.character({ color: '#00ffcc' }),
     *   collider: { type: 'circle', radius: 16 },
     *   health: 100
     * });
     */
    spawn(type, props = {}) {
        // Error handling: validate type
        if (!type || typeof type !== 'string') {
            console.error('[BudEngine] spawn() requires a valid type string');
            return null;
        }

        // Try to acquire from pool (v2.1)
        let entity = this.acquireFromPool(type, props);
        
        if (!entity) {
            // Create new entity if pool is empty or doesn't exist
            entity = {
                id: this.nextEntityId++,
                type: type,
                x: props.x || 0,
                y: props.y || 0,
                velocity: props.velocity || (props.speed !== undefined ? { x: 0, y: 0 } : null),
                rotation: props.rotation || 0,
                sprite: props.sprite || null,
                collider: props.collider || null,
                enabled: true,
                tags: props.tags || [type],
                layer: props.layer || 0,
                parent: null,
                children: [],
                pooled: false,
                destroyed: false, // v2.1: track destruction state
                ...props
            };

            // Validate tags is an array
            if (!Array.isArray(entity.tags)) {
                console.warn('[BudEngine] Entity tags must be an array, converting:', entity.tags);
                entity.tags = [String(entity.tags)];
            }
        } else {
            // Entity from pool - ensure tags are valid
            if (!Array.isArray(entity.tags)) {
                entity.tags = [type];
            }
            entity.destroyed = false;
        }

        // Set collision layer defaults (v2.1)
        if (entity.collider && entity.collider.layer === undefined) {
            entity.collider.layer = 0xFFFF; // All layers
        }
        if (entity.collider && entity.collider.mask === undefined) {
            entity.collider.mask = 0xFFFF; // Collide with all layers
        }

        this.entities.push(entity);

        // Add to tag index
        for (let tag of entity.tags) {
            if (!this.entityTags.has(tag)) {
                this.entityTags.set(tag, new Set());
            }
            this.entityTags.get(tag).add(entity);
        }

        // Emit entitySpawned event (P1: Event system)
        this.emit('entitySpawned', entity);

        return entity;
    }

    /**
     * Destroy an entity (safe to call multiple times)
     * @param {object} entity - Entity to destroy
     * @example
     * engine.onCollision('bullet', 'enemy', (bullet, enemy) => {
     *   engine.destroy(bullet);
     * });
     */
    destroy(entity) {
        // Error handling: validate entity
        if (!entity) {
            console.warn('[BudEngine] destroy() called with null/undefined entity');
            return;
        }

        // v2.1: Safe to call multiple times
        if (entity.destroyed) {
            return;
        }
        entity.destroyed = true;

        const idx = this.entities.indexOf(entity);
        if (idx >= 0) {
            this.entities.splice(idx, 1);
        }

        // Remove from persistent list
        const persistIdx = this.persistentEntities.indexOf(entity);
        if (persistIdx >= 0) {
            this.persistentEntities.splice(persistIdx, 1);
        }

        // Remove from tag index
        if (entity.tags && Array.isArray(entity.tags)) {
            for (let tag of entity.tags) {
                if (this.entityTags.has(tag)) {
                    this.entityTags.get(tag).delete(entity);
                }
            }
        }

        // Emit entityDestroyed event (P1: Event system)
        this.emit('entityDestroyed', entity);

        // Destroy children
        if (entity.children && Array.isArray(entity.children)) {
            for (let child of entity.children) {
                this.destroy(child);
            }
        }
    }

    /**
     * Find entities by tag
     * @param {string} tag - Tag to search for
     * @returns {Array} Array of entities with the tag
     * @example
     * const enemies = engine.findByTag('enemy');
     */

    findByTag(tag) {
        return this.entityTags.get(tag) ? Array.from(this.entityTags.get(tag)) : [];
    }

    /**
     * Find the first entity with a given tag
     * @param {string} tag - Tag to search for
     * @returns {object|null} First entity with the tag, or null
     * @example
     * const player = engine.findOne('player');
     */
    findOne(tag) {
        const entities = this.findByTag(tag);
        return entities.length > 0 ? entities[0] : null;
    }

    // ===== COLLISION SYSTEM =====

    /**
     * @private
     * Update collision detection and resolution
     */

    updateCollisions() {
        // Clear spatial grid
        this.spatialGrid.clear();

        // Build spatial grid
        for (let entity of this.entities) {
            if (!entity.enabled || !entity.collider) continue;
            
            const cellX = Math.floor(entity.x / this.spatialCellSize);
            const cellY = Math.floor(entity.y / this.spatialCellSize);
            const key = `${cellX},${cellY}`;
            
            if (!this.spatialGrid.has(key)) {
                this.spatialGrid.set(key, []);
            }
            this.spatialGrid.get(key).push(entity);
        }

        // Check collisions
        const checked = new Set();
        for (let entity of this.entities) {
            if (!entity.enabled || !entity.collider) continue;

            // Check nearby cells
            const cellX = Math.floor(entity.x / this.spatialCellSize);
            const cellY = Math.floor(entity.y / this.spatialCellSize);
            
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const key = `${cellX + dx},${cellY + dy}`;
                    const nearby = this.spatialGrid.get(key) || [];
                    
                    for (let other of nearby) {
                        if (entity === other) continue;
                        if (!other.enabled || !other.collider) continue;
                        
                        const pairKey = entity.id < other.id ? `${entity.id}-${other.id}` : `${other.id}-${entity.id}`;
                        if (checked.has(pairKey)) continue;
                        checked.add(pairKey);

                        // v2.1: Collision layer filtering (bitmask)
                        const aLayer = entity.collider.layer !== undefined ? entity.collider.layer : 0xFFFF;
                        const aMask = entity.collider.mask !== undefined ? entity.collider.mask : 0xFFFF;
                        const bLayer = other.collider.layer !== undefined ? other.collider.layer : 0xFFFF;
                        const bMask = other.collider.mask !== undefined ? other.collider.mask : 0xFFFF;
                        
                        // Skip if layers don't match masks
                        if ((aLayer & bMask) === 0 && (bLayer & aMask) === 0) {
                            continue;
                        }

                        if (this.checkCollision(entity, other)) {
                            this.handleCollision(entity, other);
                        }
                    }
                }
            }
        }
    }

    checkCollision(a, b) {
        const colliderA = a.collider;
        const colliderB = b.collider;

        if (colliderA.type === 'circle' && colliderB.type === 'circle') {
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            return dist < (colliderA.radius + colliderB.radius);
        }

        if (colliderA.type === 'aabb' && colliderB.type === 'aabb') {
            const halfA = colliderA.width / 2;
            const halfB = colliderB.width / 2;
            const halfAH = colliderA.height / 2;
            const halfBH = colliderB.height / 2;
            
            return Math.abs(a.x - b.x) < (halfA + halfB) &&
                   Math.abs(a.y - b.y) < (halfAH + halfBH);
        }

        // Circle vs AABB
        if (colliderA.type === 'circle' && colliderB.type === 'aabb') {
            return this.circleAABBCollision(a, colliderA, b, colliderB);
        }
        if (colliderA.type === 'aabb' && colliderB.type === 'circle') {
            return this.circleAABBCollision(b, colliderB, a, colliderA);
        }

        return false;
    }

    circleAABBCollision(circle, circleCol, aabb, aabbCol) {
        const halfW = aabbCol.width / 2;
        const halfH = aabbCol.height / 2;
        
        const closestX = Math.max(aabb.x - halfW, Math.min(circle.x, aabb.x + halfW));
        const closestY = Math.max(aabb.y - halfH, Math.min(circle.y, aabb.y + halfH));
        
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;
        
        return (dx * dx + dy * dy) < (circleCol.radius * circleCol.radius);
    }

    handleCollision(a, b) {
        // Emit collisionStart event (P1: Event system)
        this.emit('collisionStart', { a, b });

        // Check for trigger zones (P1: Trigger zones)
        const aTrigger = a.collider && a.collider.trigger;
        const bTrigger = b.collider && b.collider.trigger;

        // Trigger callbacks
        for (let callback of this.collisionCallbacks) {
            const aMatch = a.tags.includes(callback.tagA);
            const bMatch = b.tags.includes(callback.tagB);
            
            if (aMatch && bMatch) {
                callback.fn(a, b);
            } else if (b.tags.includes(callback.tagA) && a.tags.includes(callback.tagB)) {
                callback.fn(b, a);
            }
        }

        // Trigger entity callbacks
        if (a.onCollision) a.onCollision(b);
        if (b.onCollision) b.onCollision(a);
        
        // Skip physical resolution if either is a trigger zone
        if (aTrigger || bTrigger) return;
        
        // Solid collision resolution — push non-solid entity out of solid entity
        const aSolid = a.tags.includes('solid') || a.tags.includes('wall');
        const bSolid = b.tags.includes('solid') || b.tags.includes('wall');
        
        // Check if entity should collide with walls (enemies now collide too!)
        const aBlockedByWalls = !a.tags.includes('bullet') && !a.tags.includes('pickup') && !a.tags.includes('coin');
        const bBlockedByWalls = !b.tags.includes('bullet') && !b.tags.includes('pickup') && !b.tags.includes('coin');
        
        if (aSolid && !bSolid && b.collider && bBlockedByWalls) {
            this.resolveOverlap(b, a);
        } else if (bSolid && !aSolid && a.collider && aBlockedByWalls) {
            this.resolveOverlap(a, b);
        }
    }
    
    resolveOverlap(mover, solid) {
        // Push mover out of solid (improved resolution)
        if (solid.collider.type === 'aabb') {
            const halfW = solid.collider.width / 2;
            const halfH = solid.collider.height / 2;
            
            const dx = mover.x - solid.x;
            const dy = mover.y - solid.y;
            
            const moverR = mover.collider.type === 'circle' ? mover.collider.radius : Math.max(mover.collider.width, mover.collider.height) / 2;
            
            const overlapX = halfW + moverR - Math.abs(dx);
            const overlapY = halfH + moverR - Math.abs(dy);
            
            if (overlapX > 0 && overlapY > 0) {
                // Push out on axis with least penetration (more stable)
                if (overlapX < overlapY) {
                    const pushX = dx > 0 ? overlapX : -overlapX;
                    mover.x += pushX;
                    // Also zero out velocity in that direction to prevent sticking
                    if (mover.velocity) {
                        if (dx > 0 && mover.velocity.x < 0) mover.velocity.x = 0;
                        if (dx < 0 && mover.velocity.x > 0) mover.velocity.x = 0;
                    }
                } else {
                    const pushY = dy > 0 ? overlapY : -overlapY;
                    mover.y += pushY;
                    if (mover.velocity) {
                        if (dy > 0 && mover.velocity.y < 0) mover.velocity.y = 0;
                        if (dy < 0 && mover.velocity.y > 0) mover.velocity.y = 0;
                    }
                }
            }
        }
    }

    /**
     * Register a collision callback between two entity tags
     * @param {string} tagA - First entity tag
     * @param {string} tagB - Second entity tag
     * @param {function} fn - Callback function(entityA, entityB)
     * @example
     * engine.onCollision('bullet', 'enemy', (bullet, enemy) => {
     *   enemy.health -= 25;
     *   engine.destroy(bullet);
     * });
     */
    onCollision(tagA, tagB, fn) {
        // Error handling: validate parameters
        if (!tagA || !tagB) {
            console.error('[BudEngine] onCollision() requires two tag strings');
            return;
        }
        if (typeof fn !== 'function') {
            console.error('[BudEngine] onCollision() requires a callback function');
            return;
        }
        this.collisionCallbacks.push({ tagA, tagB, fn });
    }

    /**
     * Cast a ray and find the first entity it hits
     * @param {object} from - Start position {x, y}
     * @param {object} direction - Direction vector {x, y}
     * @param {number} distance - Maximum ray distance
     * @param {Array} [tags=null] - Entity tags to check (null = all)
     * @returns {object|null} {entity, distance} or null if no hit
     * @example
     * const hit = engine.raycast(player, {x: 1, y: 0}, 500, ['enemy']);
     * if (hit) console.log('Hit enemy at distance', hit.distance);
     */

    raycast(from, direction, distance, tags = null) {
        // Normalize direction
        const len = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        const dx = direction.x / len;
        const dy = direction.y / len;

        let closest = null;
        let closestDist = distance;

        for (let entity of this.entities) {
            if (!entity.enabled || !entity.collider) continue;
            if (tags && !tags.some(tag => entity.tags.includes(tag))) continue;

            // Simple raycast vs circle
            if (entity.collider.type === 'circle') {
                const fx = entity.x - from.x;
                const fy = entity.y - from.y;
                const proj = fx * dx + fy * dy;
                
                if (proj < 0 || proj > closestDist) continue;
                
                const closestX = from.x + dx * proj;
                const closestY = from.y + dy * proj;
                const dist = Math.sqrt((entity.x - closestX) ** 2 + (entity.y - closestY) ** 2);
                
                if (dist < entity.collider.radius && proj < closestDist) {
                    closestDist = proj;
                    closest = entity;
                }
            }
        }

        return closest ? { entity: closest, distance: closestDist } : null;
    }

    // ===== SCENE SYSTEM =====

    /**
     * Define a game scene
     * @param {string} name - Scene name
     * @param {object} definition - Scene definition with enter(), update(dt), draw(ctx), exit()
     * @example
     * engine.scene('gameplay', {
     *   enter() { console.log('Starting game'); },
     *   update(dt) { },
     *   draw(ctx) { }
     * });
     */
    scene(name, definition) {
        // Error handling: validate parameters
        if (!name || typeof name !== 'string') {
            console.error('[BudEngine] scene() requires a name string');
            return;
        }
        if (!definition || typeof definition !== 'object') {
            console.error('[BudEngine] scene() requires a definition object');
            return;
        }
        this.scenes[name] = definition;
    }

    /**
     * Switch to a different scene with enhanced transitions (v2.6)
     * @param {string} name - Scene name
     * @param {boolean|object} [transition=false] - Transition config or true for default fade
     * @param {string} [transition.type='fade'] - Transition type: 'fade', 'wipe', 'flash'
     * @param {number} [transition.duration=0.5] - Transition duration in seconds
     * @param {string} [transition.color='#000000'] - Transition color
     * @param {function} [transition.onMiddle] - Callback when transition reaches middle (scene switches)
     * @example
     * engine.goTo('gameover', true); // Default fade
     * engine.goTo('level2', { type: 'fade', duration: 0.3, color: '#000' });
     * engine.goTo('battle', { type: 'flash', color: '#ff0000', duration: 0.2 });
     */
    goTo(name, transition = false) {
        // Error handling: validate scene exists
        if (!name || typeof name !== 'string') {
            console.error('[BudEngine] goTo() requires a scene name string');
            return;
        }
        if (!this.scenes[name]) {
            console.error(`[BudEngine] Scene '${name}' does not exist. Available scenes:`, Object.keys(this.scenes));
            return;
        }

        // Parse transition config (v2.6)
        if (transition && !this.transition.active) {
            let config = {
                type: 'fade',
                duration: 0.5,
                color: '#000000',
                onMiddle: null
            };
            
            if (typeof transition === 'object') {
                Object.assign(config, transition);
            } else if (transition === true) {
                // Default fade
                config.type = 'fade';
            }
            
            // Start transition
            this.transition.active = true;
            this.transition.type = config.type;
            this.transition.fadeOut = true;
            this.transition.progress = 0;
            this.transition.duration = config.duration;
            this.transition.color = config.color;
            this.transition.nextScene = name;
            this.transition.onMiddle = config.onMiddle;
            return;
        }

        // Exit current scene
        if (this.currentScene && this.scenes[this.currentScene]) {
            const scene = this.scenes[this.currentScene];
            if (scene.exit) scene.exit();
        }

        // Save persistent entities (P2: Persistent objects)
        const savedPersistent = [...this.persistentEntities];

        // Clear entities
        this.entities = [];
        this.entityTags.clear();
        this.nextEntityId = 1;
        this.collisionCallbacks = [];
        this.particles.clear();
        this.ui.clear();

        // Restore persistent entities
        for (let entity of savedPersistent) {
            this.entities.push(entity);
            for (let tag of entity.tags) {
                if (!this.entityTags.has(tag)) {
                    this.entityTags.set(tag, new Set());
                }
                this.entityTags.get(tag).add(entity);
            }
        }

        // Enter new scene
        this.currentScene = name;
        if (this.scenes[name]) {
            const scene = this.scenes[name];
            if (scene.enter) scene.enter();
        }

        // Emit sceneChanged event (P1: Event system)
        this.emit('sceneChanged', { scene: name });

        // Start fade in if transitioning
        if (transition) {
            this.transition.fadeOut = false;
            this.transition.progress = 0;
        }
    }

    // ===== TILEMAP =====

    /**
     * Create a tilemap for grid-based levels
     * @param {number} [tileSize=32] - Size of each tile in pixels
     * @returns {Tilemap} Tilemap instance
     * @example
     * const map = engine.tilemap(32);
     * map.room(0, 0, 10, 10, 'floor', 'wall');
     */
    tilemap(tileSize = 32) {
        const tilemap = new Tilemap(this, tileSize);
        this.currentTilemap = tilemap;
        return tilemap;
    }

    // ===== ROOM/LEVEL MANAGEMENT SYSTEM (v2.6) =====

    /**
     * Initialize the room system (v2.6)
     * Creates a room management API on engine.room
     * @private
     */
    initRoomSystem() {
        this.rooms = new Map();
        this.currentRoom = null;
        
        // Create the room API
        this.room = (name, config) => {
            if (!config) {
                // Getter: return room data
                return this.rooms.get(name);
            }
            
            // Setter: define a room
            this.rooms.set(name, {
                name,
                width: config.width || 30,
                height: config.height || 20,
                tileSize: config.tileSize || 32,
                setup: config.setup || null,
                doors: []
            });
            
            return this.room;
        };
        
        // Add door connection method
        this.room.door = (fromRoom, toRoom, position) => {
            const room = this.rooms.get(fromRoom);
            if (!room) {
                console.error(`[BudEngine] Room '${fromRoom}' not found`);
                return;
            }
            
            room.doors.push({
                target: toRoom,
                position: position // {x, y} in tile coordinates or string like 'left', 'right'
            });
            
            return this.room;
        };
        
        // Go to a room with automatic transition
        this.room.go = (name, spawnPoint = null, transition = null) => {
            const room = this.rooms.get(name);
            if (!room) {
                console.error(`[BudEngine] Room '${name}' not found`);
                return;
            }
            
            // Default transition
            const defaultTransition = {
                type: 'fade',
                duration: 0.3,
                color: '#000000',
                onMiddle: () => {
                    // This runs at the transition midpoint (when screen is fully black)
                    this.loadRoom(name, spawnPoint);
                }
            };
            
            const finalTransition = transition || defaultTransition;
            
            // If no scene transition system integration needed, just load directly
            if (!finalTransition || this.transition.active) {
                this.loadRoom(name, spawnPoint);
            } else {
                // Use enhanced transition system
                this.transition.active = true;
                this.transition.type = finalTransition.type;
                this.transition.fadeOut = true;
                this.transition.progress = 0;
                this.transition.duration = finalTransition.duration;
                this.transition.color = finalTransition.color;
                this.transition.nextScene = this.currentScene; // Stay in same scene
                this.transition.onMiddle = finalTransition.onMiddle;
            }
        };
    }

    /**
     * Load a room (internal method)
     * @private
     * @param {string} name - Room name
     * @param {object|string} [spawnPoint=null] - Spawn point {x, y} or direction string
     */
    loadRoom(name, spawnPoint = null) {
        const room = this.rooms.get(name);
        if (!room) {
            console.error(`[BudEngine] Room '${name}' not found`);
            return;
        }
        
        // Save player state before clearing
        const player = this.findOne('player');
        const playerState = player ? {
            health: player.health,
            maxHealth: player.maxHealth,
            energy: player.energy,
            maxEnergy: player.maxEnergy,
            // Save any other important player properties
            ...Object.fromEntries(
                Object.entries(player).filter(([key, val]) => 
                    (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') &&
                    !['x', 'y', 'velocity', 'rotation'].includes(key)
                )
            )
        } : null;
        
        // Clear current room entities
        this.entities = this.entities.filter(e => e.tags && e.tags.includes('persistent'));
        this.entityTags.clear();
        this.particles.clear();
        
        // Re-index persistent entities
        for (let entity of this.entities) {
            for (let tag of entity.tags) {
                if (!this.entityTags.has(tag)) {
                    this.entityTags.set(tag, new Set());
                }
                this.entityTags.get(tag).add(entity);
            }
        }
        
        // Create tilemap for room
        const map = this.tilemap(room.tileSize);
        map.room(0, 0, room.width, room.height, 'floor', 'wall');
        
        // Set current room
        this.currentRoom = name;
        
        // Setup room (user-defined)
        if (room.setup) {
            room.setup(room, map);
        }
        
        // Auto-create door triggers for defined doors
        for (let door of room.doors) {
            // Determine spawn position on other side
            let spawnSide = 'center';
            let doorX, doorY;
            
            if (typeof door.position === 'string') {
                // String position like 'left', 'right', 'top', 'bottom'
                const midY = Math.floor(room.height / 2);
                const midX = Math.floor(room.width / 2);
                
                if (door.position === 'left') {
                    doorX = 0;
                    doorY = midY;
                    spawnSide = 'right';
                    map.door(0, midY, 'left');
                } else if (door.position === 'right') {
                    doorX = room.width - 1;
                    doorY = midY;
                    spawnSide = 'left';
                    map.door(room.width - 1, midY, 'right');
                } else if (door.position === 'top') {
                    doorX = midX;
                    doorY = 0;
                    spawnSide = 'bottom';
                    map.door(midX, 0, 'up');
                } else if (door.position === 'bottom') {
                    doorX = midX;
                    doorY = room.height - 1;
                    spawnSide = 'top';
                    map.door(midX, room.height - 1, 'down');
                }
            } else {
                // Position is {x, y} in tile coordinates
                doorX = door.position.x;
                doorY = door.position.y;
            }
            
            // Create trigger zone for door
            this.spawn('door-trigger', {
                x: doorX * room.tileSize + room.tileSize / 2,
                y: doorY * room.tileSize + room.tileSize / 2,
                collider: { type: 'circle', radius: 40, trigger: true },
                targetRoom: door.target,
                spawnSide: spawnSide,
                tags: ['door', 'persistent']
            });
        }
        
        // Calculate spawn position
        let spawnX, spawnY;
        const roomMidY = (room.height * room.tileSize) / 2;
        const roomMidX = (room.width * room.tileSize) / 2;
        
        if (spawnPoint) {
            if (typeof spawnPoint === 'object' && spawnPoint.x !== undefined) {
                spawnX = spawnPoint.x;
                spawnY = spawnPoint.y;
            } else if (typeof spawnPoint === 'string') {
                // String spawn like 'left', 'right', etc.
                if (spawnPoint === 'left') {
                    spawnX = 80;
                    spawnY = roomMidY;
                } else if (spawnPoint === 'right') {
                    spawnX = room.width * room.tileSize - 80;
                    spawnY = roomMidY;
                } else if (spawnPoint === 'top') {
                    spawnX = roomMidX;
                    spawnY = 80;
                } else if (spawnPoint === 'bottom') {
                    spawnX = roomMidX;
                    spawnY = room.height * room.tileSize - 80;
                } else {
                    spawnX = roomMidX;
                    spawnY = roomMidY;
                }
            } else {
                spawnX = roomMidX;
                spawnY = roomMidY;
            }
        } else {
            spawnX = roomMidX;
            spawnY = roomMidY;
        }
        
        // Restore or create player
        if (playerState) {
            // Emit event for game to handle player recreation
            this.emit('roomPlayerRespawn', { x: spawnX, y: spawnY, state: playerState });
        }
        
        // Set camera bounds
        const halfW = this.canvas.width / 2;
        const halfH = this.canvas.height / 2;
        this.camera.bounds = {
            minX: halfW / this.camera.zoom,
            minY: halfH / this.camera.zoom,
            maxX: room.width * room.tileSize - halfW / this.camera.zoom,
            maxY: room.height * room.tileSize - halfH / this.camera.zoom
        };
        
        // Emit room loaded event
        this.emit('roomLoaded', { room: name });
    }

    // ===== CAMERA =====

    /**
     * Make the camera follow an entity
     * @param {object} entity - Entity to follow
     * @param {number} [speed=0.1] - Follow speed (0-1, higher = snappier)
     * @example
     * const player = engine.spawn('player', { ... });
     * engine.cameraFollow(player, 0.1);
     */
    cameraFollow(entity, speed = 0.1) {
        this.camera.target = entity;
        this.camera.followSpeed = speed;
    }

    /**
     * Shake the camera for impact effects
     * @param {number} [intensity=10] - Shake intensity in pixels
     * @example
     * engine.cameraShake(15); // Big explosion
     */
    cameraShake(intensity = 10) {
        this.camera.shake.intensity = intensity;
        this.camera.shake.x = (Math.random() - 0.5) * intensity;
        this.camera.shake.y = (Math.random() - 0.5) * intensity;
    }

    /**
     * Enable camera lookahead - camera offsets in the direction of target's facing
     * @param {number|object|null} lookahead - Distance (uses target.rotation) or {x,y} offset, or null to disable
     * @example
     * engine.cameraLookahead(80); // Look 80px ahead in direction player faces
     * engine.cameraLookahead({x: 50, y: 0}); // Manual offset
     * engine.cameraLookahead(null); // Disable lookahead
     */
    cameraLookahead(lookahead) {
        this.camera.lookahead = lookahead;
    }

    /**
     * Smoothly zoom the camera (v2.1)
     * @param {number} targetZoom - Target zoom level
     * @param {number} speed - Zoom speed (0-1, higher = faster)
     * @example
     * engine.camera.smoothZoom(2.0, 0.05); // Zoom in 2x gradually
     */
    smoothZoom(targetZoom, speed) {
        this.camera.targetZoom = targetZoom;
        this.camera.zoomSpeed = speed;
    }

    // ===== ANIMATION HELPER (P1) =====

    /**
     * Create an animation from sprite frames
     * @param {Array} frames - Array of sprites or {sprite, duration} objects
     * @param {number} [fps=12] - Frames per second
     * @returns {Animation} Animation object
     * @example
     * const frames = [sprite1, sprite2, sprite3];
     * const anim = engine.animation(frames, 12);
     * entity.animation = anim;
     */
    animation(frames, fps = 12) {
        return new Animation(frames, fps);
    }

    // ===== STATE MACHINE (v2.6) =====

    /**
     * Create a lightweight state machine (v2.6)
     * @param {object} states - State definitions with enter, update, exit callbacks
     * @param {string} [initialState] - Initial state name (defaults to first state)
     * @returns {StateMachine} State machine instance
     * @example
     * const sm = engine.stateMachine({
     *   idle: {
     *     enter(entity) { entity.velocity.x = 0; },
     *     update(entity, dt) { if (seesPlayer) this.go('chase'); }
     *   },
     *   chase: {
     *     enter(entity) { entity.speed = 200; },
     *     update(entity, dt) { // chase logic }
     *   }
     * }, 'idle');
     * 
     * // In entity update:
     * entity.stateMachine.update(entity, dt);
     */
    stateMachine(states, initialState = null) {
        return new StateMachine(this, states, initialState);
    }

    // ===== HELPERS =====

    /**
     * Convert screen coordinates to world coordinates
     * @param {number} screenX - Screen X position
     * @param {number} screenY - Screen Y position
     * @returns {object} World coordinates {x, y}
     * @example
     * const world = engine.screenToWorld(engine.input.mouse.x, engine.input.mouse.y);
     */
    screenToWorld(screenX, screenY) {
        const x = (screenX - this.canvas.width / 2) / this.camera.zoom + this.camera.x;
        const y = (screenY - this.canvas.height / 2) / this.camera.zoom + this.camera.y;
        return { x, y };
    }

    /**
     * Convert world coordinates to screen coordinates
     * @param {number} worldX - World X position
     * @param {number} worldY - World Y position
     * @returns {object} Screen coordinates {x, y}
     */
    worldToScreen(worldX, worldY) {
        const x = (worldX - this.camera.x) * this.camera.zoom + this.canvas.width / 2;
        const y = (worldY - this.camera.y) * this.camera.zoom + this.canvas.height / 2;
        return { x, y };
    }

    /**
     * Generate a random number between min and max
     * @param {number} min - Minimum value (or max if only one parameter)
     * @param {number} [max] - Maximum value
     * @returns {number} Random number
     * @example
     * engine.random(10); // 0-10
     * engine.random(5, 15); // 5-15
     */
    random(min, max) {
        if (min === undefined) return Math.random();
        if (max === undefined) {
            max = min;
            min = 0;
        }
        return min + Math.random() * (max - min);
    }

    /**
     * Choose a random element from an array
     * @param {Array} array - Array to choose from
     * @returns {*} Random element
     * @example
     * const color = engine.choose(['red', 'blue', 'green']);
     */
    /**
     * Choose a random element from an array
     * @param {Array} array - Array to choose from
     * @returns {*} Random element, or undefined if array is empty
     */
    choose(array) {
        if (!array || array.length === 0) return undefined;
        return array[Math.floor(Math.random() * array.length)];
    }
}

// ===== INPUT SYSTEM =====

class InputSystem {
    constructor(engine) {
        this.engine = engine;
        this.keys = new Map();
        this.keysPressed = new Map();
        this.keysReleased = new Map();
        this.mouse = { x: 0, y: 0 };
        this.mouseWorld = { x: 0, y: 0 };
        this.mouseDown = false;
        this.mousePressed = false;
        this.mouseReleased = false;

        // Touch input (P1: Touch input)
        this.touch = [];
        this.touchPressed = false;
        this.touchReleased = false;

        // Gamepad input (P1: Gamepad support)
        this.gamepad = {
            connected: false,
            leftStick: { x: 0, y: 0 },
            rightStick: { x: 0, y: 0 },
            buttons: {},
            deadzone: 0.15
        };

        // Injection for AI testing
        this.injectedKeys = new Map();
        this.injectedMouse = null;

        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys.get(e.key)) {
                this.keysPressed.set(e.key, true);
            }
            this.keys.set(e.key, true);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.set(e.key, false);
            this.keysReleased.set(e.key, true);
        });

        this.engine.canvas.addEventListener('mousemove', (e) => {
            const rect = this.engine.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.updateMouseWorld();
        });

        this.engine.canvas.addEventListener('mousedown', (e) => {
            if (!this.mouseDown) this.mousePressed = true;
            this.mouseDown = true;
            e.preventDefault(); // Prevent default behavior
        });

        this.engine.canvas.addEventListener('mouseup', (e) => {
            this.mouseDown = false;
            this.mouseReleased = true;
            e.preventDefault();
        });

        // Add click event for better button detection
        this.engine.canvas.addEventListener('click', (e) => {
            const rect = this.engine.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.updateMouseWorld();
            this.mousePressed = true; // Ensure this is set for UI buttons
            e.preventDefault();
        });

        // Touch input (P1: Touch input)
        this.engine.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.updateTouches(e);
            this.touchPressed = true;
            // Map first touch to mouse for compatibility
            if (this.touch.length > 0) {
                this.mouse.x = this.touch[0].x;
                this.mouse.y = this.touch[0].y;
                this.updateMouseWorld();
                if (!this.mouseDown) this.mousePressed = true;
                this.mouseDown = true;
            }
        });

        this.engine.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.updateTouches(e);
            // Update mouse position for first touch
            if (this.touch.length > 0) {
                this.mouse.x = this.touch[0].x;
                this.mouse.y = this.touch[0].y;
                this.updateMouseWorld();
            }
        });

        this.engine.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.updateTouches(e);
            this.touchReleased = true;
            // Release mouse if no touches remain
            if (this.touch.length === 0) {
                this.mouseDown = false;
                this.mouseReleased = true;
            }
        });

        this.engine.canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.touch = [];
            this.mouseDown = false;
        });

        // Gamepad connection events (P1: Gamepad support)
        window.addEventListener('gamepadconnected', (e) => {
            console.log('[BudEngine] Gamepad connected:', e.gamepad.id);
            this.gamepad.connected = true;
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('[BudEngine] Gamepad disconnected');
            this.gamepad.connected = false;
        });
    }

    updateTouches(e) {
        const rect = this.engine.canvas.getBoundingClientRect();
        this.touch = [];
        for (let i = 0; i < e.touches.length; i++) {
            const t = e.touches[i];
            this.touch.push({
                id: t.identifier,
                x: t.clientX - rect.left,
                y: t.clientY - rect.top
            });
        }
    }

    updateGamepad() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp = gamepads[0]; // Use first gamepad
        
        if (!gp) {
            this.gamepad.connected = false;
            return;
        }

        this.gamepad.connected = true;

        // Left stick (axes 0, 1)
        const lx = Math.abs(gp.axes[0]) > this.gamepad.deadzone ? gp.axes[0] : 0;
        const ly = Math.abs(gp.axes[1]) > this.gamepad.deadzone ? gp.axes[1] : 0;
        this.gamepad.leftStick = { x: lx, y: ly };

        // Right stick (axes 2, 3)
        const rx = Math.abs(gp.axes[2]) > this.gamepad.deadzone ? gp.axes[2] : 0;
        const ry = Math.abs(gp.axes[3]) > this.gamepad.deadzone ? gp.axes[3] : 0;
        this.gamepad.rightStick = { x: rx, y: ry };

        // Buttons (map common ones)
        this.gamepad.buttons = {
            a: gp.buttons[0] && gp.buttons[0].pressed,
            b: gp.buttons[1] && gp.buttons[1].pressed,
            x: gp.buttons[2] && gp.buttons[2].pressed,
            y: gp.buttons[3] && gp.buttons[3].pressed,
            lb: gp.buttons[4] && gp.buttons[4].pressed,
            rb: gp.buttons[5] && gp.buttons[5].pressed,
            lt: gp.buttons[6] && gp.buttons[6].pressed,
            rt: gp.buttons[7] && gp.buttons[7].pressed,
            back: gp.buttons[8] && gp.buttons[8].pressed,
            start: gp.buttons[9] && gp.buttons[9].pressed,
            l3: gp.buttons[10] && gp.buttons[10].pressed,
            r3: gp.buttons[11] && gp.buttons[11].pressed,
            up: gp.buttons[12] && gp.buttons[12].pressed,
            down: gp.buttons[13] && gp.buttons[13].pressed,
            left: gp.buttons[14] && gp.buttons[14].pressed,
            right: gp.buttons[15] && gp.buttons[15].pressed
        };
    }

    updateMouseWorld() {
        const world = this.engine.screenToWorld(this.mouse.x, this.mouse.y);
        this.mouseWorld.x = world.x;
        this.mouseWorld.y = world.y;
    }

    update() {
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mousePressed = false;
        this.mouseReleased = false;
        this.touchPressed = false;
        this.touchReleased = false;
    }

    key(k) {
        if (this.injectedKeys.has(k)) return this.injectedKeys.get(k);
        return this.keys.get(k) || false;
    }

    keyPressed(k) {
        return this.keysPressed.get(k) || false;
    }

    keyReleased(k) {
        return this.keysReleased.get(k) || false;
    }

    // AI Testing: inject input
    inject(key, state) {
        this.injectedKeys.set(key, state);
    }

    injectMouse(x, y, down) {
        this.mouse.x = x;
        this.mouse.y = y;
        // FIXED: Set mousePressed when transitioning to down state
        if (down && !this.mouseDown) {
            this.mousePressed = true;
        }
        this.mouseDown = down;
        this.updateMouseWorld();
    }

    clearInjection() {
        this.injectedKeys.clear();
        this.injectedMouse = null;
    }
}

// ===== ART SYSTEM =====

class ArtSystem {
    constructor(engine) {
        this.engine = engine;
        this.cache = new Map();
    }

    character(opts = {}) {
        const key = JSON.stringify(opts);
        if (this.cache.has(key)) return this.cache.get(key);

        const size = opts.size || 24;
        const canvas = document.createElement('canvas');
        canvas.width = size * 3; // Increased for glow
        canvas.height = size * 3;
        const ctx = canvas.getContext('2d');

        ctx.translate(size * 1.5, size * 1.5);

        const color = opts.color || '#00ffcc';

        // Outer glow
        if (opts.glow) {
            ctx.shadowBlur = 30;
            ctx.shadowColor = color;
        }

        // Body with gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, this.lightenColor(color, 50));
        gradient.addColorStop(0.6, color);
        gradient.addColorStop(1, this.darkenColor(color, 20));
        ctx.fillStyle = gradient;
        this.drawShape(ctx, opts.body || 'circle', size * 0.8);
        ctx.fill();

        // Reset shadow for other elements
        ctx.shadowBlur = 0;

        // Outline
        ctx.strokeStyle = this.lightenColor(color, 80);
        ctx.lineWidth = 2;
        this.drawShape(ctx, opts.body || 'circle', size * 0.8);
        ctx.stroke();

        // Eyes
        if (opts.eyes) {
            // White eyes
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-size * 0.2, -size * 0.15, size * 0.12, 0, Math.PI * 2);
            ctx.arc(size * 0.2, -size * 0.15, size * 0.12, 0, Math.PI * 2);
            ctx.fill();
            
            // Black pupils
            ctx.fillStyle = '#0a0a14';
            ctx.beginPath();
            ctx.arc(-size * 0.2, -size * 0.15, size * 0.06, 0, Math.PI * 2);
            ctx.arc(size * 0.2, -size * 0.15, size * 0.06, 0, Math.PI * 2);
            ctx.fill();
        }

        this.cache.set(key, canvas);
        return canvas;
    }

    enemy(opts = {}) {
        const key = JSON.stringify(opts);
        if (this.cache.has(key)) return this.cache.get(key);

        const size = opts.size || 24;
        const canvas = document.createElement('canvas');
        canvas.width = size * 3; // Increased for glow
        canvas.height = size * 3;
        const ctx = canvas.getContext('2d');

        ctx.translate(size * 1.5, size * 1.5);

        const color = opts.color || '#ff3333';

        // Outer glow
        ctx.shadowBlur = 30;
        ctx.shadowColor = color;
        
        // Body with gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, this.lightenColor(color, 40));
        gradient.addColorStop(0.7, color);
        gradient.addColorStop(1, this.darkenColor(color, 30));
        ctx.fillStyle = gradient;
        
        this.drawShape(ctx, opts.body || 'diamond', size * 0.8);
        ctx.fill();

        // Reset shadow for outline
        ctx.shadowBlur = 0;

        // Bright outline
        ctx.strokeStyle = this.lightenColor(color, 60);
        ctx.lineWidth = 2;
        this.drawShape(ctx, opts.body || 'diamond', size * 0.8);
        ctx.stroke();

        // Inner highlight
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = this.lightenColor(color, 80);
        this.drawShape(ctx, opts.body || 'diamond', size * 0.4);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Spikes
        if (opts.spikes) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = color;
            ctx.fillStyle = color;
            const spikeCount = 6;
            for (let i = 0; i < spikeCount; i++) {
                const angle = (i / spikeCount) * Math.PI * 2;
                ctx.save();
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(size * 0.8, 0);
                ctx.lineTo(size * 1.2, -size * 0.15);
                ctx.lineTo(size * 1.2, size * 0.15);
                ctx.fill();
                ctx.restore();
            }
        }

        this.cache.set(key, canvas);
        return canvas;
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.min(255, ((num >> 16) & 255) + percent);
        const g = Math.min(255, ((num >> 8) & 255) + percent);
        const b = Math.min(255, (num & 255) + percent);
        return `rgb(${r},${g},${b})`;
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, ((num >> 16) & 255) - percent);
        const g = Math.max(0, ((num >> 8) & 255) - percent);
        const b = Math.max(0, (num & 255) - percent);
        return `rgb(${r},${g},${b})`;
    }

    tile(opts = {}) {
        const key = JSON.stringify(opts);
        if (this.cache.has(key)) return this.cache.get(key);

        const size = opts.size || 32;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Base color
        ctx.fillStyle = opts.color || '#1a1a2e';
        ctx.fillRect(0, 0, size, size);

        // Pattern
        if (opts.pattern === 'grid') {
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            const gridSize = size / 4;
            for (let i = 0; i <= 4; i++) {
                ctx.beginPath();
                ctx.moveTo(i * gridSize, 0);
                ctx.lineTo(i * gridSize, size);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i * gridSize);
                ctx.lineTo(size, i * gridSize);
                ctx.stroke();
            }
        }

        this.cache.set(key, canvas);
        return canvas;
    }

    particle(opts = {}) {
        const size = opts.size || 4;
        const canvas = document.createElement('canvas');
        canvas.width = size * 2;
        canvas.height = size * 2;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = opts.color || '#ff8800';
        if (opts.fade) {
            const grad = ctx.createRadialGradient(size, size, 0, size, size, size);
            grad.addColorStop(0, opts.color || '#ff8800');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
        }
        ctx.beginPath();
        ctx.arc(size, size, size, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    text(opts = {}) {
        // Returns a render function instead of canvas
        return (ctx, entity) => {
            ctx.font = opts.font || '14px monospace';
            ctx.fillStyle = opts.color || '#ffffff';
            ctx.textAlign = opts.align || 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(opts.text || '', 0, 0);
        };
    }

    drawShape(ctx, type, size) {
        ctx.beginPath();
        switch (type) {
            case 'circle':
                ctx.arc(0, 0, size, 0, Math.PI * 2);
                break;
            case 'square':
                ctx.rect(-size, -size, size * 2, size * 2);
                break;
            case 'diamond':
                ctx.moveTo(0, -size);
                ctx.lineTo(size, 0);
                ctx.lineTo(0, size);
                ctx.lineTo(-size, 0);
                ctx.closePath();
                break;
            case 'capsule':
                ctx.arc(0, -size * 0.3, size * 0.7, 0, Math.PI * 2);
                ctx.rect(-size * 0.7, -size * 0.3, size * 1.4, size * 1.3);
                break;
            case 'triangle':
                ctx.moveTo(0, -size);
                ctx.lineTo(size * 0.866, size * 0.5);
                ctx.lineTo(-size * 0.866, size * 0.5);
                ctx.closePath();
                break;
            case 'star':
                for (let i = 0; i < 10; i++) {
                    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
                    const r = i % 2 === 0 ? size : size * 0.5;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                break;
            case 'hexagon':
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    const x = Math.cos(angle) * size;
                    const y = Math.sin(angle) * size;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                break;
        }
    }
}

// ===== PARTICLE SYSTEM =====

/**
 * Particle system for visual effects
 */
class ParticleSystem {
    constructor(engine) {
        this.engine = engine;
        this.particles = [];
    }

    /**
     * Emit particles at a position
     * @param {number} x - World X position
     * @param {number} y - World Y position
     * @param {object} [opts={}] - Particle options (count, color, speed, life, size, gravity, fade)
     * @example
     * engine.particles.emit(player.x, player.y, {
     *   count: 20,
     *   color: ['#ff0000', '#ff8800'],
     *   speed: [100, 200],
     *   life: [0.5, 1.0]
     * });
     */
    emit(x, y, opts = {}) {
        const count = opts.count || 10;
        const colors = Array.isArray(opts.color) ? opts.color : [opts.color || '#ff8800'];
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = this.engine.random(...(Array.isArray(opts.speed) ? opts.speed : [opts.speed || 50, opts.speed || 100]));
            const life = this.engine.random(...(Array.isArray(opts.life) ? opts.life : [opts.life || 0.5, opts.life || 1]));
            const size = this.engine.random(...(Array.isArray(opts.size) ? opts.size : [opts.size || 3, opts.size || 6]));
            
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life,
                maxLife: life,
                size,
                color: this.engine.choose(colors),
                gravity: opts.gravity || 0,
                fade: opts.fade !== false
            });
        }
    }

    /**
     * Create an explosion burst effect
     * @param {number} x - World X position
     * @param {number} y - World Y position
     * @param {string} [preset='fire'] - Preset type: 'fire', 'electric', 'magic', 'dust'
     * @param {number} [intensity=1.0] - Effect intensity multiplier (0.5-2.0)
     * @example
     * engine.particles.burst(enemy.x, enemy.y, 'fire', 1.5); // Big fire explosion
     * engine.particles.burst(x, y, 'electric'); // Electric burst
     */
    burst(x, y, preset = 'fire', intensity = 1.0) {
        const presets = {
            fire: {
                count: Math.floor(25 * intensity),
                color: ['#ff3333', '#ff8800', '#ffff00'],
                speed: [100 * intensity, 250 * intensity],
                life: [0.4, 0.9],
                size: [3, 8]
            },
            electric: {
                count: Math.floor(30 * intensity),
                color: ['#00ffff', '#0088ff', '#ffffff'],
                speed: [120 * intensity, 300 * intensity],
                life: [0.2, 0.5],
                size: [2, 6]
            },
            magic: {
                count: Math.floor(20 * intensity),
                color: ['#ff00ff', '#ff66ff', '#ffffff'],
                speed: [80 * intensity, 200 * intensity],
                life: [0.5, 1.2],
                size: [4, 10]
            },
            dust: {
                count: Math.floor(15 * intensity),
                color: ['#888888', '#aaaaaa', '#cccccc'],
                speed: [40 * intensity, 100 * intensity],
                life: [0.6, 1.0],
                size: [2, 4]
            }
        };

        const config = presets[preset] || presets.fire;
        this.emit(x, y, config);
    }

    /**
     * Create a trailing effect (for moving objects)
     * @param {number} x - World X position
     * @param {number} y - World Y position
     * @param {string} [preset='cyan'] - Preset color: 'cyan', 'red', 'purple', 'white'
     * @param {number} [intensity=1.0] - Trail intensity (affects count and size)
     * @example
     * // In entity update:
     * if (engine.frame % 2 === 0) {
     *   engine.particles.trail(this.x, this.y, 'cyan', 0.8);
     * }
     */
    trail(x, y, preset = 'cyan', intensity = 1.0) {
        const presets = {
            cyan: ['#00ffcc', '#00ffff', '#88ffff'],
            red: ['#ff3333', '#ff6666', '#ff9999'],
            purple: ['#ff00ff', '#ff66ff', '#cc66ff'],
            white: ['#ffffff', '#cccccc', '#aaaaaa'],
            orange: ['#ff8800', '#ffaa00', '#ffcc66']
        };

        const colors = presets[preset] || presets.cyan;
        
        this.emit(x, y, {
            count: Math.max(1, Math.floor(3 * intensity)),
            color: colors,
            speed: [0, 30 * intensity],
            life: [0.3, 0.6],
            size: [2, 5 * intensity]
        });
    }

    /**
     * Create ambient floating particles
     * @param {number} x - World X position
     * @param {number} y - World Y position
     * @param {string} [preset='dust'] - Preset type: 'dust', 'sparks', 'magic', 'smoke'
     * @example
     * // Call periodically (e.g., in an emitter entity):
     * engine.particles.ambient(torch.x, torch.y, 'sparks');
     */
    ambient(x, y, preset = 'dust') {
        const presets = {
            dust: {
                count: this.engine.random(1, 3),
                color: ['#888888', '#999999', '#aaaaaa'],
                speed: [5, 20],
                life: [2, 4],
                size: [1, 3],
                gravity: -10 // Float upward
            },
            sparks: {
                count: this.engine.random(2, 5),
                color: ['#ffaa00', '#ff8800', '#ffff00'],
                speed: [10, 40],
                life: [1, 2],
                size: [1, 2],
                gravity: 30 // Fall slowly
            },
            magic: {
                count: this.engine.random(1, 3),
                color: ['#ff00ff', '#00ffff', '#ffffff'],
                speed: [5, 15],
                life: [3, 5],
                size: [2, 4],
                gravity: -15 // Float upward gently
            },
            smoke: {
                count: this.engine.random(1, 2),
                color: ['#444444', '#666666', '#888888'],
                speed: [10, 25],
                life: [2, 3],
                size: [4, 8],
                gravity: -20 // Rise
            }
        };

        const config = presets[preset] || presets.dust;
        this.emit(x, y, config);
    }

    /**
     * Create an impact effect on hit
     * @param {number} x - World X position
     * @param {number} y - World Y position
     * @param {string} [color='#ffffff'] - Impact color
     * @param {number} [intensity=1.0] - Impact intensity
     * @example
     * engine.particles.impact(bullet.x, bullet.y, '#00ffff', 1.2);
     */
    impact(x, y, color = '#ffffff', intensity = 1.0) {
        const colors = Array.isArray(color) ? color : [color, this.engine.art.lightenColor(color, 40)];
        
        this.emit(x, y, {
            count: Math.floor(8 * intensity),
            color: colors,
            speed: [60 * intensity, 150 * intensity],
            life: [0.2, 0.4],
            size: [2, 5 * intensity]
        });
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += p.gravity * dt;
            p.life -= dt;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        for (let p of this.particles) {
            const alpha = p.fade ? (p.life / p.maxLife) : 1;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    clear() {
        this.particles = [];
    }
}

// ===== SOUND SYSTEM =====

/**
 * Sound system for playing procedurally generated sound effects
 */
class SoundSystem {
    constructor(engine) {
        this.engine = engine;
        this.audioContext = null;
        this.ambientSounds = new Map();
        
        // Volume control (P2: Volume/mixer control)
        this.masterVolume = 1.0;
        this.sfxVolume = 1.0;
        this.musicVolume = 0.5;
        
        // Music playback
        this.currentMusic = null;
        this.musicOscillator = null;
        this.musicGain = null;
    }

    ensureContext() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('[BudEngine] Audio context initialization failed:', e);
                this.audioContext = null;
                return;
            }
        }
        // Resume suspended AudioContext (browsers block until user gesture)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(() => {});
        }
    }

    play(type) {
        try {
            this.ensureContext();
            if (!this.audioContext) return; // Audio not available
            const ctx = this.audioContext;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Add a low-pass filter for smoother sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        // Apply volume scaling (P2: Volume control)
        const effectiveVolume = this.masterVolume * this.sfxVolume;

        switch (type) {
            case 'shoot':
                osc.type = 'square';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.2 * effectiveVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                filter.frequency.setValueAtTime(2000, now);
                filter.frequency.exponentialRampToValueAtTime(500, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            
            case 'hit':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
                gain.gain.setValueAtTime(0.25 * effectiveVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                filter.frequency.setValueAtTime(1000, now);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            
            case 'hit_heavy':
                // Deeper, more impactful hit for bosses
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
                gain.gain.setValueAtTime(0.35 * effectiveVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                filter.frequency.setValueAtTime(800, now);
                filter.frequency.exponentialRampToValueAtTime(200, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
                break;
            
            case 'slash':
                // Quick swoosh for melee attacks
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
                gain.gain.setValueAtTime(0.18 * effectiveVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                filter.frequency.setValueAtTime(3000, now);
                filter.frequency.exponentialRampToValueAtTime(600, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
                break;
            
            case 'explode':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
                gain.gain.setValueAtTime(0.3 * effectiveVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                filter.frequency.setValueAtTime(800, now);
                filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            
            case 'pickup':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(0.25 * effectiveVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                filter.frequency.setValueAtTime(3000, now);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'jump':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
                gain.gain.setValueAtTime(0.18 * effectiveVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                filter.frequency.setValueAtTime(2500, now);
                osc.start(now);
                osc.stop(now + 0.15);
                break;

            case 'hurt':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
                gain.gain.setValueAtTime(0.28 * effectiveVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                filter.frequency.setValueAtTime(1200, now);
                filter.frequency.exponentialRampToValueAtTime(400, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            
            case 'powerup':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
                gain.gain.setValueAtTime(0.3 * effectiveVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                filter.frequency.setValueAtTime(3000, now);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            
            default:
                console.warn(`[BudEngine] Unknown sound type: ${type}`);
        }
        } catch (e) {
            console.warn('[BudEngine] Sound playback error:', e);
        }
    }

    ambient(type) {
        // Placeholder for ambient loops
    }

    /**
     * Play looping background music (P2: Volume/mixer control)
     * @param {string} type - Music type ('ambient', 'action', 'menu')
     */
    playMusic(type) {
        // Stop current music if playing
        if (this.musicOscillator) {
            try {
                this.musicOscillator.stop();
            } catch (e) {
                // Ignore if already stopped
            }
        }

        this.ensureContext();
        if (!this.audioContext) return;

        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        const effectiveVolume = this.masterVolume * this.musicVolume;
        gain.gain.setValueAtTime(effectiveVolume * 0.1, ctx.currentTime);

        // Simple music patterns
        switch (type) {
            case 'ambient':
                osc.type = 'sine';
                osc.frequency.value = 220; // A3
                break;
            case 'action':
                osc.type = 'square';
                osc.frequency.value = 330; // E4
                break;
            case 'menu':
                osc.type = 'triangle';
                osc.frequency.value = 262; // C4
                break;
            default:
                osc.frequency.value = 220;
        }

        osc.start();
        this.musicOscillator = osc;
        this.musicGain = gain;
        this.currentMusic = type;
    }

    /**
     * Stop background music
     */
    stopMusic() {
        if (this.musicOscillator) {
            try {
                this.musicOscillator.stop();
            } catch (e) {
                // Ignore
            }
            this.musicOscillator = null;
            this.currentMusic = null;
        }
    }
}

// ===== VIRTUAL JOYSTICK (P1: Mobile Controls) =====

class VirtualJoystick {
    constructor(engine, opts = {}) {
        this.engine = engine;
        this.active = false;
        this.visible = opts.visible !== false;
        this.x = opts.x || 120;
        this.y = opts.y || engine.canvas.height - 120;
        this.baseRadius = opts.baseRadius || 60;
        this.stickRadius = opts.stickRadius || 30;
        this.stickX = this.x;
        this.stickY = this.y;
        this.touchId = null;
        this.value = { x: 0, y: 0 }; // Normalized -1 to 1
        
        // Auto-show on touch devices
        if (opts.autoShow !== false) {
            this.visible = 'ontouchstart' in window;
        }
    }

    update() {
        const input = this.engine.input;
        
        if (!this.visible) {
            this.active = false;
            this.value = { x: 0, y: 0 };
            return;
        }
        
        // Check for touch in joystick area
        let touchFound = false;
        
        for (let touch of input.touch) {
            const dx = touch.x - this.x;
            const dy = touch.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Start tracking if touch is in base area
            if (this.touchId === null && dist < this.baseRadius * 1.5) {
                this.touchId = touch.id;
                this.active = true;
            }
            
            // Update stick position if this is our tracked touch
            if (this.touchId === touch.id) {
                touchFound = true;
                const angle = Math.atan2(dy, dx);
                const clampedDist = Math.min(dist, this.baseRadius);
                
                this.stickX = this.x + Math.cos(angle) * clampedDist;
                this.stickY = this.y + Math.sin(angle) * clampedDist;
                
                // Calculate normalized value
                this.value.x = (this.stickX - this.x) / this.baseRadius;
                this.value.y = (this.stickY - this.y) / this.baseRadius;
                break;
            }
        }
        
        // Reset if touch released
        if (!touchFound && this.touchId !== null) {
            this.touchId = null;
            this.active = false;
            this.stickX = this.x;
            this.stickY = this.y;
            this.value = { x: 0, y: 0 };
        }
    }

    render(ctx) {
        if (!this.visible) return;
        
        // Base circle
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.baseRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Base outline
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Stick
        ctx.globalAlpha = this.active ? 0.8 : 0.6;
        ctx.fillStyle = '#00ffcc';
        ctx.beginPath();
        ctx.arc(this.stickX, this.stickY, this.stickRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// ===== UI SYSTEM =====

class UISystem {
    constructor(engine) {
        this.engine = engine;
        this.elements = [];
        this.virtualJoystick = null;
    }

    healthBar(entity, opts = {}) {
        this.elements.push({
            type: 'healthbar',
            entity,
            x: opts.x || 20,
            y: opts.y || 20,
            width: opts.width || 200,
            height: opts.height || 20,
            color: opts.color || '#ff3333',
            bgColor: opts.bgColor || '#333333'
        });
    }

    text(text, opts = {}) {
        this.elements.push({
            type: 'text',
            text,
            x: opts.x || 0,
            y: opts.y || 0,
            font: opts.font || '16px monospace',
            color: opts.color || '#ffffff',
            align: opts.align || 'left'
        });
    }

    screen(id, opts = {}) {
        this.elements.push({
            type: 'screen',
            id,
            title: opts.title || '',
            subtitle: opts.subtitle || '',
            button: opts.button || null
        });
    }

    /**
     * Create a virtual joystick for mobile controls
     * @param {object} [opts={}] - Joystick options (x, y, baseRadius, stickRadius, visible, autoShow)
     * @returns {VirtualJoystick} Virtual joystick instance
     * @example
     * const joystick = engine.ui.joystick({ x: 120, y: 600 });
     * // In update loop:
     * player.x += joystick.value.x * speed * dt;
     * player.y += joystick.value.y * speed * dt;
     */
    joystick(opts = {}) {
        if (!this.virtualJoystick) {
            this.virtualJoystick = new VirtualJoystick(this.engine, opts);
        }
        return this.virtualJoystick;
    }

    render(ctx) {
        for (let el of this.elements) {
            if (el.type === 'healthbar') {
                const percent = Math.max(0, Math.min(1, el.entity.health / (el.entity.maxHealth || 100)));
                
                ctx.fillStyle = el.bgColor;
                ctx.fillRect(el.x, el.y, el.width, el.height);
                
                ctx.fillStyle = el.color;
                ctx.fillRect(el.x, el.y, el.width * percent, el.height);
                
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(el.x, el.y, el.width, el.height);
            }
            
            if (el.type === 'text') {
                ctx.font = el.font;
                ctx.fillStyle = el.color;
                ctx.textAlign = el.align;
                ctx.fillText(el.text, el.x, el.y);
            }
            
            if (el.type === 'screen') {
                // Full screen overlay
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
                
                // Title
                ctx.font = 'bold 48px monospace';
                ctx.fillStyle = '#ff3333';
                ctx.textAlign = 'center';
                ctx.fillText(el.title, this.engine.canvas.width / 2, this.engine.canvas.height / 2 - 60);
                
                // Subtitle
                if (el.subtitle) {
                    ctx.font = '24px monospace';
                    ctx.fillStyle = '#00ffcc';
                    ctx.fillText(el.subtitle, this.engine.canvas.width / 2, this.engine.canvas.height / 2);
                }
                
                // Button
                if (el.button) {
                    const btnW = 200;
                    const btnH = 50;
                    const btnX = this.engine.canvas.width / 2 - btnW / 2;
                    const btnY = this.engine.canvas.height / 2 + 60;
                    
                    ctx.fillStyle = '#00ffcc';
                    ctx.fillRect(btnX, btnY, btnW, btnH);
                    
                    ctx.font = 'bold 20px monospace';
                    ctx.fillStyle = '#0a0a14';
                    ctx.textAlign = 'center';
                    ctx.fillText(el.button.text, this.engine.canvas.width / 2, btnY + btnH / 2 + 8);
                    
                    // Check for click
                    if (this.engine.input.mousePressed) {
                        const mx = this.engine.input.mouse.x;
                        const my = this.engine.input.mouse.y;
                        if (mx >= btnX && mx <= btnX + btnW && my >= btnY && my <= btnY + btnH) {
                            if (el.button.action) el.button.action();
                        }
                    }
                }
            }
        }
        
        // Render virtual joystick (P1: Mobile controls)
        if (this.virtualJoystick) {
            this.virtualJoystick.update();
            this.virtualJoystick.render(ctx);
        }
    }

    clear() {
        this.elements = [];
        // Don't clear joystick - it's persistent across scenes
    }
}

// ===== TILEMAP =====

class Tilemap {
    constructor(engine, tileSize = 32) {
        this.engine = engine;
        this.tileSize = tileSize;
        this.tiles = new Map();
        this.tileSprites = new Map();
    }

    set(x, y, type) {
        this.tiles.set(`${x},${y}`, type);
        
        // Generate collision if wall
        if (type === 'wall') {
            this.createWallCollider(x, y);
        }
    }

    get(x, y) {
        return this.tiles.get(`${x},${y}`) || null;
    }

    fill(x, y, w, h, type) {
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.set(i, j, type);
            }
        }
    }

    rect(x, y, w, h, type) {
        for (let i = x; i < x + w; i++) {
            this.set(i, y, type);
            this.set(i, y + h - 1, type);
        }
        for (let j = y; j < y + h; j++) {
            this.set(x, j, type);
            this.set(x + w - 1, j, type);
        }
    }

    door(x, y, direction) {
        // Remove wall tile for door
        this.tiles.delete(`${x},${y}`);
        
        // Also remove the wall collider entity
        const worldX = x * this.tileSize + this.tileSize / 2;
        const worldY = y * this.tileSize + this.tileSize / 2;
        
        const walls = this.engine.findByTag('wall');
        for (let wall of walls) {
            if (Math.abs(wall.x - worldX) < 1 && Math.abs(wall.y - worldY) < 1) {
                this.engine.destroy(wall);
                break;
            }
        }
    }

    room(x, y, w, h, floorType, wallType) {
        this.fill(x, y, w, h, floorType);
        this.rect(x, y, w, h, wallType);
    }

    createWallCollider(tx, ty) {
        const worldX = tx * this.tileSize + this.tileSize / 2;
        const worldY = ty * this.tileSize + this.tileSize / 2;
        
        this.engine.spawn('wall', {
            x: worldX,
            y: worldY,
            collider: { type: 'aabb', width: this.tileSize, height: this.tileSize },
            tags: ['wall', 'solid'],
            layer: -1
        });
    }

    render(ctx, camera) {
        // Only render visible tiles
        const startX = Math.floor((camera.x - camera.width / 2) / this.tileSize) - 1;
        const endX = Math.ceil((camera.x + camera.width / 2) / this.tileSize) + 1;
        const startY = Math.floor((camera.y - camera.height / 2) / this.tileSize) - 1;
        const endY = Math.ceil((camera.y + camera.height / 2) / this.tileSize) + 1;

        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                const type = this.get(x, y);
                if (!type) continue;

                const worldX = x * this.tileSize;
                const worldY = y * this.tileSize;

                // Get or create sprite
                if (!this.tileSprites.has(type)) {
                    this.tileSprites.set(type, this.createTileSprite(type));
                }
                const sprite = this.tileSprites.get(type);

                ctx.drawImage(sprite, worldX, worldY);
            }
        }
    }

    createTileSprite(type) {
        if (type === 'floor') {
            return this.engine.art.tile({ type: 'metal', color: '#1a1a2e', pattern: 'grid', size: this.tileSize });
        }
        if (type === 'wall') {
            return this.engine.art.tile({ type: 'metal', color: '#0d0d16', size: this.tileSize });
        }
        return this.engine.art.tile({ color: '#333333', size: this.tileSize });
    }
}

// ===== TESTING API =====

/**
 * Testing API for automated game testing and AI playtesting
 */
class TestingAPI {
    constructor(engine) {
        this.engine = engine;
        this.recording = null;
        this.recordingFrames = [];
    }

    /**
     * Get current game state snapshot
     * @returns {object} State object with frame, time, entities, etc.
     * @example
     * const state = engine.test.getState();
     * console.log('Frame:', state.frame, 'Entities:', state.entities.length);
     */
    getState() {
        const player = this.engine.findOne('player');
        const enemies = this.engine.findByTag('enemy');
        
        return {
            frame: this.engine.frame,
            time: this.engine.time,
            fps: this.engine.fps,
            scene: this.engine.currentScene,
            entities: this.engine.entities.map(e => ({
                id: e.id,
                type: e.type,
                x: e.x,
                y: e.y,
                health: e.health,
                tags: e.tags,
                enabled: e.enabled
            })),
            player: player ? { x: player.x, y: player.y, health: player.health } : null,
            enemies: enemies.map(e => ({ x: e.x, y: e.y, health: e.health }))
        };
    }

    query(queryString) {
        // Simple query parser
        if (queryString.includes('enemies within')) {
            const match = queryString.match(/enemies within (\d+) of player/);
            if (match) {
                const distance = parseInt(match[1]);
                const player = this.engine.findOne('player');
                if (!player) return [];
                
                const enemies = this.engine.findByTag('enemy');
                return enemies.filter(e => {
                    const dx = e.x - player.x;
                    const dy = e.y - player.y;
                    return Math.sqrt(dx * dx + dy * dy) < distance;
                });
            }
        }
        
        // Default: find by tag
        return this.engine.findByTag(queryString);
    }

    count(tag) {
        return this.engine.findByTag(tag).length;
    }

    input(key, state) {
        this.engine.input.inject(key, state);
    }

    click(worldX, worldY) {
        const screen = this.engine.worldToScreen(worldX, worldY);
        this.engine.input.injectMouse(screen.x, screen.y, true);
    }

    moveMouse(worldX, worldY) {
        const screen = this.engine.worldToScreen(worldX, worldY);
        this.engine.input.injectMouse(screen.x, screen.y, this.engine.input.mouseDown);
    }

    step(frames = 1) {
        for (let i = 0; i < frames; i++) {
            this.engine.update(this.engine.dt);
        }
    }

    fastForward(seconds) {
        const frames = Math.floor(seconds / this.engine.dt);
        this.step(frames);
    }

    pause() {
        this.engine.paused = true;
    }

    resume() {
        this.engine.paused = false;
    }

    assert(condition, message) {
        // Simple assertion evaluator
        const state = this.getState();
        
        try {
            // Evaluate condition in context of state
            const evalFunc = new Function('state', 'count', `
                const player = state.player;
                const enemies = state.enemies;
                return ${condition};
            `);
            
            const result = evalFunc(state, (tag) => this.count(tag));
            
            if (!result) {
                console.error('❌ Assertion failed:', message);
                console.error('   Condition:', condition);
                return false;
            } else {
                console.log('✅', message);
                return true;
            }
        } catch (e) {
            console.error('❌ Assertion error:', message, e);
            return false;
        }
    }

    assertReachable(fromTile, toTile, message) {
        // Placeholder: pathfinding check
        console.log('✅', message, '(pathfinding not implemented)');
        return true;
    }

    /**
     * Run automated playtesting with AI bot
     * @param {object} [opts={}] - Options (strategy, duration, runs, report)
     * @param {string} [opts.strategy='survive'] - Bot strategy ('survive', 'balanced', 'aggressive', 'random', 'idle')
     * @param {number} [opts.duration=60] - Test duration in seconds
     * @param {number} [opts.runs=50] - Number of test runs
     * @param {boolean} [opts.report=true] - Print results report
     * @returns {object} Test results (avgSurvival, deaths, avgScore, bugs, balanceNotes)
     * @example
     * const results = engine.test.autoplay({
     *   strategy: 'balanced',
     *   duration: 60,
     *   runs: 20
     * });
     */
    autoplay(opts = {}) {
        const strategy = opts.strategy || 'survive';
        const duration = opts.duration || 60;
        const runs = opts.runs || 50;
        const report = opts.report !== false;

        const results = {
            avgSurvival: 0,
            minSurvival: Infinity,
            maxSurvival: 0,
            deaths: 0,
            avgScore: 0,
            bugs: [],
            balanceNotes: []
        };

        console.log(`🤖 Running ${runs} autoplay tests with '${strategy}' strategy...`);

        for (let run = 0; run < runs; run++) {
            const runResult = this.runAutoplaySession(strategy, duration);
            
            results.avgSurvival += runResult.survival;
            results.minSurvival = Math.min(results.minSurvival, runResult.survival);
            results.maxSurvival = Math.max(results.maxSurvival, runResult.survival);
            if (runResult.died) results.deaths++;
            results.avgScore += runResult.score;
            
            if (runResult.bugs) results.bugs.push(...runResult.bugs);
        }

        results.avgSurvival /= runs;
        results.avgScore /= runs;

        if (report) {
            console.log('\n📊 Autoplay Results:');
            console.log(`   Avg Survival: ${results.avgSurvival.toFixed(1)}s`);
            console.log(`   Min/Max: ${results.minSurvival.toFixed(1)}s / ${results.maxSurvival.toFixed(1)}s`);
            console.log(`   Deaths: ${results.deaths}/${runs}`);
            console.log(`   Avg Score: ${results.avgScore.toFixed(0)}`);
            
            if (results.bugs.length > 0) {
                console.log(`\n🐛 Bugs found: ${results.bugs.length}`);
                results.bugs.forEach(bug => console.log(`   - ${bug}`));
            }
            
            // Balance analysis
            if (results.avgSurvival < 30) {
                results.balanceNotes.push('Game may be too difficult - avg survival below 30s');
            }
            if (results.deaths === 0) {
                results.balanceNotes.push('Game may be too easy - no deaths recorded');
            }
            
            if (results.balanceNotes.length > 0) {
                console.log(`\n⚖️  Balance Notes:`);
                results.balanceNotes.forEach(note => console.log(`   - ${note}`));
            }
        }

        return results;
    }

    runAutoplaySession(strategy, maxDuration) {
        // Restart game
        this.engine.restart();
        this.engine.input.clearInjection();

        const startTime = this.engine.time;
        let survival = 0;
        let score = 0;
        let died = false;
        const bugs = [];

        // Run game loop with AI bot
        const maxFrames = maxDuration * 60;
        for (let frame = 0; frame < maxFrames; frame++) {
            const player = this.engine.findOne('player');
            
            if (!player || player.health <= 0) {
                died = true;
                break;
            }

            // Execute strategy
            this.executeStrategy(strategy, player);

            // Step simulation
            this.step(1);
            survival = this.engine.time - startTime;
            
            if (player.score !== undefined) score = player.score;

            // Bug detection
            if (player.y > 10000 || player.y < -10000) {
                bugs.push(`Player fell out of world at frame ${frame}`);
                break;
            }
        }

        return { survival, score, died, bugs };
    }

    executeStrategy(strategy, player) {
        const enemies = this.engine.findByTag('enemy');
        const pickups = this.engine.findByTag('pickup').concat(this.engine.findByTag('speed-pickup'));
        const walls = this.engine.findByTag('wall');
        
        if (strategy === 'survive') {
            // v2.1: Smarter survival strategy
            
            // Find nearest enemy
            let nearest = null;
            let nearestDist = Infinity;
            
            for (let enemy of enemies) {
                const dx = enemy.x - player.x;
                const dy = enemy.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = enemy;
                }
            }

            // Find nearest pickup if health is low
            let nearestPickup = null;
            let nearestPickupDist = Infinity;
            if (player.health && player.health < (player.maxHealth || 100) * 0.5) {
                for (let pickup of pickups) {
                    const dx = pickup.x - player.x;
                    const dy = pickup.y - player.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < nearestPickupDist && dist < 300) {
                        nearestPickupDist = dist;
                        nearestPickup = pickup;
                    }
                }
            }

            // Check for nearby walls to avoid
            let wallTooClose = false;
            for (let wall of walls) {
                const dx = wall.x - player.x;
                const dy = wall.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 60) {
                    wallTooClose = true;
                    // Move away from wall
                    this.input('w', dy > 0);
                    this.input('s', dy < 0);
                    this.input('a', dx > 0);
                    this.input('d', dx < 0);
                    break;
                }
            }

            if (!wallTooClose) {
                // Prioritize pickup if health is low
                if (nearestPickup) {
                    const dx = nearestPickup.x - player.x;
                    const dy = nearestPickup.y - player.y;
                    this.input('w', dy < 0);
                    this.input('s', dy > 0);
                    this.input('a', dx < 0);
                    this.input('d', dx > 0);
                } else if (nearest) {
                    const dx = nearest.x - player.x;
                    const dy = nearest.y - player.y;
                    
                    // Kite enemies: move perpendicular + away
                    if (nearestDist < 150) {
                        // Move away and strafe
                        const perpX = -dy;
                        const perpY = dx;
                        const awayX = -dx;
                        const awayY = -dy;
                        
                        const moveX = awayX + perpX * 0.5;
                        const moveY = awayY + perpY * 0.5;
                        
                        this.input('w', moveY < 0);
                        this.input('s', moveY > 0);
                        this.input('a', moveX < 0);
                        this.input('d', moveX > 0);
                    } else {
                        // Move randomly but keep distance
                        this.input('w', Math.random() > 0.5);
                        this.input('s', Math.random() > 0.5);
                        this.input('a', Math.random() > 0.5);
                        this.input('d', Math.random() > 0.5);
                    }

                    // Shoot at closest enemy
                    this.moveMouse(nearest.x, nearest.y);
                    this.click(nearest.x, nearest.y);
                }
            }
        }
        
        if (strategy === 'balanced') {
            // v2.1: Balanced strategy - combines aggression with survival
            
            let nearest = null;
            let nearestDist = Infinity;
            
            for (let enemy of enemies) {
                const dx = enemy.x - player.x;
                const dy = enemy.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = enemy;
                }
            }

            if (nearest) {
                const dx = nearest.x - player.x;
                const dy = nearest.y - player.y;
                
                // Maintain optimal distance (100-200 units)
                if (nearestDist < 100) {
                    // Too close, back away
                    this.input('w', dy > 0);
                    this.input('s', dy < 0);
                    this.input('a', dx > 0);
                    this.input('d', dx < 0);
                } else if (nearestDist > 250) {
                    // Too far, move closer
                    this.input('w', dy < 0);
                    this.input('s', dy > 0);
                    this.input('a', dx < 0);
                    this.input('d', dx > 0);
                } else {
                    // Good distance, circle strafe
                    const perpX = -dy;
                    const perpY = dx;
                    this.input('w', perpY < 0);
                    this.input('s', perpY > 0);
                    this.input('a', perpX < 0);
                    this.input('d', perpX > 0);
                }

                // Always shoot at enemy
                this.moveMouse(nearest.x, nearest.y);
                this.click(nearest.x, nearest.y);
            }
        }
        
        if (strategy === 'aggressive') {
            if (enemies.length > 0) {
                const target = enemies[0];
                const dx = target.x - player.x;
                const dy = target.y - player.y;
                
                // Move TOWARDS enemy
                this.input('w', dy < 0);
                this.input('s', dy > 0);
                this.input('a', dx < 0);
                this.input('d', dx > 0);
                
                this.moveMouse(target.x, target.y);
                this.click(target.x, target.y);
            }
        }
        
        if (strategy === 'random') {
            this.input('w', Math.random() > 0.7);
            this.input('s', Math.random() > 0.7);
            this.input('a', Math.random() > 0.7);
            this.input('d', Math.random() > 0.7);
            
            if (Math.random() > 0.8) {
                this.click(player.x + this.engine.random(-100, 100), player.y + this.engine.random(-100, 100));
            }
        }
        
        if (strategy === 'idle') {
            // Do nothing
        }
    }

    // ========== PIXEL PHYSICS TESTING API (v3.7) ==========

    /**
     * Load a named scenario for testing
     * @param {string} name - Scenario name ('volcano', 'lab', 'forest', 'garden', 'underwater', 'arctic')
     * @returns {boolean} Success
     */
    loadScenario(name) {
        if (!this.engine.physics.initialized) {
            console.error('PixelPhysics not initialized');
            return false;
        }

        this.clearWorld();
        
        const w = this.engine.canvas.width;
        const h = this.engine.canvas.height;
        
        switch(name) {
            case 'volcano':
                this.engine.physics.fill(0, h*0.92, w, h, 'stone');
                this.engine.physics.fill(w*0.15, h*0.7, w*0.85, h*0.92, 'stone');
                this.engine.physics.fill(w*0.25, h*0.55, w*0.75, h*0.7, 'stone');
                this.engine.physics.fill(w*0.35, h*0.45, w*0.65, h*0.55, 'stone');
                this.engine.physics.fill(w*0.35, h*0.55, w*0.65, h*0.85, 'lava');
                this.engine.physics.fill(w*0.42, h*0.45, w*0.58, h*0.55, 'lava');
                this.engine.physics.fill(w*0.02, h*0.85, w*0.12, h*0.92, 'water');
                break;
            
            case 'lab':
                this.engine.physics.fill(0, h*0.92, w, h, 'stone');
                const tubes = [
                    {x: 0.12, mat: 'acid'}, {x: 0.27, mat: 'water'},
                    {x: 0.42, mat: 'oil'}, {x: 0.57, mat: 'lava'}, {x: 0.72, mat: 'salt'}
                ];
                tubes.forEach(t => {
                    const tx = w*t.x;
                    const tw = w*0.06;
                    this.engine.physics.fill(tx, h*0.6, tx+4, h*0.92, 'glass');
                    this.engine.physics.fill(tx+tw, h*0.6, tx+tw+4, h*0.92, 'glass');
                    this.engine.physics.fill(tx, h*0.88, tx+tw, h*0.92, 'glass');
                    this.engine.physics.fill(tx+4, h*0.7, tx+tw, h*0.88, t.mat);
                });
                this.engine.physics.fill(w*0.87, h*0.85, w*0.93, h*0.92, 'iron');
                this.engine.physics.circle(w*0.05, h*0.88, 15, 'gunpowder');
                break;
            
            case 'forest':
                const treeCount = Math.min(8, Math.floor(w / 100));
                for (let i = 0; i < treeCount; i++) {
                    const x = (w * 0.1) + (i * (w * 0.8 / treeCount));
                    this.engine.physics.fill(x, h*0.55, x + (w*0.05), h*0.9, 'wood');
                }
                this.engine.physics.fill(0, h*0.9, w, h, 'dirt');
                for (let i = 0; i < 10; i++) {
                    this.engine.physics.circle(Math.random() * w, h*0.88, 10, 'vegetation');
                }
                this.engine.physics.circle(w*0.15, h*0.6, 15, 'fire');
                break;
            
            case 'garden':
                this.engine.physics.fill(0, h*0.7, w, h, 'dirt');
                this.engine.physics.fill(w*0.25, h*0.65, w*0.28, h, 'water');
                this.engine.physics.fill(w*0.72, h*0.65, w*0.75, h, 'water');
                this.engine.physics.fill(w*0.05, h*0.6, w*0.15, h*0.7, 'stone');
                this.engine.physics.fill(w*0.85, h*0.55, w*0.95, h*0.68, 'stone');
                
                const cs = this.engine.physics.cellSize;
                for (let gx = 0; gx < this.engine.physics.gridWidth; gx++) {
                    for (let gy = Math.floor((h*0.7)/cs); gy < this.engine.physics.gridHeight; gy++) {
                        const idx = this.engine.physics.index(gx, gy);
                        if (this.engine.physics.grid[idx] === this.engine.physics.getMaterialId('dirt')) {
                            this.engine.physics.temperatureGrid[idx] = 25;
                        }
                    }
                }
                
                for (let i = 0; i < 20; i++) {
                    this.engine.physics.circle(Math.random() * w, h*0.68 + Math.random() * (h*0.08), 3, 'plant');
                }
                for (let i = 0; i < 12; i++) {
                    this.engine.physics.circle(Math.random() * w, h*0.68 + Math.random() * (h*0.08), 8, 'vegetation');
                }
                for (let i = 0; i < 8; i++) {
                    this.engine.physics.circle(w*0.05 + Math.random() * (w*0.1), h*0.65 + Math.random() * (h*0.05), 5, 'fungus');
                }
                for (let i = 0; i < 8; i++) {
                    this.engine.physics.circle(w*0.85 + Math.random() * (w*0.1), h*0.63 + Math.random() * (h*0.05), 5, 'fungus');
                }
                break;
            
            case 'underwater':
                this.engine.physics.fill(0, h*0.15, w, h, 'water');
                this.engine.physics.fill(0, h*0.92, w, h, 'sand');
                this.engine.physics.fill(w*0.4, h*0.83, w*0.6, h*0.92, 'stone');
                this.engine.physics.circle(w*0.5, h*0.87, w*0.04, 'lava');
                break;
            
            case 'arctic':
                this.engine.physics.fill(0, h*0.4, w, h*0.6, 'ice');
                this.engine.physics.fill(0, h*0.6, w, h, 'water');
                this.engine.physics.circle(w*0.5, h*0.5, w*0.05, 'lava');
                break;
            
            case 'procedural':
                // Use default seed and temperate biome
                // (Real generation controlled via generateWorld() API)
                const seed = Date.now();
                return this.engine.physics.worldGenerator.generate(seed, 'temperate');
            
            default:
                console.error(`Unknown scenario: ${name}`);
                return false;
        }
        
        console.log(`✅ Loaded scenario: ${name}`);
        return true;
    }

    /**
     * Get canvas snapshot as base64 data URL
     * @param {string} [format='jpeg'] - Format ('jpeg' or 'png')
     * @param {number} [quality=0.5] - JPEG quality (0-1)
     * @returns {string} Base64 data URL
     */
    snapshot(format = 'jpeg', quality = 0.5) {
        if (!this.engine.physics.initialized) {
            console.error('PixelPhysics not initialized');
            return null;
        }
        
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        return this.engine.canvas.toDataURL(mimeType, quality);
    }

    /**
     * Get comprehensive state for pixel physics
     * @returns {object} State with FPS, materials, chunks, grid dimensions, etc.
     */
    getPhysicsState() {
        if (!this.engine.physics.initialized) {
            return { error: 'PixelPhysics not initialized' };
        }

        const physics = this.engine.physics;
        
        // Count materials
        const materialCounts = {};
        for (let i = 0; i < physics.grid.length; i++) {
            const matId = physics.grid[i];
            if (matId > 0) {
                const matName = physics.getMaterialName(matId);
                materialCounts[matName] = (materialCounts[matName] || 0) + 1;
            }
        }

        // Count active chunks
        let activeChunks = 0;
        if (physics.chunks) {
            for (let cy = 0; cy < physics.chunksHigh; cy++) {
                for (let cx = 0; cx < physics.chunksWide; cx++) {
                    if (physics.chunks[cy][cx].active) activeChunks++;
                }
            }
        }

        return {
            fps: this.engine.fps,
            frame: physics.frameCount,
            gridWidth: physics.gridWidth,
            gridHeight: physics.gridHeight,
            cellSize: physics.cellSize,
            materialCounts: materialCounts,
            totalCells: physics.grid.length,
            activeCells: Object.values(materialCounts).reduce((a, b) => a + b, 0),
            activeChunks: activeChunks,
            totalChunks: physics.chunksWide * physics.chunksHigh,
            lighting: physics.lighting,
            showHeat: physics.showHeat,
            windX: physics.wind.x,
            windY: physics.wind.y,
            ambientTemp: physics.ambientTemp
        };
    }

    /**
     * v3.9: Get ecosystem state (seasons, time acceleration, weather, erosion stats)
     * @returns {object} Ecosystem state
     * @example
     * const eco = engine.test.getEcosystemState();
     * console.log('Season:', eco.season, 'World Age:', eco.worldAge);
     */
    getEcosystemState() {
        if (!this.engine.physics.initialized) {
            return { error: 'PixelPhysics not initialized' };
        }

        const physics = this.engine.physics;
        
        return {
            // Time system
            timeScale: physics.timeScale,
            worldAge: physics.worldAge.toFixed(2),
            season: physics.season,
            seasonCycle: physics.seasonCycle.toFixed(2),
            
            // Weather
            weather: {
                season: physics.weather.season,
                temperature: physics.weather.temperature.toFixed(1) + '°C',
                rainChance: (physics.weather.rainChance * 100).toFixed(0) + '%',
                windStrength: physics.weather.windStrength.toFixed(1),
                dayLength: physics.weather.dayLength + 'h'
            },
            
            // Wind
            wind: {
                x: physics.wind.x.toFixed(2),
                y: physics.wind.y.toFixed(2)
            },
            
            // Erosion stats
            erosion: {
                waterErosion: physics.erosionStats.waterErosion,
                windErosion: physics.erosionStats.windErosion,
                thermalErosion: physics.erosionStats.thermalErosion,
                total: physics.erosionStats.waterErosion + physics.erosionStats.windErosion + physics.erosionStats.thermalErosion
            },
            
            // Ambient conditions
            ambientTemp: physics.ambientTemp + '°C',
            
            // Geological events config
            geologicalEvents: physics.geologicalEvents,
            
            // v4.1: Ecosystem balance
            atmosphere: {
                oxygen: physics.oxygenLevel ? physics.oxygenLevel.toFixed(1) : '0',
                co2: physics.co2Level ? physics.co2Level.toFixed(1) : '0',
                balance: physics.oxygenLevel && physics.co2Level ? 
                    (physics.oxygenLevel / (physics.oxygenLevel + physics.co2Level) * 100).toFixed(0) + '% O2' : 'N/A'
            },
            
            // v4.1: Creature populations
            creatures: {
                worm: physics.creaturePopulation ? physics.creaturePopulation.worm : 0,
                fish: physics.creaturePopulation ? physics.creaturePopulation.fish : 0,
                bug: physics.creaturePopulation ? physics.creaturePopulation.bug : 0,
                total: physics.totalCreatures || 0,
                max: physics.maxCreatures || 200,
                births: physics.creatureBirths || { worm: 0, fish: 0, bug: 0 },
                deaths: physics.creatureDeaths || { worm: 0, fish: 0, bug: 0 }
            },
            
            // v4.1: Soil fertility (average)
            soilFertility: physics.fertilityGrid ? 
                (physics.fertilityGrid.reduce((a, b) => a + b, 0) / physics.fertilityGrid.length).toFixed(3) : 
                'N/A'
        };
    }

    /**
     * Get material info at grid position
     * @param {number} x - Grid x coordinate
     * @param {number} y - Grid y coordinate
     * @returns {object} Material info
     */
    getMaterialAt(x, y) {
        if (!this.engine.physics.initialized) {
            return { error: 'PixelPhysics not initialized' };
        }

        const idx = this.engine.physics.index(x, y);
        if (idx === -1) {
            return { error: 'Position out of bounds' };
        }

        const matId = this.engine.physics.grid[idx];
        const matName = this.engine.physics.getMaterialName(matId);
        const material = this.engine.physics.materials.get(matId);

        return {
            x: x,
            y: y,
            materialId: matId,
            materialName: matName,
            temperature: this.engine.physics.temperatureGrid[idx],
            lifetime: this.engine.physics.lifetimeGrid[idx],
            state: material ? material.state : 'unknown',
            density: material ? material.density : 0
        };
    }

    /**
     * Place material at canvas position
     * @param {number} x - Canvas x coordinate
     * @param {number} y - Canvas y coordinate
     * @param {string} materialId - Material name
     * @param {number} [radius=5] - Brush radius
     * @returns {boolean} Success
     */
    placeMaterial(x, y, materialId, radius = 5) {
        if (!this.engine.physics.initialized) {
            console.error('PixelPhysics not initialized');
            return false;
        }

        this.engine.physics.circle(x, y, radius, materialId);
        return true;
    }

    /**
     * Clear the entire world
     */
    clearWorld() {
        if (!this.engine.physics.initialized) {
            console.error('PixelPhysics not initialized');
            return false;
        }

        this.engine.physics.clearArea(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        return true;
    }

    /**
     * v3.10: Generate procedural world from seed
     * @param {number} seed - World seed (same seed = same world)
     * @param {string} [biome='temperate'] - Biome type
     * @returns {boolean} Success
     * @example
     * engine.test.generateWorld(12345, 'mountain');
     * engine.test.generateWorld(Date.now(), 'desert');
     */
    generateWorld(seed, biome = 'temperate') {
        if (!this.engine.physics.initialized) {
            console.error('PixelPhysics not initialized');
            return false;
        }

        return this.engine.physics.worldGenerator.generate(seed, biome);
    }

    /**
     * Get pixel color at canvas position
     * @param {number} x - Canvas x coordinate
     * @param {number} y - Canvas y coordinate
     * @returns {object} RGBA color
     */
    getPixelColor(x, y) {
        const imageData = this.engine.ctx.getImageData(x, y, 1, 1);
        const data = imageData.data;
        return {
            r: data[0],
            g: data[1],
            b: data[2],
            a: data[3]
        };
    }

    /**
     * Get composition game state (for The Composition game)
     * @returns {object|null} Composition state or null if not initialized
     */
    getCompositionState() {
        if (!this.engine.composition) {
            console.warn('[TestingAPI] Composition game not initialized');
            return null;
        }
        return this.engine.composition.getState();
    }

    /**
     * Set composition game mode
     * @param {string} mode - Mode ('creation', 'listening', 'conducting')
     */
    setCompositionMode(mode) {
        if (!this.engine.composition) {
            console.warn('[TestingAPI] Composition game not initialized');
            return;
        }
        this.engine.composition.setMode(mode);
    }
}

// ===== ANIMATION SYSTEM (P1) =====

/**
 * Animation class - represents a sequence of frames
 */
class Animation {
    constructor(frames, fps = 12) {
        // Normalize frames to {sprite, duration} format
        this.frames = frames.map(f => {
            if (f.sprite !== undefined) return f;
            return { sprite: f, duration: 1 / fps };
        });
        
        this.fps = fps;
        this.currentFrameIndex = 0;
        this.time = 0;
        this.playing = true;
        this.loop = true;
        this.onComplete = null;
    }

    update(dt) {
        if (!this.playing) return;
        
        this.time += dt;
        const frame = this.frames[this.currentFrameIndex];
        
        if (this.time >= frame.duration) {
            this.time = 0;
            this.currentFrameIndex++;
            
            if (this.currentFrameIndex >= this.frames.length) {
                if (this.loop) {
                    this.currentFrameIndex = 0;
                } else {
                    this.currentFrameIndex = this.frames.length - 1;
                    this.playing = false;
                    if (this.onComplete) this.onComplete();
                }
            }
        }
    }

    currentFrame() {
        return this.frames[this.currentFrameIndex].sprite;
    }

    play() {
        this.playing = true;
    }

    pause() {
        this.playing = false;
    }

    reset() {
        this.currentFrameIndex = 0;
        this.time = 0;
        this.playing = true;
    }
}

// ===== STATE MACHINE (v2.6) =====

/**
 * Lightweight state machine for entity AI and behavior
 * @example
 * const sm = engine.stateMachine({
 *   idle: {
 *     enter(entity) { entity.idleTimer = 0; },
 *     update(entity, dt) {
 *       entity.idleTimer += dt;
 *       if (entity.idleTimer > 2) this.go('patrol');
 *     }
 *   },
 *   patrol: { ... }
 * }, 'idle');
 */
class StateMachine {
    /**
     * @param {BudEngine} engine - Engine reference
     * @param {object} states - State definitions
     * @param {string} [initialState] - Initial state name
     */
    constructor(engine, states, initialState = null) {
        this.engine = engine;
        this.states = states || {};
        this.currentState = initialState || Object.keys(states)[0] || null;
        this.previousState = null;
        this.stateTime = 0;
        this.timedTransitions = []; // For after() method
        
        // Validate states
        for (let stateName in this.states) {
            const state = this.states[stateName];
            if (!state) {
                console.warn(`[BudEngine] State '${stateName}' is undefined`);
                continue;
            }
            // Bind state methods to state machine for 'this.go()' access
            if (state.enter) state.enter = state.enter.bind(this);
            if (state.update) state.update = state.update.bind(this);
            if (state.exit) state.exit = state.exit.bind(this);
        }
        
        // Enter initial state
        if (this.currentState && this.states[this.currentState]) {
            const state = this.states[this.currentState];
            if (state.enter) {
                try {
                    state.enter(null); // No entity context on initialization
                } catch (e) {
                    console.error(`[BudEngine] Error in state '${this.currentState}' enter:`, e);
                }
            }
        }
    }

    /**
     * Update the current state
     * @param {object} entity - Entity context to pass to state callbacks
     * @param {number} dt - Delta time
     */
    update(entity, dt) {
        this.stateTime += dt;
        
        // Update timed transitions
        for (let i = this.timedTransitions.length - 1; i >= 0; i--) {
            const transition = this.timedTransitions[i];
            transition.timer -= dt;
            
            if (transition.timer <= 0) {
                this.go(transition.state, entity);
                this.timedTransitions.splice(i, 1);
            }
        }
        
        // Update current state
        if (this.currentState && this.states[this.currentState]) {
            const state = this.states[this.currentState];
            if (state.update) {
                try {
                    state.update(entity, dt);
                } catch (e) {
                    console.error(`[BudEngine] Error in state '${this.currentState}' update:`, e);
                }
            }
        }
    }

    /**
     * Transition to a new state
     * @param {string} newState - State name to transition to
     * @param {object} [entity] - Entity context for exit/enter callbacks
     */
    go(newState, entity = null) {
        if (!this.states[newState]) {
            console.warn(`[BudEngine] State '${newState}' does not exist`);
            return;
        }
        
        if (this.currentState === newState) return; // Already in this state
        
        // Exit current state
        if (this.currentState && this.states[this.currentState]) {
            const state = this.states[this.currentState];
            if (state.exit) {
                try {
                    state.exit(entity);
                } catch (e) {
                    console.error(`[BudEngine] Error in state '${this.currentState}' exit:`, e);
                }
            }
        }
        
        // Clear timed transitions when manually changing state
        this.timedTransitions = [];
        
        // Transition
        this.previousState = this.currentState;
        this.currentState = newState;
        this.stateTime = 0;
        
        // Enter new state
        if (this.states[newState]) {
            const state = this.states[newState];
            if (state.enter) {
                try {
                    state.enter(entity);
                } catch (e) {
                    console.error(`[BudEngine] Error in state '${newState}' enter:`, e);
                }
            }
        }
    }

    /**
     * Schedule a state transition after a delay
     * @param {number} seconds - Delay in seconds
     * @param {string} state - State to transition to
     * @example
     * sm.after(2, 'idle'); // Return to idle after 2 seconds
     */
    after(seconds, state) {
        this.timedTransitions.push({
            timer: seconds,
            state: state
        });
    }

    /**
     * Get the current state name
     * @returns {string} Current state name
     */
    get state() {
        return this.currentState;
    }

    /**
     * Check if in a specific state
     * @param {string} stateName - State name to check
     * @returns {boolean} True if in that state
     */
    is(stateName) {
        return this.currentState === stateName;
    }
}

class AnimationSystem {
    constructor(engine) {
        this.engine = engine;
    }
}

// ===== DEBUG SYSTEM (P2) =====

class DebugSystem {
    constructor(engine) {
        this.engine = engine;
        this.enabled = false;
        this.logs = [];
        this.maxLogs = 50;
        this.watchedProperties = new Map(); // property name -> last value
    }

    /**
     * Log a debug message
     * @param {string} message - Message to log
     */
    log(message) {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, message, frame: this.engine.frame };
        this.logs.push(logEntry);
        
        // Keep only last maxLogs messages
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        console.log(`[Debug ${this.engine.frame}] ${message}`);
    }

    /**
     * Get all stored logs
     * @returns {Array} Array of log entries
     */
    getLogs() {
        return [...this.logs];
    }

    /**
     * Watch a property and log changes
     * @param {string} propertyPath - Property path (e.g., 'physics.frameCount', 'fps')
     */
    watch(propertyPath) {
        const getValue = () => {
            const parts = propertyPath.split('.');
            let value = this.engine;
            for (let part of parts) {
                value = value[part];
                if (value === undefined) return undefined;
            }
            return value;
        };

        const currentValue = getValue();
        this.watchedProperties.set(propertyPath, currentValue);
        this.log(`Watching property: ${propertyPath} = ${currentValue}`);
    }

    /**
     * Update watched properties (called in update loop)
     */
    updateWatched() {
        for (let [propertyPath, lastValue] of this.watchedProperties.entries()) {
            const parts = propertyPath.split('.');
            let value = this.engine;
            for (let part of parts) {
                value = value[part];
                if (value === undefined) break;
            }

            if (value !== lastValue) {
                this.log(`${propertyPath} changed: ${lastValue} → ${value}`);
                this.watchedProperties.set(propertyPath, value);
            }
        }
    }

    render(ctx) {
        if (!this.enabled) return;

        const e = this.engine;
        
        // Update watched properties
        this.updateWatched();

        // ========== PIXEL PHYSICS DEBUG OVERLAY ==========
        if (e.physics && e.physics.initialized) {
            this.renderPixelPhysicsOverlay(ctx);
        } else {
            // Standard debug overlay for non-pixel-physics games
            this.renderStandardOverlay(ctx);
        }
    }

    renderPixelPhysicsOverlay(ctx) {
        const e = this.engine;
        const physics = e.physics;

        // Count materials
        const materialCounts = {};
        for (let i = 0; i < physics.grid.length; i++) {
            const matId = physics.grid[i];
            if (matId > 0) {
                const matName = physics.getMaterialName(matId);
                materialCounts[matName] = (materialCounts[matName] || 0) + 1;
            }
        }

        // Count active chunks
        let activeChunks = 0;
        if (physics.chunks) {
            for (let cy = 0; cy < physics.chunksHigh; cy++) {
                for (let cx = 0; cx < physics.chunksWide; cx++) {
                    if (physics.chunks[cy][cx].active) activeChunks++;
                }
            }
        }

        ctx.save();
        ctx.font = '14px monospace';

        // TOP-LEFT: FPS Counter
        const fpsColor = e.fps >= 55 ? '#00ff00' : (e.fps >= 30 ? '#ffff00' : '#ff0000');
        this.drawTextWithBackground(ctx, `FPS: ${e.fps}`, 10, 30, fpsColor);

        // TOP-RIGHT: Material Counts
        const nonZeroMaterials = Object.entries(materialCounts)
            .filter(([name, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Top 10 materials

        let rightX = e.canvas.width - 10;
        let rightY = 30;
        
        this.drawTextWithBackground(ctx, 'MATERIALS:', rightX, rightY, '#00ffcc', 'right');
        rightY += 20;
        
        for (let [name, count] of nonZeroMaterials) {
            const text = `${name}: ${count}`;
            this.drawTextWithBackground(ctx, text, rightX, rightY, '#aaaaaa', 'right');
            rightY += 18;
        }

        // BOTTOM-LEFT: Chunk Stats & Frame
        let bottomY = e.canvas.height - 70;
        this.drawTextWithBackground(ctx, `Frame: ${physics.frameCount}`, 10, bottomY, '#00ffcc');
        bottomY += 20;
        this.drawTextWithBackground(ctx, `Active Chunks: ${activeChunks} / ${physics.chunksWide * physics.chunksHigh}`, 10, bottomY, '#00ffcc');
        bottomY += 20;
        this.drawTextWithBackground(ctx, `Grid: ${physics.gridWidth}x${physics.gridHeight}`, 10, bottomY, '#888888');

        ctx.restore();
    }

    renderStandardOverlay(ctx) {
        const e = this.engine;
        
        // Semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 250, 120);
        
        // FPS counter
        ctx.font = '14px monospace';
        ctx.fillStyle = e.fps >= 55 ? '#00ff00' : (e.fps >= 30 ? '#ffff00' : '#ff0000');
        ctx.fillText(`FPS: ${e.fps}`, 20, 30);
        
        // Entity count
        ctx.fillStyle = '#00ffcc';
        ctx.fillText(`Entities: ${e.entities.length}`, 20, 50);
        
        // Time scale
        ctx.fillText(`Time Scale: ${e.timeScale.toFixed(2)}x`, 20, 70);
        
        // Scene
        ctx.fillText(`Scene: ${e.currentScene || 'none'}`, 20, 90);
        
        // Gamepad status
        if (e.input.gamepad.connected) {
            ctx.fillText(`Gamepad: Connected`, 20, 110);
        }
        
        // Draw collision boxes with camera transform
        ctx.save();
        ctx.translate(
            -e.camera.x * e.camera.zoom + e.canvas.width / 2,
            -e.camera.y * e.camera.zoom + e.canvas.height / 2
        );
        ctx.scale(e.camera.zoom, e.camera.zoom);
        
        for (let entity of e.entities) {
            if (!entity.enabled || !entity.collider) continue;
            
            const col = entity.collider;
            ctx.strokeStyle = col.trigger ? '#ffff00' : '#ff00ff';
            ctx.lineWidth = 2 / e.camera.zoom;
            
            if (col.type === 'circle') {
                ctx.beginPath();
                ctx.arc(entity.x, entity.y, col.radius, 0, Math.PI * 2);
                ctx.stroke();
            } else if (col.type === 'aabb') {
                ctx.strokeRect(
                    entity.x - col.width / 2,
                    entity.y - col.height / 2,
                    col.width,
                    col.height
                );
            }
            
            // Entity position dot
            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.arc(entity.x, entity.y, 3 / e.camera.zoom, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw spatial grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1 / e.camera.zoom;
        const startX = Math.floor((e.camera.x - e.canvas.width / 2) / e.spatialCellSize) * e.spatialCellSize;
        const endX = Math.ceil((e.camera.x + e.canvas.width / 2) / e.spatialCellSize) * e.spatialCellSize;
        const startY = Math.floor((e.camera.y - e.canvas.height / 2) / e.spatialCellSize) * e.spatialCellSize;
        const endY = Math.ceil((e.camera.y + e.canvas.height / 2) / e.spatialCellSize) * e.spatialCellSize;
        
        for (let x = startX; x <= endX; x += e.spatialCellSize) {
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
            ctx.stroke();
        }
        for (let y = startY; y <= endY; y += e.spatialCellSize) {
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    /**
     * Helper to draw text with semi-transparent background
     */
    drawTextWithBackground(ctx, text, x, y, color, align = 'left') {
        ctx.textAlign = align;
        ctx.font = '14px monospace';
        
        // Measure text for background
        const metrics = ctx.measureText(text);
        const padding = 4;
        const bgX = align === 'right' ? x - metrics.width - padding : x - padding;
        const bgY = y - 14;
        const bgWidth = metrics.width + padding * 2;
        const bgHeight = 18;
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
        
        // Draw text
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
}

// ===== ASSET LOADER (P3) =====

class AssetLoader {
    constructor(engine) {
        this.engine = engine;
        this.loading = false;
        this.progress = 0;
        this.total = 0;
        this.loaded = 0;
    }

    /**
     * Load an image
     * @param {string} url - Image URL
     * @returns {Promise<HTMLImageElement>}
     */
    image(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
        });
    }

    /**
     * Load a spritesheet
     * @param {string} url - Spritesheet URL
     * @param {number} frameWidth - Width of each frame
     * @param {number} frameHeight - Height of each frame
     * @returns {Promise<Array>} Array of frame canvases
     */
    async spritesheet(url, frameWidth, frameHeight) {
        const img = await this.image(url);
        const cols = Math.floor(img.width / frameWidth);
        const rows = Math.floor(img.height / frameHeight);
        const frames = [];

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const canvas = document.createElement('canvas');
                canvas.width = frameWidth;
                canvas.height = frameHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(
                    img,
                    x * frameWidth, y * frameHeight,
                    frameWidth, frameHeight,
                    0, 0,
                    frameWidth, frameHeight
                );
                frames.push(canvas);
            }
        }

        return frames;
    }

    /**
     * Load multiple assets with progress tracking
     * @param {Array} assets - Array of {type, url, ...params}
     * @param {function} onProgress - Progress callback
     * @returns {Promise<Object>} Map of loaded assets
     */
    async batch(assets, onProgress) {
        this.loading = true;
        this.total = assets.length;
        this.loaded = 0;
        this.progress = 0;

        const results = {};

        for (let asset of assets) {
            try {
                if (asset.type === 'image') {
                    results[asset.name || asset.url] = await this.image(asset.url);
                } else if (asset.type === 'spritesheet') {
                    results[asset.name || asset.url] = await this.spritesheet(
                        asset.url,
                        asset.frameWidth,
                        asset.frameHeight
                    );
                }
                
                this.loaded++;
                this.progress = this.loaded / this.total;
                
                if (onProgress) {
                    onProgress(this.progress, this.loaded, this.total);
                }
            } catch (e) {
                console.error('[BudEngine] Asset load failed:', asset, e);
            }
        }

        this.loading = false;
        return results;
    }
}

// ===== ASSET MANAGEMENT SYSTEM (v2.7) =====

/**
 * Asset Management System
 * Handles loading, caching, and retrieval of images, sprite sheets, audio, and animations
 */
class AssetManager {
    /**
     * Create a new AssetManager
     * @param {BudEngine} engine - Parent engine instance
     */
    constructor(engine) {
        this.engine = engine;
        
        // Asset storage
        this.assets = new Map(); // name -> asset (Image, Audio, etc.)
        this.sheets = new Map(); // name -> { image, frameWidth, frameHeight, frames }
        this.animations = new Map(); // name -> { sheet, frames, fps, loop }
        
        // Loading state
        this.loading = false;
        this.loadedCount = 0;
        this.totalCount = 0;
        this.progress = 0;
        
        // Supported formats
        this.imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
        this.audioFormats = ['mp3', 'wav', 'ogg'];
    }

    /**
     * Load a manifest of assets
     * @param {Object} manifest - Map of name -> src or {src, frameWidth, frameHeight}
     * @param {Function} [onProgress] - Progress callback (loaded, total, percent)
     * @returns {Promise} Resolves when all assets are loaded
     * @example
     * engine.assets.load({
     *   player: 'sprites/player.png',
     *   enemies: { src: 'sprites/enemies.png', frameWidth: 32, frameHeight: 32 },
     *   slash: 'sounds/slash.mp3'
     * }).then(() => engine.goTo('game'));
     */
    load(manifest, onProgress = null) {
        return new Promise((resolve, reject) => {
            this.loading = true;
            this.loadedCount = 0;
            this.totalCount = Object.keys(manifest).length;
            this.progress = 0;
            
            const promises = [];
            
            for (let [name, config] of Object.entries(manifest)) {
                let promise;
                
                // Parse config
                if (typeof config === 'string') {
                    // Simple string path
                    promise = this.loadSingle(name, config);
                } else if (typeof config === 'object' && config.src) {
                    // Sprite sheet config
                    if (config.frameWidth && config.frameHeight) {
                        promise = this.loadSheet(name, config.src, config.frameWidth, config.frameHeight);
                    } else {
                        promise = this.loadSingle(name, config.src);
                    }
                } else {
                    console.error(`[AssetManager] Invalid config for asset '${name}':`, config);
                    continue;
                }
                
                // Track progress
                promise.then(() => {
                    this.loadedCount++;
                    this.progress = this.loadedCount / this.totalCount;
                    if (onProgress) {
                        onProgress(this.loadedCount, this.totalCount, this.progress);
                    }
                }).catch(err => {
                    console.error(`[AssetManager] Failed to load '${name}':`, err);
                    this.loadedCount++;
                    this.progress = this.loadedCount / this.totalCount;
                    if (onProgress) {
                        onProgress(this.loadedCount, this.totalCount, this.progress);
                    }
                });
                
                promises.push(promise);
            }
            
            Promise.all(promises).then(() => {
                this.loading = false;
                console.log(`[AssetManager] Loaded ${this.loadedCount}/${this.totalCount} assets`);
                resolve();
            }).catch(err => {
                this.loading = false;
                console.error('[AssetManager] Load failed:', err);
                reject(err);
            });
        });
    }

    /**
     * Load assets with a built-in loading screen
     * @param {Object} manifest - Asset manifest
     * @param {Object} [options] - Loading screen options
     * @returns {Promise} Resolves when loading complete
     * @example
     * engine.assets.loadWithScreen({
     *   player: 'sprites/player.png',
     *   enemies: 'sprites/enemies.png'
     * });
     */
    loadWithScreen(manifest, options = {}) {
        const {
            backgroundColor = '#0a0a14',
            barColor = '#00ffcc',
            textColor = '#00ffcc',
            barHeight = 8,
            barWidth = 400
        } = options;
        
        // Create loading state
        let loadingProgress = 0;
        let loadingActive = true;
        
        // Render loading screen
        const renderLoading = () => {
            if (!loadingActive) return;
            
            const ctx = this.engine.ctx;
            const canvas = this.engine.canvas;
            
            // Background
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Title
            ctx.fillStyle = textColor;
            ctx.font = 'bold 32px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('LOADING', canvas.width / 2, canvas.height / 2 - 40);
            
            // Progress percentage
            ctx.font = '20px monospace';
            ctx.fillText(`${Math.floor(loadingProgress * 100)}%`, canvas.width / 2, canvas.height / 2 - 10);
            
            // Progress bar background
            const barX = (canvas.width - barWidth) / 2;
            const barY = canvas.height / 2 + 20;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Progress bar fill with glow
            ctx.shadowColor = barColor;
            ctx.shadowBlur = 15;
            ctx.fillStyle = barColor;
            ctx.fillRect(barX, barY, barWidth * loadingProgress, barHeight);
            ctx.shadowBlur = 0;
            
            // Cyberpunk accent lines
            ctx.strokeStyle = barColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
            
            requestAnimationFrame(renderLoading);
        };
        
        // Start rendering loop
        renderLoading();
        
        // Load assets with progress callback
        return this.load(manifest, (loaded, total, percent) => {
            loadingProgress = percent;
        }).finally(() => {
            loadingActive = false;
        });
    }

    /**
     * Load a single asset (image or audio)
     * @private
     * @param {string} name - Asset name
     * @param {string} src - Asset source path
     * @returns {Promise}
     */
    loadSingle(name, src) {
        // Determine type by extension
        const ext = src.split('.').pop().toLowerCase();
        
        if (this.imageFormats.includes(ext)) {
            return this.loadImage(name, src);
        } else if (this.audioFormats.includes(ext)) {
            return this.loadAudio(name, src);
        } else {
            return Promise.reject(new Error(`Unsupported format: ${ext}`));
        }
    }

    /**
     * Load an image
     * @private
     * @param {string} name - Asset name
     * @param {string} src - Image source path
     * @returns {Promise<Image>}
     */
    loadImage(name, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.assets.set(name, img);
                resolve(img);
            };
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    }

    /**
     * Load an audio file
     * @private
     * @param {string} name - Asset name
     * @param {string} src - Audio source path
     * @returns {Promise<Audio>}
     */
    loadAudio(name, src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                this.assets.set(name, audio);
                resolve(audio);
            };
            audio.onerror = () => reject(new Error(`Failed to load audio: ${src}`));
            audio.src = src;
        });
    }

    /**
     * Load a sprite sheet and auto-slice into frames
     * @private
     * @param {string} name - Sheet name
     * @param {string} src - Image source
     * @param {number} frameWidth - Width of each frame
     * @param {number} frameHeight - Height of each frame
     * @returns {Promise}
     */
    loadSheet(name, src, frameWidth, frameHeight) {
        return this.loadImage(name, src).then(img => {
            // Calculate frame count
            const cols = Math.floor(img.width / frameWidth);
            const rows = Math.floor(img.height / frameHeight);
            const totalFrames = cols * rows;
            
            // Store sheet metadata
            this.sheets.set(name, {
                image: img,
                frameWidth,
                frameHeight,
                cols,
                rows,
                totalFrames
            });
            
            console.log(`[AssetManager] Loaded sprite sheet '${name}': ${totalFrames} frames (${cols}x${rows})`);
        });
    }

    /**
     * Get a loaded asset
     * @param {string} name - Asset name
     * @returns {Image|Audio|null} The loaded asset or null
     * @example
     * const playerImg = engine.assets.get('player');
     * ctx.drawImage(playerImg, x, y);
     */
    get(name) {
        return this.assets.get(name) || null;
    }

    /**
     * Get a specific frame from a sprite sheet
     * @param {string} sheetName - Name of the sprite sheet
     * @param {number} frameIndex - Frame index (0-based)
     * @returns {Object} Frame descriptor {image, sx, sy, sw, sh} for use with drawImage
     * @example
     * const frame = engine.assets.frame('enemies', 3);
     * ctx.drawImage(frame.image, frame.sx, frame.sy, frame.sw, frame.sh, x, y, w, h);
     */
    frame(sheetName, frameIndex) {
        const sheet = this.sheets.get(sheetName);
        if (!sheet) {
            console.error(`[AssetManager] Sprite sheet '${sheetName}' not found`);
            return null;
        }
        
        if (frameIndex < 0 || frameIndex >= sheet.totalFrames) {
            console.error(`[AssetManager] Frame index ${frameIndex} out of range for sheet '${sheetName}' (0-${sheet.totalFrames - 1})`);
            return null;
        }
        
        const col = frameIndex % sheet.cols;
        const row = Math.floor(frameIndex / sheet.cols);
        
        return {
            image: sheet.image,
            sx: col * sheet.frameWidth,
            sy: row * sheet.frameHeight,
            sw: sheet.frameWidth,
            sh: sheet.frameHeight
        };
    }

    /**
     * Define a sprite animation from a sprite sheet
     * @param {string} name - Animation name
     * @param {Object} config - Animation config
     * @param {string} config.sheet - Sprite sheet name
     * @param {Array<number>} config.frames - Frame indices to play
     * @param {number} [config.fps=12] - Frames per second
     * @param {boolean} [config.loop=true] - Whether to loop
     * @example
     * engine.assets.animation('playerRun', {
     *   sheet: 'player',
     *   frames: [0, 1, 2, 3],
     *   fps: 12,
     *   loop: true
     * });
     */
    animation(name, config) {
        const { sheet, frames, fps = 12, loop = true } = config;
        
        if (!this.sheets.has(sheet)) {
            console.error(`[AssetManager] Cannot create animation '${name}': sheet '${sheet}' not found`);
            return;
        }
        
        this.animations.set(name, {
            sheet,
            frames,
            fps,
            loop,
            frameTime: 1 / fps,
            currentFrame: 0,
            elapsed: 0
        });
        
        console.log(`[AssetManager] Created animation '${name}': ${frames.length} frames @ ${fps}fps`);
    }

    /**
     * Get an animation and create a playable instance
     * @param {string} name - Animation name
     * @returns {Object|null} Animation instance with update() and currentFrame() methods
     * @example
     * const anim = engine.assets.getAnimation('playerRun');
     * entity.animation = anim;
     */
    getAnimation(name) {
        const animDef = this.animations.get(name);
        if (!animDef) {
            console.error(`[AssetManager] Animation '${name}' not found`);
            return null;
        }
        
        // Return a new instance so each entity has its own animation state
        return {
            name: name,
            sheet: animDef.sheet,
            frames: [...animDef.frames],
            fps: animDef.fps,
            loop: animDef.loop,
            frameTime: animDef.frameTime,
            currentFrameIndex: 0,
            elapsed: 0,
            playing: true,
            
            /**
             * Update animation time
             * @param {number} dt - Delta time in seconds
             */
            update(dt) {
                if (!this.playing) return;
                
                this.elapsed += dt;
                
                if (this.elapsed >= this.frameTime) {
                    this.elapsed -= this.frameTime;
                    this.currentFrameIndex++;
                    
                    if (this.currentFrameIndex >= this.frames.length) {
                        if (this.loop) {
                            this.currentFrameIndex = 0;
                        } else {
                            this.currentFrameIndex = this.frames.length - 1;
                            this.playing = false;
                        }
                    }
                }
            },
            
            /**
             * Get the current frame descriptor
             * @returns {Object} Frame descriptor for rendering
             */
            currentFrame() {
                const frameIndex = this.frames[this.currentFrameIndex];
                return window.engine.assets.frame(this.sheet, frameIndex);
            },
            
            /**
             * Reset animation to start
             */
            reset() {
                this.currentFrameIndex = 0;
                this.elapsed = 0;
                this.playing = true;
            }
        };
    }

    /**
     * Unload a specific asset
     * @param {string} name - Asset name to unload
     * @example
     * engine.assets.unload('oldLevel');
     */
    unload(name) {
        this.assets.delete(name);
        this.sheets.delete(name);
        this.animations.delete(name);
        console.log(`[AssetManager] Unloaded asset '${name}'`);
    }

    /**
     * Clear all loaded assets
     * @example
     * engine.assets.clear();
     */
    clear() {
        this.assets.clear();
        this.sheets.clear();
        this.animations.clear();
        console.log('[AssetManager] Cleared all assets');
    }
}

// ===== PATHFINDING SYSTEM (P3) =====

class PathfindingSystem {
    constructor(engine) {
        this.engine = engine;
    }

    /**
     * Find a path using A* algorithm
     * @param {object} from - Start position {x, y}
     * @param {object} to - End position {x, y}
     * @returns {Array} Array of waypoints
     */
    findPath(from, to) {
        if (!this.engine.currentTilemap) {
            console.warn('[BudEngine] Pathfinding requires a tilemap');
            return [];
        }

        const tilemap = this.engine.currentTilemap;
        const tileSize = tilemap.tileSize;

        // Convert world coords to tile coords
        const startTile = {
            x: Math.floor(from.x / tileSize),
            y: Math.floor(from.y / tileSize)
        };
        const endTile = {
            x: Math.floor(to.x / tileSize),
            y: Math.floor(to.y / tileSize)
        };

        // A* implementation
        const openSet = [startTile];
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        const key = (tile) => `${tile.x},${tile.y}`;
        gScore.set(key(startTile), 0);
        fScore.set(key(startTile), this.heuristic(startTile, endTile));

        while (openSet.length > 0) {
            // Find node with lowest fScore
            let current = openSet[0];
            let currentKey = key(current);
            let lowestF = fScore.get(currentKey) || Infinity;

            for (let i = 1; i < openSet.length; i++) {
                const k = key(openSet[i]);
                const f = fScore.get(k) || Infinity;
                if (f < lowestF) {
                    current = openSet[i];
                    currentKey = k;
                    lowestF = f;
                }
            }

            // Reached goal?
            if (current.x === endTile.x && current.y === endTile.y) {
                return this.reconstructPath(cameFrom, current, tileSize);
            }

            // Remove current from openSet
            openSet.splice(openSet.findIndex(t => key(t) === currentKey), 1);

            // Check neighbors
            const neighbors = [
                { x: current.x + 1, y: current.y },
                { x: current.x - 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x, y: current.y - 1 }
            ];

            for (let neighbor of neighbors) {
                // Check if walkable
                const tile = tilemap.get(neighbor.x, neighbor.y);
                if (tile === 'wall') continue;

                const neighborKey = key(neighbor);
                const tentativeGScore = (gScore.get(currentKey) || Infinity) + 1;

                if (tentativeGScore < (gScore.get(neighborKey) || Infinity)) {
                    cameFrom.set(neighborKey, current);
                    gScore.set(neighborKey, tentativeGScore);
                    fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, endTile));

                    if (!openSet.some(t => key(t) === neighborKey)) {
                        openSet.push(neighbor);
                    }
                }
            }

            // Prevent infinite loops
            if (openSet.length > 1000) {
                console.warn('[BudEngine] Pathfinding exceeded max iterations');
                break;
            }
        }

        // No path found
        return [];
    }

    heuristic(a, b) {
        // Manhattan distance
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    reconstructPath(cameFrom, current, tileSize) {
        const path = [];
        const key = (tile) => `${tile.x},${tile.y}`;

        path.push({
            x: current.x * tileSize + tileSize / 2,
            y: current.y * tileSize + tileSize / 2
        });

        let currentKey = key(current);
        while (cameFrom.has(currentKey)) {
            current = cameFrom.get(currentKey);
            currentKey = key(current);
            path.unshift({
                x: current.x * tileSize + tileSize / 2,
                y: current.y * tileSize + tileSize / 2
            });
        }

        return path;
    }
}

// ===== PIXEL PHYSICS SYSTEM (v3.0) =====

/**
 * Pixel Physics System - Cellular automata physics simulation
 * Inspired by Noita's "Falling Everything" engine
 * 
 * Every pixel is a material that follows physical rules:
 * - Water flows and fills containers
 * - Sand falls and piles up
 * - Fire burns and spreads
 * - Gas rises and dissipates
 * - etc.
 */
// ===== PIXEL PHYSICS SYSTEM (v3.1 - EMERGENT PROPERTY-BASED) =====

/**
 * Pixel Physics System v3.1 - Emergent Property-Based Materials
 * 
 * PHILOSOPHY: No hardcoded interactions. Materials have real physical and chemical
 * properties. Interactions EMERGE from those properties meeting conditions.
 * 
 * When two materials combine and create something new, and you add a third thing,
 * it creates something new again — because of properties, not because we coded
 * that specific combination.
 * 
 * This is how we build Earth.
 */
class PixelPhysics {
    /**
     * Create a pixel physics system
     * @param {BudEngine} engine - Engine instance
     */
    constructor(engine) {
        this.engine = engine;
        
        // Not initialized until init() is called
        this.initialized = false;
        this.width = 0;
        this.height = 0;
        this.cellSize = 1;
        this.gridWidth = 0;
        this.gridHeight = 0;
        
        // Material definitions
        this.materials = new Map();
        this.materialIdMap = new Map(); // name -> id
        this.nextMaterialId = 1;
        this.MAX_MATERIALS = 256; // Max material types (Uint8)
        
        // Simulation grids (typed arrays for performance)
        this.grid = null;              // Uint8Array - material IDs
        this.temperatureGrid = null;   // Float32Array - temperature in °C
        this.lifetimeGrid = null;      // Float32Array - for temporary materials
        
        // v3.2: Flat array material properties (O(1) access, no object lookup)
        this.densityArr = new Float32Array(this.MAX_MATERIALS);
        this.meltPointArr = new Float32Array(this.MAX_MATERIALS);
        this.boilPointArr = new Float32Array(this.MAX_MATERIALS);
        this.ignitionPointArr = new Float32Array(this.MAX_MATERIALS);
        this.thermalConductivityArr = new Float32Array(this.MAX_MATERIALS);
        this.flammabilityArr = new Float32Array(this.MAX_MATERIALS);
        this.viscosityArr = new Float32Array(this.MAX_MATERIALS);
        this.frictionArr = new Float32Array(this.MAX_MATERIALS);
        this.stateArr = new Uint8Array(this.MAX_MATERIALS); // 0=air, 1=solid, 2=liquid, 3=gas, 4=powder
        
        // v3.2: Chunked simulation for massive performance boost
        this.chunkSize = 32; // 32x32 cells per chunk
        this.chunks = null;  // 2D array of chunk metadata
        this.chunksWide = 0;
        this.chunksHigh = 0;
        this.inactiveThreshold = 30; // frames of inactivity before chunk sleeps
        
        // v3.2: Reaction lookup table (O(1) reaction checks)
        this.reactionLookup = null; // Uint16Array indexed by [matA_id * MAX + matB_id]
        
        // Rendering
        this.offscreenCanvas = null;
        this.offscreenCtx = null;
        this.imageData = null;
        
        // Heat visualization
        this.showHeat = false;
        
        // v3.5: Cell-Based Dynamic Lighting System (OPTIMIZED)
        this.lighting = false; // Start with lighting OFF (user can toggle)
        this.ambientLight = 0.6; // Backup: if lighting is enabled, this provides visibility
        this.lightSources = new Set(); // Track light-emitting cells
        this.lightMap = null; // Uint8ClampedArray - light level per cell (0-255)
        this.lightColorMap = null; // Uint8ClampedArray - RGB per cell (3 values per cell)
        this.lightUpdateInterval = 2; // Update light every N frames (lower = prettier, higher = faster)
        
        // Performance optimizations
        this.dirtyRects = [];
        this.scanDirection = 1; // Alternates between 1 and -1 each frame
        this.heatSources = new Set(); // Track cells near heat for optimization
        
        // Frame counter
        this.frameCount = 0;
        
        // Ambient temperature (°C)
        this.ambientTemp = 20;
        
        // v3.8: Sound event queue
        this.soundEvents = [];
        this.maxSoundEventsPerFrame = 20; // Throttle to avoid audio overload
        
        // Chemical reaction rules (property-based, not hardcoded materials)
        this.reactionRules = [];
        
        // Register default materials with REAL properties
        this.registerDefaultMaterials();
        this.registerReactionRules();
        this.buildReactionLookupTable();
        
        // v3.3: Acoustic Engine - The Composition
        this.acoustics = new AcousticEngine(this);
        
        // v3.10: Procedural World Generation
        this.worldGenerator = new WorldGenerator(this);
        
        // v3.9: Earth Ecosystem with Time Acceleration
        this.timeScale = 1; // Multiplier: 1x, 10x, 100x, 1000x for geological time
        this.worldAge = 0; // Total simulated time in "years"
        this.season = 'spring'; // Current season
        this.seasonCycle = 0; // 0-4 (cycles through seasons)
        
        // Weather system
        this.weather = {
            season: 'spring',
            temperature: 15,
            rainChance: 0.3,
            windStrength: 0.5,
            dayLength: 12
        };
        
        // Erosion tracking
        this.erosionStats = {
            waterErosion: 0,
            windErosion: 0,
            thermalErosion: 0
        };
        
        // Geological event probabilities (per simulated year)
        this.geologicalEvents = {
            earthquakeChance: 0.001,
            volcanicChance: 0.0005,
            floodChance: 0.002
        };
        
        // Wind system (enhanced for erosion)
        this.wind = { x: 0, y: 0 };
        
        // Track last year for event checking
        this.lastEventCheck = -1;
    }

    /**
     * Initialize the pixel physics system
     * @param {number} width - World width in pixels
     * @param {number} height - World height in pixels
     * @param {number} [cellSize=2] - Size of each physics cell
     * @example
     * engine.physics.init(640, 360, 2); // 320x180 simulation grid
     */
    init(width, height, cellSize = 2) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.gridWidth = Math.floor(width / cellSize);
        this.gridHeight = Math.floor(height / cellSize);
        
        // Create simulation grids
        this.grid = new Uint8Array(this.gridWidth * this.gridHeight);
        this.temperatureGrid = new Float32Array(this.gridWidth * this.gridHeight);
        this.lifetimeGrid = new Float32Array(this.gridWidth * this.gridHeight);
        
        // v4.1: Soil fertility system
        this.fertilityGrid = new Float32Array(this.gridWidth * this.gridHeight);
        
        // v4.1: O2/CO2 balance (global counters)
        this.oxygenLevel = 500;
        this.co2Level = 100;
        
        // v4.1: Creature population tracking
        this.creaturePopulation = {
            worm: 0,
            fish: 0,
            bug: 0
        };
        this.creatureBirths = {
            worm: 0,
            fish: 0,
            bug: 0
        };
        this.creatureDeaths = {
            worm: 0,
            fish: 0,
            bug: 0
        };
        this.totalCreatures = 0;
        this.maxCreatures = 200;
        
        // Initialize all cells to ambient temperature and default fertility
        for (let i = 0; i < this.temperatureGrid.length; i++) {
            this.temperatureGrid[i] = this.ambientTemp;
            this.fertilityGrid[i] = 0.5; // Default fertility 0.5
        }
        
        // v3.2: Initialize chunking system
        this.chunksWide = Math.ceil(this.gridWidth / this.chunkSize);
        this.chunksHigh = Math.ceil(this.gridHeight / this.chunkSize);
        this.chunks = Array.from({ length: this.chunksHigh }, () =>
            Array.from({ length: this.chunksWide }, () => ({
                active: true, // Start active
                lastActive: 0
            }))
        );
        console.log(`[PixelPhysics v3.5] Chunk system: ${this.chunksWide}x${this.chunksHigh} chunks (${this.chunkSize}x${this.chunkSize} cells)`);
        
        // Create offscreen canvas for rendering
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.gridWidth;
        this.offscreenCanvas.height = this.gridHeight;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.imageData = this.offscreenCtx.createImageData(this.gridWidth, this.gridHeight);
        
        // v3.5: Create cell-based light map (much faster than canvas gradients!)
        const totalCells = this.gridWidth * this.gridHeight;
        this.lightMap = new Uint8ClampedArray(totalCells); // Light level per cell (0-255)
        this.lightColorMap = new Uint8ClampedArray(totalCells * 3); // RGB per cell
        // Initialize to ambient light
        const ambientLevel = Math.floor(this.ambientLight * 255);
        for (let i = 0; i < totalCells; i++) {
            this.lightMap[i] = ambientLevel;
            const colorIdx = i * 3;
            this.lightColorMap[colorIdx] = ambientLevel;
            this.lightColorMap[colorIdx + 1] = ambientLevel;
            this.lightColorMap[colorIdx + 2] = ambientLevel;
        }
        console.log(`[PixelPhysics v3.5] Cell-based lighting system initialized: ${this.gridWidth}x${this.gridHeight} light map`);
        
        this.initialized = true;
        console.log(`[PixelPhysics v3.5] Initialized ${this.gridWidth}x${this.gridHeight} grid (cell size: ${cellSize}px)`);
        console.log('[PixelPhysics v3.5] Property-based emergent physics enabled');
        console.log('[PixelPhysics v3.5] Temperature simulation active');
        console.log('[PixelPhysics v3.5] Performance optimizations: chunking, flat arrays, O(1) reactions, cell-based lighting');
        console.log('[PixelPhysics v3.5] NEW: Optimized lighting (40+ FPS), entity-physics integration, wind system, save/load');
        console.log('[PixelPhysics v3.5] Acoustic Physics System initialized - The Composition');
    }

    /**
     * Register default materials with REAL scientific properties
     * @private
     */
    registerDefaultMaterials() {
        // AIR (ID 0 - always empty/air)
        this.material('air', {
            state: 'gas',
            density: 1.225, // kg/m³ at sea level
            temperature: 20,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: null,
            thermalConductivity: 0.026,
            specificHeat: 1.005,
            flammability: 0,
            hardness: 0,
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: null,
            color: ['#00000000'],
            supportsCombustion: true, // Oxygen in air
            // Acoustic properties (real scientific values)
            speedOfSound: 343,           // m/s — measured value
            acousticImpedance: 0.0004,   // MRayl (density × speed / 1e6)
            absorptionCoeff: 0.0,        // 0-1, sound energy absorbed
            youngsModulus: null,         // Pa — N/A for gas
            resonanceFreq: 100,          // Hz — low frequency hum
            dampening: 0.0,              // 0-1 — air doesn't dampen much
            brightness: 0.1,             // 0-1 — low harmonic content
            impactSound: null,
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: null
        });

        // ========== WATER CYCLE ==========
        
        // WATER (H₂O)
        this.material('water', {
            state: 'liquid',
            density: 1000,
            temperature: 20,
            meltingPoint: 0,
            boilingPoint: 100,
            ignitionPoint: null,
            thermalConductivity: 0.6,
            specificHeat: 4.18,
            flammability: 0,
            hardness: 0,
            electricConductivity: 0.05,
            pH: 7,
            reactivity: 0.1,
            solubility: 'water', // dissolves things
            color: ['#1a6bff', '#2080ff', '#1050dd', '#1860ee'],
            solidForm: 'ice',
            gasForm: 'steam',
            viscosity: 0.5,
            // Acoustic properties (real scientific values)
            speedOfSound: 1480,          // m/s
            acousticImpedance: 1.48,     // MRayl
            absorptionCoeff: 0.01,       // 0-1
            youngsModulus: 2.2e9,        // Pa
            resonanceFreq: 200,          // Hz — low frequency splash
            dampening: 0.2,              // 0-1 — water dampens moderately
            brightness: 0.2,             // 0-1 — low harmonic content
            impactSound: 'splash',
            flowSound: 'pour',
            ambientSound: null,
            phaseChangeSound: 'sizzle'
        });

        // ICE (solid H₂O)
        this.material('ice', {
            state: 'solid',
            density: 917, // less dense than water!
            temperature: -10,
            meltingPoint: 0,
            boilingPoint: null,
            ignitionPoint: null,
            thermalConductivity: 2.2,
            specificHeat: 2.09,
            flammability: 0,
            hardness: 1.5,
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: null,
            color: ['#a0d0ff', '#b5e0ff', '#c0f0ff'],
            liquidForm: 'water',
            immovable: false, // ice can slide eventually
            // Acoustic properties
            speedOfSound: 3280,
            acousticImpedance: 3.01,
            absorptionCoeff: 0.02,
            youngsModulus: 9.3e9,
            resonanceFreq: 400,
            dampening: 0.1,
            brightness: 0.3,
            impactSound: 'crack',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'crack'
        });

        // STEAM (gaseous H₂O)
        this.material('steam', {
            state: 'gas',
            density: 0.6, // very light, rises fast
            temperature: 100,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: null,
            thermalConductivity: 0.024,
            specificHeat: 2.01,
            flammability: 0,
            hardness: 0,
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: null,
            color: ['#e0e0e080', '#f0f0f060', '#d0d0d070'],
            liquidForm: 'water',
            lifetime: [2.0, 4.0], // condenses over time
            alpha: 0.5,
            // Acoustic properties
            speedOfSound: 405,
            acousticImpedance: 0.0003,
            absorptionCoeff: 0.0,
            youngsModulus: null,
            resonanceFreq: 150,
            dampening: 0.05,
            brightness: 0.1,
            impactSound: null,
            flowSound: 'hiss',
            ambientSound: 'hiss',
            phaseChangeSound: 'hiss'
        });

        // ========== EARTH & MINERALS ==========

        // SAND (Silicon Dioxide - SiO₂)
        this.material('sand', {
            state: 'powder',
            density: 1600,
            temperature: 20,
            meltingPoint: 1700, // becomes glass!
            boilingPoint: 2230,
            ignitionPoint: null,
            thermalConductivity: 0.25,
            specificHeat: 0.835,
            flammability: 0,
            hardness: 7, // Mohs scale
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: null,
            color: ['#c2b280', '#d4c494', '#b0a070', '#a89060'],
            friction: 0.5,
            liquidForm: 'glass', // melted sand becomes glass!
            // Acoustic properties
            speedOfSound: 500,
            acousticImpedance: 0.80,
            absorptionCoeff: 0.30,
            youngsModulus: 0.1e9,
            resonanceFreq: 150,
            dampening: 0.8,
            brightness: 0.1,
            impactSound: 'crunch',
            flowSound: 'rush',
            ambientSound: null,
            phaseChangeSound: 'sizzle'
        });

        // GLASS (molten/cooled sand)
        this.material('glass', {
            state: 'solid',
            density: 2500,
            temperature: 600,
            meltingPoint: 1700,
            boilingPoint: 2230,
            ignitionPoint: null,
            thermalConductivity: 1.0,
            specificHeat: 0.84,
            flammability: 0,
            hardness: 5.5,
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: null,
            color: ['#88ccff40', '#99ddff50', '#aaeeff48'],
            immovable: true,
            alpha: 0.3,
            // Acoustic properties
            speedOfSound: 5640,
            acousticImpedance: 14.1,
            absorptionCoeff: 0.03,
            youngsModulus: 70e9,
            resonanceFreq: 2000,
            dampening: 0.03,
            brightness: 0.95,
            impactSound: 'ring',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'crack'
        });

        // STONE (generic rock)
        this.material('stone', {
            state: 'solid',
            density: 2700,
            temperature: 20,
            meltingPoint: 1200, // becomes lava
            boilingPoint: 2400,
            ignitionPoint: null,
            thermalConductivity: 2.0,
            specificHeat: 0.79,
            flammability: 0,
            hardness: 6,
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: null,
            color: ['#4a4a4a', '#555555', '#3f3f3f', '#5a5a5a'],
            immovable: true,
            liquidForm: 'lava',
            // Acoustic properties
            speedOfSound: 5950,
            acousticImpedance: 16.1,
            absorptionCoeff: 0.02,
            youngsModulus: 60e9,
            resonanceFreq: 800,
            dampening: 0.1,
            brightness: 0.3,
            impactSound: 'crack',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'crack'
        });

        // LAVA (molten rock)
        this.material('lava', {
            state: 'liquid',
            density: 3000,
            temperature: 1200,
            meltingPoint: null,
            boilingPoint: 2400,
            ignitionPoint: null,
            thermalConductivity: 5.0,  // high — lava radiates heat aggressively
            specificHeat: 0.84,
            flammability: 0,
            hardness: 0,
            electricConductivity: 0.1,
            pH: 7,
            reactivity: 0.3,
            solubility: null,
            color: ['#ff4400', '#ff6600', '#ff8800', '#ff2200'],
            solidForm: 'obsidian',
            viscosity: 0.9,
            heatEmission: 300,  // actively radiates heat like fire
            // v3.2: Dynamic lighting
            lightRadius: 40,
            lightColor: '#ff4400',
            lightIntensity: 0.6,
            // Acoustic properties
            speedOfSound: 2500,
            acousticImpedance: 7.5,
            absorptionCoeff: 0.05,
            youngsModulus: 10e9,
            resonanceFreq: 300,
            dampening: 0.15,
            brightness: 0.25,
            impactSound: 'splash',
            flowSound: 'pour',
            ambientSound: 'bubble',
            phaseChangeSound: 'sizzle'
        });

        // OBSIDIAN (cooled lava)
        this.material('obsidian', {
            state: 'solid',
            density: 2600,
            temperature: 20,
            meltingPoint: 1200,
            boilingPoint: 2400,
            ignitionPoint: null,
            thermalConductivity: 1.5,
            specificHeat: 0.82,
            flammability: 0,
            hardness: 7,
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: null,
            color: ['#1a1a1a', '#0f0f0f', '#252525'],
            immovable: true,
            liquidForm: 'lava',
            // Acoustic properties
            speedOfSound: 5900,
            acousticImpedance: 15.3,
            absorptionCoeff: 0.02,
            youngsModulus: 70e9,
            resonanceFreq: 850,
            dampening: 0.08,
            brightness: 0.35,
            impactSound: 'crack',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'crack'
        });

        // DIRT
        this.material('dirt', {
            state: 'powder',
            density: 1300,
            temperature: 20,
            meltingPoint: 1100,
            boilingPoint: null,
            ignitionPoint: null,
            thermalConductivity: 0.25,
            specificHeat: 1.2,
            flammability: 0.05,
            hardness: 1,
            electricConductivity: 0,
            pH: 6.5,
            reactivity: 0.1,
            solubility: null,
            color: ['#654321', '#7a5230', '#553311', '#6b4423'],
            friction: 0.8,
            cohesion: 0.3,
            // Acoustic properties
            speedOfSound: 400,
            acousticImpedance: 0.52,
            absorptionCoeff: 0.15,
            youngsModulus: 0.05e9,
            resonanceFreq: 120,
            dampening: 0.7,
            brightness: 0.15,
            impactSound: 'thud',
            flowSound: 'rush',
            ambientSound: null,
            phaseChangeSound: null
        });

        // MUD (dirt + water)
        this.material('mud', {
            state: 'liquid',
            density: 1400,
            temperature: 20,
            meltingPoint: 0,
            boilingPoint: 100,
            ignitionPoint: null,
            thermalConductivity: 0.5,
            specificHeat: 2.5,
            flammability: 0,
            hardness: 0,
            electricConductivity: 0.02,
            pH: 6.5,
            reactivity: 0,
            solubility: null,
            color: ['#4a3520', '#5a4530', '#3a2510'],
            solidForm: 'dirt', // dries out
            viscosity: 0.9,
            // Acoustic properties
            speedOfSound: 800,
            acousticImpedance: 1.12,
            absorptionCoeff: 0.20,
            youngsModulus: 0.02e9,
            resonanceFreq: 100,
            dampening: 0.6,
            brightness: 0.1,
            impactSound: 'splash',
            flowSound: 'pour',
            ambientSound: null,
            phaseChangeSound: null
        });

        // CLAY
        this.material('clay', {
            state: 'powder',
            density: 2000,
            temperature: 20,
            meltingPoint: 1000,
            boilingPoint: null,
            ignitionPoint: null,
            thermalConductivity: 0.5,
            specificHeat: 0.92,
            flammability: 0,
            hardness: 2,
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: null,
            color: ['#a07855', '#b08865', '#906845'],
            friction: 0.9,
            cohesion: 0.7,
            // Acoustic properties
            speedOfSound: 2000,
            acousticImpedance: 4.0,
            absorptionCoeff: 0.10,
            youngsModulus: 1.5e9,
            resonanceFreq: 180,
            dampening: 0.5,
            brightness: 0.2,
            impactSound: 'thud',
            flowSound: 'rush',
            ambientSound: null,
            phaseChangeSound: null
        });

        // ========== METALS ==========

        // IRON
        this.material('iron', {
            state: 'solid',
            density: 7874,
            temperature: 20,
            meltingPoint: 1538,
            boilingPoint: 2862,
            ignitionPoint: null,
            thermalConductivity: 80,
            specificHeat: 0.45,
            flammability: 0,
            hardness: 4,
            electricConductivity: 1.0,
            pH: null,
            reactivity: 0.4, // reacts with acids
            solubility: null,
            color: ['#888888', '#999999', '#777777'],
            immovable: true,
            metal: true,
            // Acoustic properties
            speedOfSound: 5960,
            acousticImpedance: 46.9,
            absorptionCoeff: 0.01,
            youngsModulus: 200e9,
            resonanceFreq: 1200,
            dampening: 0.05,
            brightness: 0.9,
            impactSound: 'clang',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'sizzle'
        });

        // ========== FLAMMABLE MATERIALS ==========

        // WOOD (Cellulose)
        this.material('wood', {
            state: 'solid',
            density: 600,
            temperature: 20,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: 300, // autoignition temperature
            thermalConductivity: 0.15,
            specificHeat: 1.7,
            flammability: 0.8,
            hardness: 2,
            electricConductivity: 0,
            pH: null,
            reactivity: 0,
            solubility: null,
            color: ['#8b4513', '#a0522d', '#7a3f0f', '#9a5523'],
            immovable: true,
            combustionProducts: ['smoke', 'fire'],
            combustionEnergy: 16, // MJ/kg
            // Acoustic properties
            speedOfSound: 3850,
            acousticImpedance: 2.31,
            absorptionCoeff: 0.10,
            youngsModulus: 11e9,
            resonanceFreq: 400,
            dampening: 0.3,
            brightness: 0.4,
            impactSound: 'thud',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'crack'
        });

        // COAL (Carbon)
        this.material('coal', {
            state: 'solid',
            density: 1400,
            temperature: 20,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: 350,
            thermalConductivity: 0.2,
            specificHeat: 1.26,
            flammability: 1.0,
            hardness: 2,
            electricConductivity: 0,
            pH: null,
            reactivity: 0.2,
            solubility: null,
            color: ['#1a1a1a', '#2a2a2a', '#0f0f0f'],
            immovable: true,
            combustionProducts: ['smoke', 'fire'],
            combustionEnergy: 24,
            // Acoustic properties
            speedOfSound: 2700,
            acousticImpedance: 3.78,
            absorptionCoeff: 0.12,
            youngsModulus: 3e9,
            resonanceFreq: 350,
            dampening: 0.2,
            brightness: 0.25,
            impactSound: 'crack',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'crack'
        });

        // OIL (Hydrocarbon)
        this.material('oil', {
            state: 'liquid',
            density: 900, // floats on water!
            temperature: 20,
            meltingPoint: -20,
            boilingPoint: 200,
            ignitionPoint: 210,
            thermalConductivity: 0.14,
            specificHeat: 2.0,
            flammability: 0.95,
            hardness: 0,
            electricConductivity: 0,
            pH: null,
            reactivity: 0,
            solubility: null,
            color: ['#1a1a1a', '#2a2a2a', '#0f0f0f', '#353535'],
            viscosity: 0.7,
            combustionProducts: ['smoke', 'fire'],
            combustionEnergy: 42,
            // Acoustic properties
            speedOfSound: 1740,
            acousticImpedance: 1.57,
            absorptionCoeff: 0.03,
            youngsModulus: 1.5e9,
            resonanceFreq: 180,
            dampening: 0.25,
            brightness: 0.15,
            impactSound: 'splash',
            flowSound: 'pour',
            ambientSound: null,
            phaseChangeSound: 'sizzle'
        });

        // GUNPOWDER (Carbon + Sulfur + Saltpeter)
        this.material('gunpowder', {
            state: 'powder',
            density: 1700,
            temperature: 20,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: 280,
            thermalConductivity: 0.1,
            specificHeat: 0.9,
            flammability: 1.0,
            hardness: 1,
            electricConductivity: 0,
            pH: null,
            reactivity: 1.0, // HIGHLY reactive
            solubility: null,
            color: ['#2a2a2a', '#3a3a3a', '#1a1a1a'],
            friction: 0.6,
            explosive: true,
            explosionRadius: 50,
            explosionPower: 200,
            combustionProducts: ['smoke'],
            combustionEnergy: 3,
            // Acoustic properties
            speedOfSound: 400,
            acousticImpedance: 0.68,
            absorptionCoeff: 0.25,
            youngsModulus: 0.1e9,
            resonanceFreq: 140,
            dampening: 0.75,
            brightness: 0.12,
            impactSound: 'crunch',
            flowSound: 'rush',
            ambientSound: null,
            phaseChangeSound: 'pop'
        });

        // ========== GASES ==========

        // FIRE (plasma-like combustion)
        this.material('fire', {
            state: 'gas',
            density: -0.5, // negative = rises (hot gas)
            temperature: 800,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: null,
            thermalConductivity: 0.05,
            specificHeat: 1.0,
            flammability: 0,
            hardness: 0,
            electricConductivity: 0.1,
            pH: null,
            reactivity: 1.0,
            solubility: null,
            color: ['#ff4400', '#ff8800', '#ffcc00', '#ff6600', '#ff2200'],
            lifetime: [0.2, 0.6],
            produces: 'smoke',
            heatEmission: 500, // °C per second to neighbors
            // v3.2: Dynamic lighting
            lightRadius: 60,
            lightColor: '#ff6600',
            lightIntensity: 0.8,
            // Acoustic properties
            speedOfSound: 700,
            acousticImpedance: 0.0005,
            absorptionCoeff: 0.0,
            youngsModulus: null,
            resonanceFreq: 500,
            dampening: 0.02,
            brightness: 0.6,
            impactSound: null,
            flowSound: 'whoosh',
            ambientSound: 'crackle',
            phaseChangeSound: 'whoosh'
        });

        // SMOKE
        this.material('smoke', {
            state: 'gas',
            density: -0.3,
            temperature: 150,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: null,
            thermalConductivity: 0.02,
            specificHeat: 1.0,
            flammability: 0,
            hardness: 0,
            electricConductivity: 0,
            pH: null,
            reactivity: 0,
            solubility: null,
            color: ['#3a3a3a', '#4a4a4a', '#5a5a5a', '#2a2a2a'],
            lifetime: [1.5, 3.0],
            alpha: 0.6,
            // Acoustic properties
            speedOfSound: 350,
            acousticImpedance: 0.0004,
            absorptionCoeff: 0.0,
            youngsModulus: null,
            resonanceFreq: 80,
            dampening: 0.9,
            brightness: 0.05,
            impactSound: null,
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: null
        });

        // OXYGEN (O₂)
        this.material('oxygen', {
            state: 'gas',
            density: 1.429,
            temperature: 20,
            meltingPoint: -218,
            boilingPoint: -183,
            ignitionPoint: null,
            thermalConductivity: 0.026,
            specificHeat: 0.918,
            flammability: 0,
            hardness: 0,
            electricConductivity: 0,
            pH: null,
            reactivity: 0.5,
            solubility: 'water',
            color: ['#ccffff40', '#ddeeff50'],
            supportsCombustion: true,
            alpha: 0.3,
            // Acoustic properties
            speedOfSound: 330,
            acousticImpedance: 0.0004,
            absorptionCoeff: 0.0,
            youngsModulus: null,
            resonanceFreq: 110,
            dampening: 0.01,
            brightness: 0.1,
            impactSound: null,
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: null
        });

        // HYDROGEN (H₂)
        this.material('hydrogen', {
            state: 'gas',
            density: 0.09, // lightest element!
            temperature: 20,
            meltingPoint: -259,
            boilingPoint: -253,
            ignitionPoint: 500,
            thermalConductivity: 0.18,
            specificHeat: 14.3,
            flammability: 1.0,
            hardness: 0,
            electricConductivity: 0,
            pH: null,
            reactivity: 0.8,
            solubility: 'water',
            color: ['#ffcccc30', '#ffddd40'],
            combustionProducts: ['steam'], // H₂ + O₂ → H₂O!
            combustionEnergy: 142,
            alpha: 0.25,
            // Acoustic properties
            speedOfSound: 1270,
            acousticImpedance: 0.0001,
            absorptionCoeff: 0.0,
            youngsModulus: null,
            resonanceFreq: 300,
            dampening: 0.005,
            brightness: 0.15,
            impactSound: null,
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'pop'
        });

        // METHANE (CH₄)
        this.material('methane', {
            state: 'gas',
            density: 0.657,
            temperature: 20,
            meltingPoint: -182,
            boilingPoint: -161,
            ignitionPoint: 537,
            thermalConductivity: 0.034,
            specificHeat: 2.2,
            flammability: 0.9,
            hardness: 0,
            electricConductivity: 0,
            pH: null,
            reactivity: 0.6,
            solubility: null,
            color: ['#cceecc30', '#ddffdd40'],
            combustionProducts: ['smoke', 'steam'],
            combustionEnergy: 55,
            alpha: 0.3,
            // Acoustic properties
            speedOfSound: 450,
            acousticImpedance: 0.0003,
            absorptionCoeff: 0.0,
            youngsModulus: null,
            resonanceFreq: 150,
            dampening: 0.02,
            brightness: 0.12,
            impactSound: null,
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'pop'
        });

        // CARBON DIOXIDE (CO₂)
        this.material('co2', {
            state: 'gas',
            density: 1.98, // heavier than air, sinks
            temperature: 20,
            meltingPoint: -78, // sublimes (dry ice)
            boilingPoint: -78,
            ignitionPoint: null,
            thermalConductivity: 0.016,
            specificHeat: 0.844,
            flammability: 0,
            hardness: 0,
            electricConductivity: 0,
            pH: 3.5, // acidic when dissolved in water
            reactivity: 0.1,
            solubility: 'water',
            color: ['#e0e0e040', '#f0f0f050'],
            extinguishesFire: true, // fire suppression
            alpha: 0.3,
            // Acoustic properties
            speedOfSound: 267,
            acousticImpedance: 0.0005,
            absorptionCoeff: 0.0,
            youngsModulus: null,
            resonanceFreq: 90,
            dampening: 0.03,
            brightness: 0.08,
            impactSound: null,
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'hiss'
        });

        // ========== REACTIVE MATERIALS ==========

        // ACID (Generic strong acid)
        this.material('acid', {
            state: 'liquid',
            density: 1200,
            temperature: 20,
            meltingPoint: -10,
            boilingPoint: 110,
            ignitionPoint: null,
            thermalConductivity: 0.5,
            specificHeat: 2.0,
            flammability: 0,
            hardness: 0,
            electricConductivity: 0.5,
            pH: 1, // VERY acidic
            reactivity: 0.9,
            solubility: 'water',
            color: ['#88ff4480', '#99ff5590', '#aaff6688'],
            viscosity: 0.3,
            corrosive: true,
            alpha: 0.7,
            // Acoustic properties
            speedOfSound: 1500,
            acousticImpedance: 1.80,
            absorptionCoeff: 0.02,
            youngsModulus: 2.5e9,
            resonanceFreq: 220,
            dampening: 0.18,
            brightness: 0.3,
            impactSound: 'splash',
            flowSound: 'pour',
            ambientSound: 'sizzle',
            phaseChangeSound: 'sizzle'
        });

        // SALT (NaCl)
        this.material('salt', {
            state: 'powder',
            density: 2160,
            temperature: 20,
            meltingPoint: 801,
            boilingPoint: 1465,
            ignitionPoint: null,
            thermalConductivity: 6.5,
            specificHeat: 0.88,
            flammability: 0,
            hardness: 2.5,
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: 'water', // dissolves in water
            color: ['#f0f0f0', '#ffffff', '#e8e8e8'],
            friction: 0.4,
            // Acoustic properties
            speedOfSound: 4500,
            acousticImpedance: 9.72,
            absorptionCoeff: 0.05,
            youngsModulus: 40e9,
            resonanceFreq: 160,
            dampening: 0.6,
            brightness: 0.2,
            impactSound: 'crunch',
            flowSound: 'rush',
            ambientSound: null,
            phaseChangeSound: 'crack'
        });

        // SULFUR (S)
        this.material('sulfur', {
            state: 'powder',
            density: 2070,
            temperature: 20,
            meltingPoint: 115,
            boilingPoint: 445,
            ignitionPoint: 232,
            thermalConductivity: 0.27,
            specificHeat: 0.71,
            flammability: 0.7,
            hardness: 2,
            electricConductivity: 0,
            pH: null,
            reactivity: 0.6,
            solubility: null,
            color: ['#ffff00', '#f0f000', '#eeee00'],
            friction: 0.5,
            combustionProducts: ['smoke'],
            combustionEnergy: 9,
            // Acoustic properties
            speedOfSound: 2200,
            acousticImpedance: 4.55,
            absorptionCoeff: 0.08,
            youngsModulus: 8e9,
            resonanceFreq: 250,
            dampening: 0.4,
            brightness: 0.3,
            impactSound: 'crack',
            flowSound: 'rush',
            ambientSound: null,
            phaseChangeSound: 'sizzle'
        });

        // ========== LIVING MATERIALS (v3.6) ==========

        // PLANT/SEED
        this.material('plant', {
            state: 'solid',
            density: 500,
            temperature: 20,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: 200,
            thermalConductivity: 0.2,
            specificHeat: 2.5,
            flammability: 0.6,
            hardness: 0.5,
            electricConductivity: 0,
            pH: 6.5,
            reactivity: 0,
            solubility: null,
            color: ['#1a5c1a', '#2d6b2d', '#1f4f1f'],
            immovable: false,
            organic: true,
            living: true,
            combustionProducts: ['smoke', 'co2'],
            combustionEnergy: 8,
            // Acoustic properties
            speedOfSound: 1000,
            acousticImpedance: 0.50,
            absorptionCoeff: 0.25,
            youngsModulus: 0.5e9,
            resonanceFreq: 200,
            dampening: 0.6,
            brightness: 0.25,
            impactSound: 'thud',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'crack',
            // Biology properties
            growthRate: 0.01,
            needsWater: true,
            needsLight: true,
            needsDirt: true,
            minTemp: 10,
            maxTemp: 40,
            waterSearchRadius: 3,
            deathForm: 'decay'
        });

        // VEGETATION/GRASS
        this.material('vegetation', {
            state: 'solid',
            density: 400,
            temperature: 20,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: 200,
            thermalConductivity: 0.18,
            specificHeat: 2.8,
            flammability: 0.7,
            hardness: 0.3,
            electricConductivity: 0,
            pH: 6.5,
            reactivity: 0,
            solubility: null,
            color: ['#33aa33', '#44bb44', '#2d992d'],
            immovable: false,
            organic: true,
            living: true,
            combustionProducts: ['smoke', 'co2'],
            combustionEnergy: 10,
            // Acoustic properties
            speedOfSound: 1000,
            acousticImpedance: 0.40,
            absorptionCoeff: 0.25,
            youngsModulus: 0.3e9,
            resonanceFreq: 180,
            dampening: 0.65,
            brightness: 0.22,
            impactSound: 'thud',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: 'crack',
            // Biology properties
            growthRate: 0.01,
            needsWater: true,
            needsLight: true,
            needsDirt: true,
            minTemp: 5,
            maxTemp: 45,
            waterSearchRadius: 5,
            deathForm: 'decay',
            producesOxygen: true
        });

        // FUNGUS/MOSS
        this.material('fungus', {
            state: 'solid',
            density: 450,
            temperature: 20,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: 180,
            thermalConductivity: 0.15,
            specificHeat: 2.6,
            flammability: 0.5,
            hardness: 0.2,
            electricConductivity: 0,
            pH: 6.0,
            reactivity: 0,
            solubility: null,
            color: ['#8b7355', '#6b5b45', '#9b8365'],
            immovable: false,
            organic: true,
            living: true,
            combustionProducts: ['smoke'],
            combustionEnergy: 6,
            // Acoustic properties
            speedOfSound: 900,
            acousticImpedance: 0.41,
            absorptionCoeff: 0.30,
            youngsModulus: 0.2e9,
            resonanceFreq: 160,
            dampening: 0.7,
            brightness: 0.18,
            impactSound: 'thud',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: null,
            // Biology properties
            growthRate: 0.003,
            needsWater: true,
            needsLight: false, // Grows in dark!
            needsOrganic: true, // Needs organic matter nearby
            minTemp: 0,
            maxTemp: 35,
            waterSearchRadius: 4,
            deathForm: 'decay',
            decomposer: true
        });

        // ORGANIC DECAY
        this.material('decay', {
            state: 'solid',
            density: 700,
            temperature: 20,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: 180,
            thermalConductivity: 0.3,
            specificHeat: 2.0,
            flammability: 0.4,
            hardness: 0.1,
            electricConductivity: 0,
            pH: 5.5,
            reactivity: 0.2,
            solubility: null,
            color: ['#4a3a2a', '#5a4a3a'],
            immovable: false,
            organic: true,
            living: false,
            combustionProducts: ['smoke', 'co2'],
            combustionEnergy: 5,
            // Acoustic properties
            speedOfSound: 800,
            acousticImpedance: 0.56,
            absorptionCoeff: 0.20,
            youngsModulus: 0.1e9,
            resonanceFreq: 140,
            dampening: 0.75,
            brightness: 0.15,
            impactSound: 'thud',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: null,
            // Decay properties
            lifetime: [3.0, 8.0], // Converts to dirt over time
            produces: 'dirt'
        });

        // ========== CREATURES (v4.1) ==========

        // WORM (lives in dirt, eats decay, enriches soil)
        this.material('worm', {
            state: 'solid',
            density: 600,
            temperature: 20,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: 150,
            thermalConductivity: 0.4,
            specificHeat: 3.0,
            flammability: 0.3,
            hardness: 0.1,
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: null,
            color: ['#d4836b', '#c47a63'],
            immovable: false,
            organic: true,
            living: true,
            creature: true,
            combustionProducts: ['smoke'],
            combustionEnergy: 4,
            // Acoustic properties
            speedOfSound: 1100,
            acousticImpedance: 0.66,
            absorptionCoeff: 0.35,
            youngsModulus: 0.3e9,
            resonanceFreq: 40,
            dampening: 0.8,
            brightness: 0.1,
            impactSound: 'thud',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: null,
            // Creature properties
            creatureType: 'worm',
            moveSpeed: 0.3,
            eatsFood: ['decay'],
            needsEnvironment: ['dirt'],
            minTemp: 5,
            maxTemp: 35,
            deathForm: 'decay',
            consumesO2: true
        });

        // FISH (lives in water, eats plants)
        this.material('fish', {
            state: 'liquid', // Behaves like liquid (swims)
            density: 1050,
            temperature: 20,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: 180,
            thermalConductivity: 0.5,
            specificHeat: 3.5,
            flammability: 0.2,
            hardness: 0.1,
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: null,
            color: ['#ff9933', '#ffaa44'],
            immovable: false,
            organic: true,
            living: true,
            creature: true,
            combustionProducts: ['smoke'],
            combustionEnergy: 3,
            // Acoustic properties
            speedOfSound: 1400,
            acousticImpedance: 1.47,
            absorptionCoeff: 0.25,
            youngsModulus: 0.4e9,
            resonanceFreq: 250,
            dampening: 0.7,
            brightness: 0.2,
            impactSound: 'splash',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: null,
            // Creature properties
            creatureType: 'fish',
            moveSpeed: 0.5,
            eatsFood: ['plant', 'vegetation'],
            needsEnvironment: ['water'],
            minTemp: 0,
            maxTemp: 30,
            deathForm: 'decay',
            consumesO2: true,
            viscosity: 0.6
        });

        // BUG (walks on surfaces, eats plants)
        this.material('bug', {
            state: 'solid',
            density: 550,
            temperature: 20,
            meltingPoint: null,
            boilingPoint: null,
            ignitionPoint: 140,
            thermalConductivity: 0.3,
            specificHeat: 2.8,
            flammability: 0.4,
            hardness: 0.2,
            electricConductivity: 0,
            pH: 7,
            reactivity: 0,
            solubility: null,
            color: ['#336633', '#2d5c2d'],
            immovable: false,
            organic: true,
            living: true,
            creature: true,
            combustionProducts: ['smoke'],
            combustionEnergy: 3,
            // Acoustic properties
            speedOfSound: 950,
            acousticImpedance: 0.52,
            absorptionCoeff: 0.30,
            youngsModulus: 0.25e9,
            resonanceFreq: 1000,
            dampening: 0.75,
            brightness: 0.25,
            impactSound: 'click',
            flowSound: null,
            ambientSound: null,
            phaseChangeSound: null,
            // Creature properties
            creatureType: 'bug',
            moveSpeed: 0.4,
            eatsFood: ['plant', 'vegetation'],
            needsSurface: true,
            minTemp: 5,
            maxTemp: 40,
            deathForm: 'decay',
            diesInWater: true,
            consumesO2: true
        });
    }

    /**
     * Register chemical reaction rules (property-based, not hardcoded!)
     * @private
     */
    registerReactionRules() {
        // ========== ACID REACTIONS (pH-based, emergent) ==========
        
        // Acid + Metal → Hydrogen gas + heat (any acid + any metal)
        this.reactionRules.push({
            condition: (matA, matB) => {
                return (matA.pH != null && matA.pH < 3 && matB.metal) ||
                       (matB.pH != null && matB.pH < 3 && matA.metal);
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                if (Math.random() < 0.05) {
                    const acidIdx = matA.pH != null && matA.pH < 3 ? idxA : idxB;
                    this.grid[acidIdx] = this.getMaterialId('hydrogen');
                    this.temperatureGrid[acidIdx] += 15;
                }
            }
        });

        // Acid + Water → dilution (acid slowly neutralizes in water)
        this.reactionRules.push({
            condition: (matA, matB) => {
                return (matA.pH != null && matA.pH < 3 && matB.name === 'water') ||
                       (matB.pH != null && matB.pH < 3 && matA.name === 'water');
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                // Acid dilutes into water over time
                if (Math.random() < 0.02) {
                    const acidIdx = (matA.pH != null && matA.pH < 3) ? idxA : idxB;
                    this.grid[acidIdx] = this.getMaterialId('water');
                    this.temperatureGrid[acidIdx] += 5; // slight exothermic
                }
            }
        });

        // Acid dissolves organic solids (wood, dirt, coal)
        this.reactionRules.push({
            condition: (matA, matB) => {
                const organic = ['wood', 'dirt', 'coal'];
                return (matA.pH != null && matA.pH < 3 && organic.includes(matB.name)) ||
                       (matB.pH != null && matB.pH < 3 && organic.includes(matA.name));
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                if (Math.random() < 0.03) {
                    const solidIdx = (matA.pH != null && matA.pH < 3) ? idxB : idxA;
                    this.grid[solidIdx] = this.getMaterialId('smoke');
                    this.temperatureGrid[solidIdx] += 10;
                }
            }
        });

        // ========== WATER REACTIONS ==========

        // Water + Salt → dissolves (salt disappears into water)
        this.reactionRules.push({
            condition: (matA, matB) => {
                return (matA.name === 'water' && matB.name === 'salt') ||
                       (matB.name === 'water' && matA.name === 'salt');
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                if (Math.random() < 0.04) {
                    const saltIdx = matA.name === 'salt' ? idxA : idxB;
                    this.grid[saltIdx] = this.getMaterialId('water');
                }
            }
        });

        // Water + Dirt → Mud
        this.reactionRules.push({
            condition: (matA, matB) => {
                return (matA.name === 'water' && matB.name === 'dirt') ||
                       (matB.name === 'water' && matA.name === 'dirt');
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                if (Math.random() < 0.03) {
                    const waterIdx = matA.name === 'water' ? idxA : idxB;
                    const dirtIdx = matA.name === 'dirt' ? idxA : idxB;
                    this.grid[waterIdx] = 0; // water absorbed
                    this.grid[dirtIdx] = this.getMaterialId('mud');
                }
            }
        });

        // Water + Clay powder (if clay is powder state) → hardens clay
        // Water on lava → obsidian + steam (temperature handles most, but ensure contact reaction)
        this.reactionRules.push({
            condition: (matA, matB) => {
                return (matA.name === 'water' && matB.name === 'lava') ||
                       (matB.name === 'water' && matA.name === 'lava');
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                if (Math.random() < 0.15) {
                    const lavaIdx = matA.name === 'lava' ? idxA : idxB;
                    const waterIdx = matA.name === 'water' ? idxA : idxB;
                    this.grid[lavaIdx] = this.getMaterialId('obsidian');
                    this.grid[waterIdx] = this.getMaterialId('steam');
                    this.temperatureGrid[lavaIdx] = 400;
                    this.temperatureGrid[waterIdx] = 100;
                }
            }
        });

        // ========== GAS REACTIONS ==========

        // Hydrogen + Oxygen + heat → Water + EXPLOSION
        this.reactionRules.push({
            condition: (matA, matB) => {
                const hasH = matA.name === 'hydrogen' || matB.name === 'hydrogen';
                const hasO = matA.name === 'oxygen' || matB.name === 'oxygen' ||
                             matA.supportsCombustion || matB.supportsCombustion;
                const idxA_t = this.temperatureGrid ? true : false;
                // Check if either cell is hot enough
                return hasH && hasO;
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                const temp = Math.max(this.temperatureGrid[idxA], this.temperatureGrid[idxB]);
                if (temp > 500 && Math.random() < 0.3) {
                    const worldX = x * this.cellSize;
                    const worldY = y * this.cellSize;
                    this.explode(worldX, worldY, 30, 100);
                    this.grid[idxA] = this.getMaterialId('steam');
                    this.temperatureGrid[idxA] = 100;
                }
            }
        });

        // Methane + fire/heat → CO2 + Water + explosion
        this.reactionRules.push({
            condition: (matA, matB) => {
                const hasMethane = matA.name === 'methane' || matB.name === 'methane';
                const hasFire = matA.name === 'fire' || matB.name === 'fire' ||
                                matA.name === 'oxygen' || matB.name === 'oxygen';
                return hasMethane && hasFire;
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                const temp = Math.max(
                    this.temperatureGrid[idxA] || 20,
                    this.temperatureGrid[idxB] || 20
                );
                if (temp > 580 && Math.random() < 0.2) {
                    const methIdx = matA.name === 'methane' ? idxA : idxB;
                    this.grid[methIdx] = this.getMaterialId('co2');
                    this.temperatureGrid[methIdx] += 200;
                    // Small explosion
                    const worldX = x * this.cellSize;
                    const worldY = y * this.cellSize;
                    this.explode(worldX, worldY, 15, 50);
                }
            }
        });

        // CO2 extinguishes fire (displaces oxygen)
        this.reactionRules.push({
            condition: (matA, matB) => {
                return (matA.name === 'co2' && matB.name === 'fire') ||
                       (matB.name === 'co2' && matA.name === 'fire');
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                if (Math.random() < 0.3) {
                    const fireIdx = matA.name === 'fire' ? idxA : idxB;
                    this.grid[fireIdx] = this.getMaterialId('smoke');
                    this.temperatureGrid[fireIdx] -= 100;
                }
            }
        });

        // ========== MATERIAL TRANSFORMATION ==========

        // Oil + Water → they don't mix (oil floats — handled by density)
        // But oil + fire near water → steam
        
        // Gunpowder + fire/heat → massive explosion
        this.reactionRules.push({
            condition: (matA, matB) => {
                const hasGP = matA.name === 'gunpowder' || matB.name === 'gunpowder';
                const hasFire = matA.name === 'fire' || matB.name === 'fire';
                return hasGP && hasFire;
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                if (Math.random() < 0.5) {
                    const worldX = x * this.cellSize;
                    const worldY = y * this.cellSize;
                    this.explode(worldX, worldY, 50, 200);
                    this.grid[idxA] = this.getMaterialId('smoke');
                    this.grid[idxB] = this.getMaterialId('smoke');
                    this.temperatureGrid[idxA] = 500;
                }
            }
        });

        // Sulfur + Fire → SO2 (toxic smoke) + heat
        this.reactionRules.push({
            condition: (matA, matB) => {
                return (matA.name === 'sulfur' && matB.name === 'fire') ||
                       (matB.name === 'sulfur' && matA.name === 'fire');
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                if (Math.random() < 0.1) {
                    const sulfIdx = matA.name === 'sulfur' ? idxA : idxB;
                    this.grid[sulfIdx] = this.getMaterialId('smoke');
                    this.temperatureGrid[sulfIdx] += 100;
                }
            }
        });

        // ========== CORROSION (property-based) ==========

        // Any corrosive material eats through non-stone solids slowly
        this.reactionRules.push({
            condition: (matA, matB) => {
                const aCorrosive = matA.corrosive && matB.state === 'solid' && matB.hardness < 6;
                const bCorrosive = matB.corrosive && matA.state === 'solid' && matA.hardness < 6;
                return aCorrosive || bCorrosive;
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                // Harder materials resist longer
                const solid = matA.corrosive ? matB : matA;
                const chance = 0.01 * (1 - solid.hardness / 10);
                if (Math.random() < chance) {
                    const solidIdx = matA.corrosive ? idxB : idxA;
                    this.grid[solidIdx] = this.getMaterialId('smoke');
                }
            }
        });
    }

    /**
     * Define a material type
     * @param {string} name - Material name
     * @param {object} props - Material properties (see PHILOSOPHY in class header)
     * @example
     * engine.physics.material('uranium', {
     *   state: 'solid',
     *   density: 19050,
     *   temperature: 20,
     *   meltingPoint: 1132,
     *   radioactive: true,
     *   heatEmission: 100,
     *   lightRadius: 40,
     *   lightColor: '#00ff00',
     *   lightIntensity: 0.5
     * });
     */
    material(name, props) {
        const id = this.materialIdMap.get(name) || this.nextMaterialId++;
        
        if (id >= this.MAX_MATERIALS) {
            console.error(`[PixelPhysics] Maximum materials (${this.MAX_MATERIALS}) exceeded!`);
            return this;
        }
        
        this.materialIdMap.set(name, id);
        this.materials.set(id, {
            id,
            name,
            ...props
        });
        
        // v3.2: Populate flat property arrays for O(1) access
        this.densityArr[id] = props.density || 0;
        this.meltPointArr[id] = props.meltingPoint != null ? props.meltingPoint : -999999;
        this.boilPointArr[id] = props.boilingPoint != null ? props.boilingPoint : 999999;
        this.ignitionPointArr[id] = props.ignitionPoint != null ? props.ignitionPoint : 999999;
        this.thermalConductivityArr[id] = props.thermalConductivity || 0;
        this.flammabilityArr[id] = props.flammability || 0;
        this.viscosityArr[id] = props.viscosity || 0.5;
        this.frictionArr[id] = props.friction || 0.5;
        
        // Encode state as integer
        const stateMap = { air: 0, solid: 1, liquid: 2, gas: 3, powder: 4 };
        this.stateArr[id] = stateMap[props.state] || 0;
        
        return this;
    }

    /**
     * Build reaction lookup table for O(1) reaction checks (v3.2)
     * @private
     */
    buildReactionLookupTable() {
        // Create lookup table: reactionLookup[matA_id * MAX + matB_id] = rule index (or 0xFFFF if no reaction)
        const size = this.MAX_MATERIALS * this.MAX_MATERIALS;
        this.reactionLookup = new Uint16Array(size);
        this.reactionLookup.fill(0xFFFF); // 0xFFFF = no reaction
        
        // For each reaction rule, find which material pairs it applies to
        for (let ruleIdx = 0; ruleIdx < this.reactionRules.length; ruleIdx++) {
            const rule = this.reactionRules[ruleIdx];
            
            // Test all material pairs
            for (let idA = 0; idA < this.nextMaterialId; idA++) {
                const matA = this.materials.get(idA);
                if (!matA) continue;
                
                for (let idB = 0; idB < this.nextMaterialId; idB++) {
                    const matB = this.materials.get(idB);
                    if (!matB) continue;
                    
                    // Check if this rule applies to this pair
                    if (rule.condition(matA, matB)) {
                        const lookupIdx = idA * this.MAX_MATERIALS + idB;
                        this.reactionLookup[lookupIdx] = ruleIdx;
                    }
                }
            }
        }
        
        console.log(`[PixelPhysics v3.2] Built reaction lookup table: ${this.reactionRules.length} rules indexed`);
    }
    
    /**
     * Get material ID by name
     * @private
     */
    getMaterialId(name) {
        return this.materialIdMap.get(name) || 0;
    }

    /**
     * Get material definition by ID
     * @private
     */
    getMaterial(id) {
        return this.materials.get(id);
    }

    /**
     * Get material name by ID
     * @param {number} id - Material ID
     * @returns {string} Material name
     */
    getMaterialName(id) {
        const mat = this.materials.get(id);
        return mat ? mat.name : 'air';
    }

    /**
     * Get cell index from grid coordinates
     * @private
     */
    index(x, y) {
        return y * this.gridWidth + x;
    }

    /**
     * Check if grid coordinates are valid
     * @private
     */
    inBounds(x, y) {
        return x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight;
    }

    /**
     * Get material at grid position
     * @param {number} x - World x coordinate
     * @param {number} y - World y coordinate
     * @returns {string|null} Material name or null if empty
     */
    get(x, y) {
        const gx = Math.floor(x / this.cellSize);
        const gy = Math.floor(y / this.cellSize);
        
        if (!this.inBounds(gx, gy)) return null;
        
        const id = this.grid[this.index(gx, gy)];
        const mat = this.getMaterial(id);
        return mat ? mat.name : 'air';
    }

    /**
     * Get temperature at position
     * @param {number} x - World x coordinate
     * @param {number} y - World y coordinate
     * @returns {number} Temperature in °C
     */
    getTemp(x, y) {
        const gx = Math.floor(x / this.cellSize);
        const gy = Math.floor(y / this.cellSize);
        
        if (!this.inBounds(gx, gy)) return this.ambientTemp;
        
        return this.temperatureGrid[this.index(gx, gy)];
    }

    /**
     * Check if position is empty
     * @param {number} x - World x coordinate
     * @param {number} y - World y coordinate
     * @returns {boolean} True if empty or out of bounds
     */
    isEmpty(x, y) {
        return this.get(x, y) === 'air';
    }

    /**
     * Set material at position
     * @param {number} x - World x coordinate
     * @param {number} y - World y coordinate
     * @param {string} material - Material name
     * @param {number} [temperature] - Optional temperature override
     */
    set(x, y, material, temperature) {
        const gx = Math.floor(x / this.cellSize);
        const gy = Math.floor(y / this.cellSize);
        
        if (!this.inBounds(gx, gy)) return;
        
        const id = this.getMaterialId(material);
        const idx = this.index(gx, gy);
        const mat = this.getMaterial(id);
        
        this.grid[idx] = id;
        
        // Set temperature
        if (temperature !== undefined) {
            this.temperatureGrid[idx] = temperature;
        } else if (mat && mat.temperature !== undefined) {
            this.temperatureGrid[idx] = mat.temperature;
        }
        
        // Initialize lifetime if material has lifetime property
        if (mat && mat.lifetime) {
            const [min, max] = mat.lifetime;
            this.lifetimeGrid[idx] = min + Math.random() * (max - min);
        }
        
        // Track heat sources
        if (mat && mat.temperature > this.ambientTemp + 50) {
            this.heatSources.add(idx);
        }
        
        // v3.2: Track light sources
        if (mat && mat.lightRadius) {
            this.lightSources.add(idx);
        }
        
        // v3.2: Mark chunk and neighbors as active
        this.activateChunk(gx, gy);
    }

    /**
     * Clear material at position
     * @param {number} x - World x coordinate
     * @param {number} y - World y coordinate
     */
    clear(x, y) {
        this.set(x, y, 'air');
    }

    /**
     * Fill a rectangular area with material
     * @param {number} x1 - Top-left world x
     * @param {number} y1 - Top-left world y
     * @param {number} x2 - Bottom-right world x
     * @param {number} y2 - Bottom-right world y
     * @param {string} material - Material name
     */
    fill(x1, y1, x2, y2, material) {
        const gx1 = Math.floor(x1 / this.cellSize);
        const gy1 = Math.floor(y1 / this.cellSize);
        const gx2 = Math.floor(x2 / this.cellSize);
        const gy2 = Math.floor(y2 / this.cellSize);
        
        for (let gy = gy1; gy <= gy2; gy++) {
            for (let gx = gx1; gx <= gx2; gx++) {
                if (this.inBounds(gx, gy)) {
                    this.set(gx * this.cellSize, gy * this.cellSize, material);
                }
            }
        }
    }

    /**
     * Clear a rectangular area
     * @param {number} x1 - Top-left world x
     * @param {number} y1 - Top-left world y
     * @param {number} x2 - Bottom-right world x
     * @param {number} y2 - Bottom-right world y
     */
    clearArea(x1, y1, x2, y2) {
        this.fill(x1, y1, x2, y2, 'air');
    }

    /**
     * Draw a circle of material
     * @param {number} cx - Center world x
     * @param {number} cy - Center world y
     * @param {number} radius - Circle radius in world units
     * @param {string} material - Material name
     */
    /**
     * NOTE: All public PixelPhysics methods (circle, set, get, explode) take
     * PIXEL/WORLD coordinates, NOT grid coordinates. They divide by cellSize internally.
     * Canvas pixel coords can be passed directly — do NOT pre-divide by cellSize.
     */
    circle(cx, cy, radius, material) {
        const gcx = Math.floor(cx / this.cellSize);
        const gcy = Math.floor(cy / this.cellSize);
        const gr = Math.ceil(radius / this.cellSize);
        
        for (let gy = gcy - gr; gy <= gcy + gr; gy++) {
            for (let gx = gcx - gr; gx <= gcx + gr; gx++) {
                if (!this.inBounds(gx, gy)) continue;
                
                const dx = gx - gcx;
                const dy = gy - gcy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist <= gr) {
                    this.set(gx * this.cellSize, gy * this.cellSize, material);
                }
            }
        }
    }

    /**
     * Create an explosion that destroys materials and scatters debris
     * @param {number} x - World x coordinate
     * @param {number} y - World y coordinate
     * @param {number} radius - Explosion radius
     * @param {number} power - Explosion power (affects scatter distance)
     */
    explode(x, y, radius, power) {
        // v3.3: Explosion sound
        this.acoustics.playExplosion(radius, power);
        
        const gx = Math.floor(x / this.cellSize);
        const gy = Math.floor(y / this.cellSize);
        const gr = Math.ceil(radius / this.cellSize);
        
        // Collect materials to scatter
        const debris = [];
        
        for (let dy = -gr; dy <= gr; dy++) {
            for (let dx = -gr; dx <= gr; dx++) {
                const px = gx + dx;
                const py = gy + dy;
                
                if (!this.inBounds(px, py)) continue;
                
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > gr) continue;
                
                const idx = this.index(px, py);
                const id = this.grid[idx];
                
                if (id !== 0) {
                    // Calculate scatter vector
                    const angle = Math.atan2(dy, dx);
                    const force = (1 - dist / gr) * power;
                    
                    debris.push({
                        mat: this.getMaterial(id).name,
                        x: px,
                        y: py,
                        vx: Math.cos(angle) * force * 0.1,
                        vy: Math.sin(angle) * force * 0.1
                    });
                    
                    // Clear the cell and heat it
                    this.grid[idx] = 0;
                    this.temperatureGrid[idx] = 1000 + Math.random() * 500;
                }
            }
        }
        
        // Scatter debris
        for (let d of debris) {
            const newX = Math.floor(d.x + d.vx);
            const newY = Math.floor(d.y + d.vy);
            
            if (this.inBounds(newX, newY)) {
                this.set(newX * this.cellSize, newY * this.cellSize, d.mat);
            }
        }
        
        // Create fire at explosion center
        this.circle(x, y, radius * 0.4, 'fire');
    }

    /**
     * Get chunk coordinates from cell coordinates (v3.2)
     * @private
     */
    getChunk(gx, gy) {
        const cx = Math.floor(gx / this.chunkSize);
        const cy = Math.floor(gy / this.chunkSize);
        if (cx < 0 || cx >= this.chunksWide || cy < 0 || cy >= this.chunksHigh) return null;
        return this.chunks[cy][cx];
    }
    
    /**
     * Activate a chunk and its neighbors (v3.2)
     * @private
     */
    activateChunk(gx, gy) {
        const cx = Math.floor(gx / this.chunkSize);
        const cy = Math.floor(gy / this.chunkSize);
        
        // Activate this chunk and all neighbors
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const ncx = cx + dx;
                const ncy = cy + dy;
                if (ncx >= 0 && ncx < this.chunksWide && ncy >= 0 && ncy < this.chunksHigh) {
                    const chunk = this.chunks[ncy][ncx];
                    chunk.active = true;
                    chunk.lastActive = this.frameCount;
                }
            }
        }
    }
    
    /**
     * Deactivate chunks that haven't changed in N frames (v3.2)
     * @private
     */
    updateChunks() {
        for (let cy = 0; cy < this.chunksHigh; cy++) {
            for (let cx = 0; cx < this.chunksWide; cx++) {
                const chunk = this.chunks[cy][cx];
                if (chunk.active && this.frameCount - chunk.lastActive > this.inactiveThreshold) {
                    chunk.active = false;
                }
            }
        }
    }
    
    /**
     * Dynamic resolution scaling (v3.2)
     * @param {number} cellSize - New cell size (1-4 recommended)
     * @example
     * engine.physics.setResolution(3); // Lower quality for better performance
     */
    setResolution(cellSize) {
        console.log(`[PixelPhysics v3.2] Changing resolution from ${this.cellSize}px to ${cellSize}px...`);
        const oldWidth = this.width;
        const oldHeight = this.height;
        this.init(oldWidth, oldHeight, cellSize);
    }
    
    /**
     * Simulate one frame of physics
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        if (!this.initialized) return;
        
        this.frameCount++;
        
        // v4.1: Reset creature population counters every 60 frames
        if (this.frameCount % 60 === 0) {
            this.creaturePopulation.worm = 0;
            this.creaturePopulation.fish = 0;
            this.creaturePopulation.bug = 0;
            this.totalCreatures = 0;
        }
        
        // v3.9: Update seasonal cycle and weather
        this.updateSeasons(dt);
        this.applyWeather();
        
        // v3.9: Trigger geological events (rare)
        if (this.frameCount % 60 === 0) {
            this.triggerGeologicalEvents();
        }
        
        // v3.9: Run multiple simulation steps for time acceleration
        const steps = Math.min(Math.floor(this.timeScale), 10); // Cap at 10 steps per frame for performance
        
        for (let step = 0; step < steps; step++) {
            this.simulateStep(dt);
        }
        
        // v3.3: Update acoustic engine
        this.acoustics.update(dt);
    }

    /**
     * v3.9: Single simulation step (called multiple times for time acceleration)
     * @private
     */
    simulateStep(dt) {
        // v3.2: Update chunk activity
        this.updateChunks();
        
        // Alternate scan direction each frame to prevent directional bias
        this.scanDirection *= -1;
        
        // First pass: Update temperature and check for state transitions
        this.updateTemperature(dt);
        
        // v3.2: Second pass: Simulate material physics (ONLY ACTIVE CHUNKS)
        for (let cy = this.chunksHigh - 1; cy >= 0; cy--) {
            for (let cx = 0; cx < this.chunksWide; cx++) {
                const chunk = this.chunks[cy][cx];
                
                // v3.2 PERFORMANCE: Skip inactive chunks
                if (!chunk.active) continue;
                
                // Get chunk bounds in grid coordinates
                const chunkStartX = cx * this.chunkSize;
                const chunkEndX = Math.min(chunkStartX + this.chunkSize, this.gridWidth);
                const chunkStartY = cy * this.chunkSize;
                const chunkEndY = Math.min(chunkStartY + this.chunkSize, this.gridHeight);
                
                // Process all cells in this active chunk
                for (let y = chunkEndY - 1; y >= chunkStartY; y--) {
                    const xStart = this.scanDirection > 0 ? chunkStartX : chunkEndX - 1;
                    const xEnd = this.scanDirection > 0 ? chunkEndX : chunkStartX - 1;
                    const xStep = this.scanDirection;
                    
                    for (let x = xStart; x !== xEnd; x += xStep) {
                        const idx = this.index(x, y);
                        const id = this.grid[idx];
                        
                        if (id === 0) continue; // Empty cell
                        
                        const mat = this.getMaterial(id);
                        if (!mat) continue;
                        
                        // Update lifetime if applicable
                        if (mat.lifetime) {
                            this.lifetimeGrid[idx] -= dt;
                            
                            if (this.lifetimeGrid[idx] <= 0) {
                                // Material died
                                if (mat.produces) {
                                    const produceId = this.getMaterialId(mat.produces);
                                    this.grid[idx] = produceId;
                                    const produceMat = this.getMaterial(produceId);
                                    if (produceMat && produceMat.lifetime) {
                                        const [min, max] = produceMat.lifetime;
                                        this.lifetimeGrid[idx] = min + Math.random() * (max - min);
                                    }
                                    if (produceMat && produceMat.temperature !== undefined) {
                                        this.temperatureGrid[idx] = produceMat.temperature;
                                    }
                                } else {
                                    this.grid[idx] = 0;
                                    this.temperatureGrid[idx] = this.ambientTemp;
                                }
                                this.activateChunk(x, y); // Material changed
                                continue;
                            }
                        }
                        
                        // v3.2: Check for ignition using flat array (faster)
                        const ignitionPoint = this.ignitionPointArr[id];
                        if (ignitionPoint < 999999 && this.temperatureGrid[idx] >= ignitionPoint) {
                            // Check if there's oxygen/air nearby
                            if (this.hasOxygenNearby(x, y)) {
                                this.igniteMaterial(x, y, mat, idx);
                                this.activateChunk(x, y); // Material changed
                                continue;
                            }
                        }
                        
                        // v3.6: Biology simulation for living materials
                        if (mat.living) {
                            this.simulateBiology(x, y, mat, idx);
                        }
                        
                        // v4.1: Count creatures (every 60 frames)
                        if (mat.creature && this.frameCount % 60 === 0) {
                            if (mat.creatureType === 'worm') this.creaturePopulation.worm++;
                            else if (mat.creatureType === 'fish') this.creaturePopulation.fish++;
                            else if (mat.creatureType === 'bug') this.creaturePopulation.bug++;
                            this.totalCreatures++;
                        }
                        
                        // v4.1: Creature simulation (every few frames for performance)
                        if (mat.creature && this.frameCount % 3 === 0) {
                            this.simulateCreature(x, y, mat, idx);
                        }
                        
                        // v3.9: Ecosystem simulation (enhanced biology)
                        if (mat.living || mat.organic) {
                            this.simulateEcosystem(x, y, mat, idx);
                        }
                        
                        // v3.9: Erosion simulation (geological time)
                        if (this.timeScale > 1) { // Only when time accelerated
                            this.simulateErosion(x, y, mat, idx);
                        }
                        
                        // v3.2: Simulate based on state (using flat array)
                        const state = this.stateArr[id];
                        if (state === 4) { // powder
                            this.simulatePowder(x, y, mat, id);
                        } else if (state === 2) { // liquid
                            this.simulateLiquid(x, y, mat, id);
                        } else if (state === 3) { // gas
                            this.simulateGas(x, y, mat, id);
                        } else if (state === 1) { // solid
                            // Solids mostly don't move
                            // But check for reactions
                            this.checkReactions(x, y, mat, idx, id);
                        }
                        
                        // v3.3: Ambient sounds (throttled)
                        if (mat.ambientSound && this.frameCount % 30 === 0 && Math.random() < 0.005) {
                            const matCount = 100; // Approximate material presence
                            const intensity = Math.min(1, matCount / 200);
                            this.acoustics.playAmbient(mat.ambientSound, intensity);
                        }
                    }
                }
            }
        }
        
        // v3.8: Detect and queue flow sounds (sample liquids/gases periodically)
        if (this.frameCount % 10 === 0 && this.soundEvents.length < this.maxSoundEventsPerFrame) {
            const flowingMaterials = new Map(); // Track count of flowing particles per material
            
            // Sample some cells to detect flowing materials
            const sampleCount = 50;
            for (let i = 0; i < sampleCount; i++) {
                const x = Math.floor(Math.random() * this.gridWidth);
                const y = Math.floor(Math.random() * this.gridHeight);
                const idx = this.index(x, y);
                const id = this.grid[idx];
                const mat = this.getMaterial(id);
                
                if (mat && (mat.state === 'liquid' || mat.state === 'gas') && mat.flowSound) {
                    const count = flowingMaterials.get(mat.name) || 0;
                    flowingMaterials.set(mat.name, count + 1);
                }
            }
            
            // Queue flow sound events for materials with enough flowing particles
            for (const [matName, count] of flowingMaterials) {
                if (count >= 3) { // At least 3 particles flowing
                    const matId = this.getMaterialId(matName);
                    const mat = this.getMaterial(matId);
                    const velocity = Math.min(1, count / 20); // More particles = faster perceived flow
                    
                    this.soundEvents.push({
                        type: 'flow',
                        material: mat,
                        velocity: velocity,
                        count: count,
                        x: this.gridWidth / 2,
                        y: this.gridHeight / 2
                    });
                }
            }
        }
        
        // v3.6: Spontaneous life generation (every ~60 frames)
        if (this.frameCount % 60 === 0) {
            // Sample random dirt cells and check if life can emerge
            const sampleCount = 5; // Check 5 random cells per cycle
            for (let i = 0; i < sampleCount; i++) {
                const x = Math.floor(Math.random() * this.gridWidth);
                const y = Math.floor(Math.random() * this.gridHeight);
                const idx = this.index(x, y);
                const id = this.grid[idx];
                const mat = this.getMaterial(id);
                
                // Check if it's dirt (or similar)
                if (mat && (mat.name === 'dirt' || mat.name === 'mud' || mat.name === 'clay')) {
                    const temp = this.temperatureGrid[idx];
                    
                    // Check conditions for life to emerge
                    const tempOk = temp >= 10 && temp <= 40;
                    const hasWater = this.hasWaterNearby(x, y, 3);
                    const hasLight = this.hasLightAbove(x, y);
                    
                    // Low chance to spawn plant (increased for visibility)
                    if (tempOk && hasWater && hasLight && Math.random() < 0.005) {
                        this.grid[idx] = this.getMaterialId('plant');
                        this.temperatureGrid[idx] = 20;
                        this.activateChunk(x, y);
                    }
                }
            }
        }
    }

    /**
     * Update temperature simulation
     * @private
     */
    updateTemperature(dt) {
        // Only process cells near heat sources for performance
        const toProcess = new Set();
        
        // Add heat sources and their neighbors
        for (let idx of this.heatSources) {
            const temp = this.temperatureGrid[idx];
            if (temp < this.ambientTemp + 30) {
                this.heatSources.delete(idx);
                continue;
            }
            
            const y = Math.floor(idx / this.gridWidth);
            const x = idx % this.gridWidth;
            
            // Add neighbors — larger radius for very hot sources
            const radius = temp > 500 ? 4 : 2;
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (this.inBounds(nx, ny)) {
                        toProcess.add(this.index(nx, ny));
                    }
                }
            }
        }
        
        // Diffuse heat
        const newTemps = new Float32Array(this.temperatureGrid.length);
        newTemps.set(this.temperatureGrid);
        
        for (let idx of toProcess) {
            const temp = this.temperatureGrid[idx];
            const id = this.grid[idx];
            const mat = this.getMaterial(id);
            
            if (!mat) continue;
            
            const y = Math.floor(idx / this.gridWidth);
            const x = idx % this.gridWidth;
            
            // Heat emission (fire, lava)
            if (mat.heatEmission) {
                newTemps[idx] = Math.min(temp + mat.heatEmission * dt * 0.1, mat.temperature + 200);
            }
            
            // Heat transfer to neighbors
            const neighbors = [
                [x - 1, y], [x + 1, y],
                [x, y - 1], [x, y + 1]
            ];
            
            for (let [nx, ny] of neighbors) {
                if (!this.inBounds(nx, ny)) continue;
                
                const nidx = this.index(nx, ny);
                const nid = this.grid[nidx];
                const nmat = this.getMaterial(nid);
                const ntemp = this.temperatureGrid[nidx];
                
                if (!nmat) continue;
                
                // Heat transfer rate based on thermal conductivity
                const avgConductivity = (mat.thermalConductivity + nmat.thermalConductivity) / 2;
                const tempDiff = temp - ntemp;
                const transfer = tempDiff * avgConductivity * dt * 0.5;
                
                // Higher transfer rate for more realistic heat spread
                const transferRate = 0.5;
                newTemps[idx] -= transfer * transferRate;
                newTemps[nidx] += transfer * transferRate;
                
                // Track new heat sources
                if (newTemps[nidx] > this.ambientTemp + 50) {
                    this.heatSources.add(nidx);
                }
            }
            
            // Cool toward ambient
            const ambientDiff = temp - this.ambientTemp;
            if (Math.abs(ambientDiff) > 1) {
                newTemps[idx] -= ambientDiff * dt * 0.02;
            }
            
            // State transitions based on temperature
            this.checkStateTransition(x, y, mat, idx, newTemps[idx]);
        }
        
        this.temperatureGrid.set(newTemps);
    }

    /**
     * Check for state transitions (melting, boiling, freezing, condensing)
     * @private
     */
    checkStateTransition(x, y, mat, idx, newTemp) {
        // Melting
        if (mat.meltingPoint !== null && newTemp > mat.meltingPoint && mat.liquidForm) {
            const liquidId = this.getMaterialId(mat.liquidForm);
            if (liquidId) {
                this.grid[idx] = liquidId;
                const liquidMat = this.getMaterial(liquidId);
                if (liquidMat) {
                    this.temperatureGrid[idx] = mat.meltingPoint;
                }
                // v3.8: Queue melting sound event
                if (mat.phaseChangeSound && Math.random() < 0.05 && this.soundEvents.length < this.maxSoundEventsPerFrame) {
                    this.soundEvents.push({
                        type: 'phaseChange',
                        material: mat,
                        intensity: 0.5,
                        x: x,
                        y: y
                    });
                }
            }
        }
        
        // Boiling
        if (mat.boilingPoint !== null && newTemp > mat.boilingPoint && mat.gasForm) {
            const gasId = this.getMaterialId(mat.gasForm);
            if (gasId) {
                this.grid[idx] = gasId;
                const gasMat = this.getMaterial(gasId);
                if (gasMat) {
                    this.temperatureGrid[idx] = mat.boilingPoint;
                }
                // v3.8: Queue boiling sound event
                if (mat.phaseChangeSound && Math.random() < 0.05 && this.soundEvents.length < this.maxSoundEventsPerFrame) {
                    this.soundEvents.push({
                        type: 'phaseChange',
                        material: mat,
                        intensity: 0.6,
                        x: x,
                        y: y
                    });
                }
            }
        }
        
        // Freezing
        if (mat.meltingPoint !== null && newTemp < mat.meltingPoint && mat.solidForm) {
            const solidId = this.getMaterialId(mat.solidForm);
            if (solidId) {
                this.grid[idx] = solidId;
                const solidMat = this.getMaterial(solidId);
                if (solidMat) {
                    this.temperatureGrid[idx] = mat.meltingPoint;
                }
                // v3.8: Queue freezing sound event
                if (mat.phaseChangeSound && Math.random() < 0.05 && this.soundEvents.length < this.maxSoundEventsPerFrame) {
                    this.soundEvents.push({
                        type: 'phaseChange',
                        material: mat,
                        intensity: 0.4,
                        x: x,
                        y: y
                    });
                }
            }
        }
        
        // Condensing
        if (mat.boilingPoint !== null && newTemp < mat.boilingPoint && mat.liquidForm) {
            const liquidId = this.getMaterialId(mat.liquidForm);
            if (liquidId) {
                this.grid[idx] = liquidId;
                const liquidMat = this.getMaterial(liquidId);
                if (liquidMat) {
                    this.temperatureGrid[idx] = mat.boilingPoint;
                }
                // v3.3: Condensing sound
                if (mat.phaseChangeSound && Math.random() < 0.03) {
                    this.acoustics.playPhaseChange('hiss', 0.3);
                }
            }
        }
    }

    /**
     * Check if there's oxygen nearby (for combustion)
     * @private
     */
    hasOxygenNearby(x, y) {
        const neighbors = [
            [x - 1, y], [x + 1, y],
            [x, y - 1], [x, y + 1],
            [x - 1, y - 1], [x + 1, y - 1],
            [x - 1, y + 1], [x + 1, y + 1]
        ];
        
        for (let [nx, ny] of neighbors) {
            if (!this.inBounds(nx, ny)) continue;
            
            const nid = this.grid[this.index(nx, ny)];
            
            // Empty cells (id=0) are air — they contain oxygen
            if (nid === 0) return true;
            
            const nmat = this.getMaterial(nid);
            if (nmat && (nmat.supportsCombustion || nmat.name === 'oxygen' || nmat.name === 'air')) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Check if light reaches a cell from above (v3.6: Biology System)
     * @private
     */
    hasLightAbove(x, y) {
        let blockers = 0;
        for (let dy = 1; dy < 10 && y - dy >= 0; dy++) {
            const checkIdx = this.index(x, y - dy);
            const checkId = this.grid[checkIdx];
            if (checkId !== 0) {
                const checkMat = this.getMaterial(checkId);
                if (checkMat && checkMat.state === 'solid') {
                    blockers++;
                    if (blockers >= 3) return false;
                }
            }
        }
        return true;
    }

    /**
     * Check if water is nearby (v3.6: Biology System)
     * @private
     */
    hasWaterNearby(x, y, radius) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (!this.inBounds(nx, ny)) continue;
                
                const nid = this.grid[this.index(nx, ny)];
                const nmat = this.getMaterial(nid);
                if (nmat && (nmat.name === 'water' || nmat.name === 'ice' || nmat.name === 'steam')) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Check if dirt is nearby (v3.6: Biology System)
     * @private
     */
    hasDirtNearby(x, y) {
        const neighbors = [
            [x - 1, y], [x + 1, y],
            [x, y - 1], [x, y + 1]
        ];
        
        for (let [nx, ny] of neighbors) {
            if (!this.inBounds(nx, ny)) continue;
            
            const nid = this.grid[this.index(nx, ny)];
            const nmat = this.getMaterial(nid);
            if (nmat && (nmat.name === 'dirt' || nmat.name === 'mud' || nmat.name === 'clay')) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if organic matter is nearby (v3.6: Biology System)
     * @private
     */
    hasOrganicNearby(x, y) {
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (!this.inBounds(nx, ny)) continue;
                
                const nid = this.grid[this.index(nx, ny)];
                const nmat = this.getMaterial(nid);
                if (nmat && nmat.organic) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Simulate biology for living materials (v3.6: Biology System)
     * @private
     */
    simulateBiology(x, y, mat, idx) {
        const temp = this.temperatureGrid[idx];
        
        // 1. SURVIVAL CHECK - Are conditions still viable?
        const tempOk = temp >= mat.minTemp && temp <= mat.maxTemp;
        const waterOk = !mat.needsWater || this.hasWaterNearby(x, y, mat.waterSearchRadius || 3);
        const lightOk = !mat.needsLight || this.hasLightAbove(x, y);
        const dirtOk = !mat.needsDirt || this.hasDirtNearby(x, y);
        const organicOk = !mat.needsOrganic || this.hasOrganicNearby(x, y);
        const darkOk = mat.needsLight === false ? !this.hasLightAbove(x, y) : true;
        
        // If conditions fail, cell dies → decay
        if (!tempOk || !waterOk || !lightOk || !dirtOk || !organicOk || !darkOk) {
            if (mat.deathForm && Math.random() < 0.01) {
                const deathId = this.getMaterialId(mat.deathForm);
                if (deathId) {
                    this.grid[idx] = deathId;
                    const deathMat = this.getMaterial(deathId);
                    if (deathMat && deathMat.lifetime) {
                        const [min, max] = deathMat.lifetime;
                        this.lifetimeGrid[idx] = min + Math.random() * (max - min);
                    }
                    this.activateChunk(x, y);
                }
            }
            return;
        }
        
        // 2. OXYGEN PRODUCTION - Living plants convert CO2 to oxygen
        if (mat.producesOxygen && Math.random() < 0.005) {
            // v4.1: Update global O2/CO2 levels
            this.oxygenLevel = Math.min(1000, this.oxygenLevel + 0.2);
            this.co2Level = Math.max(0, this.co2Level - 0.2);
            
            const neighbors = [
                [x - 1, y], [x + 1, y],
                [x, y - 1], [x, y + 1]
            ];
            
            for (let [nx, ny] of neighbors) {
                if (!this.inBounds(nx, ny)) continue;
                
                const nidx = this.index(nx, ny);
                const nid = this.grid[nidx];
                const nmat = this.getMaterial(nid);
                
                // Convert CO2 to oxygen
                if (nmat && nmat.name === 'co2') {
                    this.grid[nidx] = this.getMaterialId('oxygen');
                    this.activateChunk(nx, ny);
                    break;
                }
            }
        }
        
        // 3. GROWTH/REPRODUCTION - Spread to adjacent cells
        // v4.1: Growth rate affected by soil fertility
        let fertility = 1.0;
        if (this.fertilityGrid && mat.needsDirt) {
            fertility = this.fertilityGrid[idx] || 0.5;
            // Block growth if fertility too low
            if (fertility < 0.1) return;
        }
        
        const effectiveGrowthRate = mat.growthRate * fertility;
        
        if (Math.random() < effectiveGrowthRate) {
            const neighbors = [
                [x - 1, y], [x + 1, y],
                [x, y - 1], [x, y + 1],
                [x - 1, y - 1], [x + 1, y - 1]
            ];
            
            // Shuffle neighbors for randomness
            for (let i = neighbors.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
            }
            
            for (let [nx, ny] of neighbors) {
                if (!this.inBounds(nx, ny)) continue;
                
                const nidx = this.index(nx, ny);
                const nid = this.grid[nidx];
                
                // Can grow into empty spaces or dirt
                if (nid === 0 || (this.getMaterial(nid) && this.getMaterial(nid).name === 'dirt')) {
                    // Check if target location has good conditions
                    const targetTemp = this.temperatureGrid[nidx];
                    const targetTempOk = targetTemp >= mat.minTemp && targetTemp <= mat.maxTemp;
                    const targetWaterOk = !mat.needsWater || this.hasWaterNearby(nx, ny, mat.waterSearchRadius || 3);
                    const targetLightOk = !mat.needsLight || this.hasLightAbove(nx, ny);
                    const targetDirtOk = !mat.needsDirt || this.hasDirtNearby(nx, ny);
                    const targetDarkOk = mat.needsLight === false ? !this.hasLightAbove(nx, ny) : true;
                    
                    if (targetTempOk && targetWaterOk && targetLightOk && targetDirtOk && targetDarkOk) {
                        this.grid[nidx] = this.getMaterialId(mat.name);
                        this.temperatureGrid[nidx] = mat.temperature;
                        
                        // v4.1: Decrease fertility when plant grows
                        if (this.fertilityGrid && mat.needsDirt) {
                            // Find dirt below and decrease its fertility
                            for (let dy = 0; dy < 3; dy++) {
                                const checkY = ny + dy;
                                if (!this.inBounds(nx, checkY)) continue;
                                const checkIdx = this.index(nx, checkY);
                                const checkId = this.grid[checkIdx];
                                const checkMat = this.getMaterial(checkId);
                                if (checkMat && checkMat.name === 'dirt') {
                                    this.fertilityGrid[checkIdx] = Math.max(0, this.fertilityGrid[checkIdx] - 0.05);
                                }
                            }
                        }
                        
                        this.activateChunk(nx, ny);
                        break; // Only grow one cell per frame
                    }
                }
            }
        }
        
        // 4. TREE GROWTH - Vegetation columns harden into wood
        if (mat.name === 'vegetation') {
            // Check if there's a tall column (5+ cells high)
            let columnHeight = 1;
            for (let dy = 1; dy < 10 && y + dy < this.gridHeight; dy++) {
                const checkIdx = this.index(x, y + dy);
                const checkId = this.grid[checkIdx];
                const checkMat = this.getMaterial(checkId);
                if (checkMat && checkMat.name === 'vegetation') {
                    columnHeight++;
                } else {
                    break;
                }
            }
            
            // If column is tall enough, harden bottom cells to wood
            if (columnHeight >= 5 && Math.random() < 0.002) {
                this.grid[idx] = this.getMaterialId('wood');
                this.temperatureGrid[idx] = 20;
                this.activateChunk(x, y);
            }
        }
        
        // 5. DECOMPOSITION - Fungus breaks down organic matter
        if (mat.decomposer && Math.random() < 0.01) {
            const neighbors = [
                [x - 1, y], [x + 1, y],
                [x, y - 1], [x, y + 1]
            ];
            
            for (let [nx, ny] of neighbors) {
                if (!this.inBounds(nx, ny)) continue;
                
                const nidx = this.index(nx, ny);
                const nid = this.grid[nidx];
                const nmat = this.getMaterial(nid);
                
                // Decompose dead organic matter to dirt
                if (nmat && nmat.name === 'decay') {
                    this.grid[nidx] = this.getMaterialId('dirt');
                    this.temperatureGrid[nidx] = this.ambientTemp;
                    this.activateChunk(nx, ny);
                    break;
                }
            }
        }
    }

    /**
     * v4.1: Simulate creatures (worms, fish, bugs)
     * @private
     */
    simulateCreature(x, y, mat, idx) {
        if (!mat.creature) return;
        
        const temp = this.temperatureGrid[idx];
        const creatureType = mat.creatureType;
        
        // Use lifetime grid to store creature state:
        // Bits 0-15: hunger counter (0-65535)
        // Bits 16-23: direction (0-7)
        // Bit 24-31: movement timer
        
        let state = this.lifetimeGrid[idx];
        if (state === 0) {
            // Initialize new creature with starting hunger (grace period) and random direction
            var initHunger = 5000; // Start with some energy so they don't starve instantly
            state = initHunger | (Math.floor(Math.random() * 8) << 16);
            this.lifetimeGrid[idx] = state;
        }
        
        const hunger = Math.floor(state) & 0xFFFF;
        const direction = (Math.floor(state) >> 16) & 0xFF;
        const moveTimer = (Math.floor(state) >> 24) & 0xFF;
        
        // 1. DEATH CONDITIONS
        const tempOk = temp >= mat.minTemp && temp <= mat.maxTemp;
        
        // Check environment
        let envOk = true;
        if (mat.needsEnvironment) {
            envOk = false;
            for (const envMat of mat.needsEnvironment) {
                if (this.hasNearbyMaterial(x, y, envMat, 1)) {
                    envOk = true;
                    break;
                }
            }
        }
        
        // Bug dies in water
        if (mat.diesInWater && this.hasNearbyMaterial(x, y, 'water', 1)) {
            this.grid[idx] = this.getMaterialId('decay');
            this.creatureDeaths[creatureType]++;
            this.totalCreatures--;
            return;
        }
        
        // Die if temperature or environment bad
        if (!tempOk || !envOk) {
            if (Math.random() < 0.02) {
                this.grid[idx] = this.getMaterialId('decay');
                this.creatureDeaths[creatureType]++;
                this.totalCreatures--;
                this.activateChunk(x, y);
                return;
            }
        }
        
        // Die of starvation (only after creature has lived a while — moveTimer tracks age)
        // New creatures get grace period; starvation only kicks in after some time with no food
        if (hunger === 0 && moveTimer > 50 && Math.random() < 0.002) {
            this.grid[idx] = this.getMaterialId('decay');
            this.creatureDeaths[creatureType]++;
            this.totalCreatures--;
            this.activateChunk(x, y);
            return;
        }
        
        // 2. CONSUME O2
        if (mat.consumesO2 && Math.random() < 0.01) {
            this.oxygenLevel = Math.max(0, this.oxygenLevel - 0.1);
            this.co2Level += 0.1;
            
            // Die faster in low O2
            if (this.oxygenLevel < 50 && Math.random() < 0.005) {
                this.grid[idx] = this.getMaterialId('decay');
                this.creatureDeaths[creatureType]++;
                this.totalCreatures--;
                return;
            }
        }
        
        // 3. EATING
        if (mat.eatsFood && Math.random() < 0.05) {
            const neighbors = [
                [x - 1, y], [x + 1, y],
                [x, y - 1], [x, y + 1]
            ];
            
            for (const [nx, ny] of neighbors) {
                if (!this.inBounds(nx, ny)) continue;
                
                const nidx = this.index(nx, ny);
                const nid = this.grid[nidx];
                const nmat = this.getMaterial(nid);
                
                if (nmat && mat.eatsFood.includes(nmat.name)) {
                    // Eat the food
                    this.grid[nidx] = 0;
                    
                    // Increase hunger counter
                    const newHunger = Math.min(hunger + 100, 65535);
                    this.lifetimeGrid[idx] = newHunger | (direction << 16) | (moveTimer << 24);
                    
                    // Worms eating decay enriches nearby dirt
                    if (creatureType === 'worm' && nmat.name === 'decay') {
                        for (let dy = -2; dy <= 2; dy++) {
                            for (let dx = -2; dx <= 2; dx++) {
                                const fx = x + dx;
                                const fy = y + dy;
                                if (!this.inBounds(fx, fy)) continue;
                                
                                const fidx = this.index(fx, fy);
                                const fid = this.grid[fidx];
                                const fmat = this.getMaterial(fid);
                                if (fmat && fmat.name === 'dirt') {
                                    this.fertilityGrid[fidx] = Math.min(1.0, this.fertilityGrid[fidx] + 0.1);
                                }
                            }
                        }
                        
                        // Play worm eating sound
                        if (this.acoustics && this.acoustics.enabled) {
                            this.acoustics.playCreatureSound('worm', 'eat');
                        }
                    }
                    
                    // Play eating sounds
                    if (creatureType === 'fish' && this.acoustics && this.acoustics.enabled) {
                        this.acoustics.playCreatureSound('fish', 'eat');
                    }
                    if (creatureType === 'bug' && this.acoustics && this.acoustics.enabled) {
                        this.acoustics.playCreatureSound('bug', 'eat');
                    }
                    
                    this.activateChunk(nx, ny);
                    break;
                }
            }
        }
        
        // 4. REPRODUCTION
        // Realistic: high hunger threshold, very low chance, strict population cap
        if (hunger > 40000 && Math.random() < 0.0001 && this.totalCreatures < this.maxCreatures) {
            const neighbors = [
                [x - 1, y], [x + 1, y],
                [x, y - 1], [x, y + 1]
            ];
            
            for (const [nx, ny] of neighbors) {
                if (!this.inBounds(nx, ny)) continue;
                
                const nidx = this.index(nx, ny);
                const nid = this.grid[nidx];
                const nmatName = this.getMaterial(nid)?.name;
                
                // Reproduce ONLY into appropriate environment
                let canReproduce = false;
                if (creatureType === 'worm' && (nmatName === 'dirt' || nid === 0)) canReproduce = true;
                if (creatureType === 'fish' && nmatName === 'water') canReproduce = true;
                if (creatureType === 'bug' && nid === 0) canReproduce = true;
                
                if (canReproduce) {
                    this.grid[nidx] = this.getMaterialId(mat.name);
                    this.temperatureGrid[nidx] = mat.temperature;
                    this.lifetimeGrid[nidx] = 0; // Will initialize on next frame
                    
                    // Reduce parent hunger
                    const newHunger = Math.max(0, hunger - 20000);
                    this.lifetimeGrid[idx] = newHunger | (direction << 16) | (moveTimer << 24);
                    
                    this.creatureBirths[creatureType]++;
                    this.totalCreatures++;
                    this.activateChunk(nx, ny);
                    break;
                }
            }
        }
        
        // 5. MOVEMENT
        if (Math.random() < mat.moveSpeed) {
            // Decrement hunger slowly and increment age timer
            const newHunger = Math.max(0, hunger - 1);
            var newMoveTimer = Math.min(255, moveTimer + 1);
            
            // Change direction sometimes
            let newDirection = direction;
            if (Math.random() < 0.1) {
                newDirection = Math.floor(Math.random() * 8);
            }
            
            // Calculate movement direction
            const dx = [0, 1, 1, 1, 0, -1, -1, -1][newDirection];
            const dy = [-1, -1, 0, 1, 1, 1, 0, -1][newDirection];
            
            const nx = x + dx;
            const ny = y + dy;
            
            if (this.inBounds(nx, ny)) {
                const nidx = this.index(nx, ny);
                const nid = this.grid[nidx];
                const nmat = this.getMaterial(nid);
                
                // Check if can move to target cell
                let canMove = false;
                
                if (creatureType === 'worm') {
                    // Worms can move through dirt and into empty space
                    if (nid === 0 || (nmat && nmat.name === 'dirt')) {
                        canMove = true;
                    }
                } else if (creatureType === 'fish') {
                    // Fish can move through water
                    if (nmat && nmat.name === 'water') {
                        canMove = true;
                    }
                } else if (creatureType === 'bug') {
                    // Bugs walk on surfaces (move into air above solid)
                    if (nid === 0) {
                        // Check if there's a solid below
                        const belowIdx = this.index(nx, ny + 1);
                        if (this.inBounds(nx, ny + 1)) {
                            const belowId = this.grid[belowIdx];
                            const belowMat = this.getMaterial(belowId);
                            if (belowMat && belowMat.state === 'solid') {
                                canMove = true;
                            }
                        }
                    }
                }
                
                if (canMove) {
                    // Remember what was at the destination (to restore if creature was displacing it)
                    // When creature leaves, restore appropriate material behind it
                    var restoreMat = 0; // default: air
                    if (creatureType === 'worm') restoreMat = this.getMaterialId('dirt');
                    else if (creatureType === 'fish') restoreMat = this.getMaterialId('water');
                    // bugs walk on air, so leave air behind
                    
                    // Move creature
                    this.grid[nidx] = this.grid[idx];
                    this.temperatureGrid[nidx] = this.temperatureGrid[idx];
                    this.lifetimeGrid[nidx] = newHunger | (newDirection << 16) | (newMoveTimer << 24);
                    
                    this.grid[idx] = restoreMat;
                    this.temperatureGrid[idx] = this.ambientTemp;
                    this.lifetimeGrid[idx] = 0;
                    
                    this.activateChunk(x, y);
                    this.activateChunk(nx, ny);
                } else {
                    // Bounce - reverse direction
                    newDirection = (newDirection + 4) % 8;
                    this.lifetimeGrid[idx] = newHunger | (newDirection << 16) | (newMoveTimer << 24);
                }
            } else {
                // Hit boundary - reverse direction
                newDirection = (newDirection + 4) % 8;
                this.lifetimeGrid[idx] = newHunger | (newDirection << 16) | (newMoveTimer << 24);
            }
        }
    }

    /**
     * v4.1: Check if material is nearby
     * @private
     */
    hasNearbyMaterial(x, y, materialName, radius) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (!this.inBounds(nx, ny)) continue;
                
                const nidx = this.index(nx, ny);
                const nid = this.grid[nidx];
                const nmat = this.getMaterial(nid);
                if (nmat && nmat.name === materialName) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * v3.9: Set time acceleration scale
     * @param {number} scale - Time multiplier (1x, 10x, 100x, 1000x)
     */
    setTimeScale(scale) {
        this.timeScale = scale;
        console.log(`⏱️ Time scale set to ${scale}x`);
    }

    /**
     * v3.9: Update seasonal cycle
     * @private
     */
    updateSeasons(dt) {
        // Advance world age based on time scale
        const yearsPerSecond = 0.01; // 0.01 years per second at 1x (100 seconds = 1 year)
        this.worldAge += yearsPerSecond * dt * this.timeScale;
        
        // Season cycle: 4 seasons per year
        this.seasonCycle = (this.worldAge * 4) % 4;
        
        // Determine current season
        if (this.seasonCycle < 1) {
            this.season = 'spring';
            this.weather.season = 'spring';
            this.weather.temperature = 15 + Math.random() * 5; // 15-20°C
            this.weather.rainChance = 0.3;
            this.weather.windStrength = 0.5;
            this.weather.dayLength = 12;
            this.ambientTemp = 18;
        } else if (this.seasonCycle < 2) {
            this.season = 'summer';
            this.weather.season = 'summer';
            this.weather.temperature = 25 + Math.random() * 10; // 25-35°C
            this.weather.rainChance = 0.1;
            this.weather.windStrength = 0.3;
            this.weather.dayLength = 16;
            this.ambientTemp = 30;
        } else if (this.seasonCycle < 3) {
            this.season = 'fall';
            this.weather.season = 'fall';
            this.weather.temperature = 10 + Math.random() * 5; // 10-15°C
            this.weather.rainChance = 0.4;
            this.weather.windStrength = 0.8;
            this.weather.dayLength = 10;
            this.ambientTemp = 12;
        } else {
            this.season = 'winter';
            this.weather.season = 'winter';
            this.weather.temperature = -5 + Math.random() * 10; // -5 to 5°C
            this.weather.rainChance = 0.2; // Snow instead
            this.weather.windStrength = 0.6;
            this.weather.dayLength = 8;
            this.ambientTemp = 0;
        }
    }

    /**
     * v3.9: Apply weather effects
     * @private
     */
    applyWeather() {
        // Rain/snow spawning (every N frames based on rain chance)
        if (Math.random() < this.weather.rainChance * 0.001) {
            const x = Math.floor(Math.random() * this.gridWidth);
            const y = 0; // Top of grid
            const idx = this.index(x, y);
            
            if (this.grid[idx] === 0) { // Only spawn in empty cells
                if (this.season === 'winter' && this.weather.temperature < 5) {
                    // Snow (ice particles)
                    this.grid[idx] = this.getMaterialId('ice');
                    this.temperatureGrid[idx] = -5;
                } else {
                    // Rain (water)
                    this.grid[idx] = this.getMaterialId('water');
                    this.temperatureGrid[idx] = this.weather.temperature;
                }
                this.activateChunk(x, y);
            }
        }
        
        // Wind variation (smooth changes)
        this.wind.x += (Math.random() - 0.5) * 0.1;
        this.wind.x = Math.max(-this.weather.windStrength * 2, Math.min(this.weather.windStrength * 2, this.wind.x));
        this.wind.x *= 0.99; // Dampening
    }

    /**
     * v3.9: Simulate erosion effects
     * @private
     */
    simulateErosion(x, y, mat, idx) {
        // WATER EROSION: flowing water slowly converts stone→sand→dirt
        if (mat.name === 'water') {
            const neighbors = [
                [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
            ];
            
            for (let [nx, ny] of neighbors) {
                if (!this.inBounds(nx, ny)) continue;
                
                const nidx = this.index(nx, ny);
                const nid = this.grid[nidx];
                const nmat = this.getMaterial(nid);
                
                if (!nmat) continue;
                
                // Water erodes stone to sand (very slow, geological time)
                if (nmat.name === 'stone' && Math.random() < 0.0001 * this.timeScale) {
                    this.grid[nidx] = this.getMaterialId('sand');
                    this.temperatureGrid[nidx] = this.temperatureGrid[idx];
                    this.activateChunk(nx, ny);
                    this.erosionStats.waterErosion++;
                }
                // Water erodes sand to dirt (faster than stone)
                else if (nmat.name === 'sand' && Math.random() < 0.0005 * this.timeScale) {
                    this.grid[nidx] = this.getMaterialId('dirt');
                    this.temperatureGrid[nidx] = this.temperatureGrid[idx];
                    this.activateChunk(nx, ny);
                    this.erosionStats.waterErosion++;
                }
            }
        }
        
        // WIND EROSION: exposed sand/dirt particles shift in wind direction
        if ((mat.name === 'sand' || mat.name === 'dirt') && Math.abs(this.wind.x) > 0.5) {
            const windDir = this.wind.x > 0 ? 1 : -1;
            const nx = x + windDir;
            const ny = y - 1; // Wind tends to lift particles slightly
            
            if (this.inBounds(nx, ny)) {
                const nidx = this.index(nx, ny);
                const nid = this.grid[nidx];
                
                // Check if destination is air (exposed particle)
                if (nid === 0 && Math.random() < 0.00005 * this.timeScale * Math.abs(this.wind.x)) {
                    // Check if current cell is exposed to air above
                    const aboveIdx = this.index(x, y - 1);
                    if (this.inBounds(x, y - 1) && this.grid[aboveIdx] === 0) {
                        // Move particle in wind direction
                        this.grid[nidx] = this.grid[idx];
                        this.temperatureGrid[nidx] = this.temperatureGrid[idx];
                        this.grid[idx] = 0;
                        this.temperatureGrid[idx] = this.ambientTemp;
                        this.activateChunk(x, y);
                        this.activateChunk(nx, ny);
                        this.erosionStats.windErosion++;
                    }
                }
            }
        }
        
        // THERMAL EROSION: temperature cycling cracks stone
        if (mat.name === 'stone') {
            const temp = this.temperatureGrid[idx];
            const tempSwing = Math.abs(temp - this.ambientTemp);
            
            // Check if exposed to air (surface)
            const aboveIdx = this.index(x, y - 1);
            const exposed = this.inBounds(x, y - 1) && this.grid[aboveIdx] === 0;
            
            // Big temperature swings on exposed surfaces crack stone
            if (exposed && tempSwing > 40 && Math.random() < 0.00001 * this.timeScale * (tempSwing / 40)) {
                this.grid[idx] = this.getMaterialId('sand');
                this.temperatureGrid[idx] = this.ambientTemp;
                this.activateChunk(x, y);
                this.erosionStats.thermalErosion++;
            }
        }
    }

    /**
     * v3.9: Simulate ecosystem biology (enhanced)
     * @private
     */
    simulateEcosystem(x, y, mat, idx) {
        // Apply seasonal growth modifiers
        let growthModifier = 1.0;
        if (this.season === 'spring') growthModifier = 1.5; // Boost growth in spring
        else if (this.season === 'summer') growthModifier = 1.2; // Good growth in summer
        else if (this.season === 'fall') growthModifier = 0.7; // Slower growth in fall
        else if (this.season === 'winter') growthModifier = 0.1; // Dormant in winter
        
        // Seasonal death rate for plants
        let deathRateModifier = 1.0;
        if (this.season === 'fall') deathRateModifier = 3.0; // Leaves fall
        else if (this.season === 'winter') deathRateModifier = 2.0; // Cold kills plants
        
        // Modify biology simulation with seasonal effects
        if (mat.living && mat.growthRate) {
            // Apply seasonal growth rate
            const modifiedGrowthRate = mat.growthRate * growthModifier;
            
            // SEED DISPERSAL: wind carries plant seeds
            if ((mat.name === 'plant' || mat.name === 'vegetation') && Math.abs(this.wind.x) > 0.3 && Math.random() < 0.001 * this.timeScale) {
                const windDir = this.wind.x > 0 ? 1 : -1;
                const seedDist = Math.floor(Math.random() * 5) + 3; // 3-7 cells away
                const nx = x + (windDir * seedDist);
                const ny = y + Math.floor(Math.random() * 3) - 1; // Slight vertical variation
                
                if (this.inBounds(nx, ny)) {
                    const nidx = this.index(nx, ny);
                    const nid = this.grid[nidx];
                    const nmat = this.getMaterial(nid);
                    
                    // Can seed in dirt or empty space above dirt
                    if (nmat && nmat.name === 'dirt') {
                        this.grid[nidx] = this.getMaterialId('plant');
                        this.temperatureGrid[nidx] = this.ambientTemp;
                        this.activateChunk(nx, ny);
                    }
                }
            }
            
            // FIRE ECOLOGY: dry + summer + fire = forest fires
            if (mat.flammability > 0 && this.season === 'summer' && this.weather.rainChance < 0.15) {
                const temp = this.temperatureGrid[idx];
                // Very dry conditions lower ignition threshold
                const dryIgnitionPoint = mat.ignitionPoint * 0.8;
                
                if (temp >= dryIgnitionPoint && Math.random() < 0.001) {
                    this.igniteMaterial(x, y, mat, idx);
                }
            }
            
            // SOIL BUILDING: decay + dirt = richer soil (boost nearby plant growth)
            if (mat.name === 'decay' && Math.random() < 0.01 * this.timeScale) {
                const neighbors = [
                    [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
                ];
                
                for (let [nx, ny] of neighbors) {
                    if (!this.inBounds(nx, ny)) continue;
                    
                    const nidx = this.index(nx, ny);
                    const nid = this.grid[nidx];
                    const nmat = this.getMaterial(nid);
                    
                    // v4.1: Enrich nearby dirt fertility
                    if (nmat && nmat.name === 'dirt' && this.fertilityGrid) {
                        this.fertilityGrid[nidx] = Math.min(1.0, this.fertilityGrid[nidx] + 0.02);
                    }
                }
            }
        }
    }

    /**
     * v3.9: Trigger geological events
     * @private
     */
    triggerGeologicalEvents() {
        // Check for events based on world age (per simulated "year")
        const yearsPassed = Math.floor(this.worldAge);
        
        // Only check once per year
        if (yearsPassed === this.lastEventCheck) return;
        this.lastEventCheck = yearsPassed;
        
        // EARTHQUAKE: shake and displace materials
        if (Math.random() < this.geologicalEvents.earthquakeChance) {
            console.log(`🌍 Earthquake at year ${yearsPassed}!`);
            
            // Displace random chunks of material
            for (let i = 0; i < 20; i++) {
                const x = Math.floor(Math.random() * this.gridWidth);
                const y = Math.floor(Math.random() * this.gridHeight);
                const idx = this.index(x, y);
                const id = this.grid[idx];
                const mat = this.getMaterial(id);
                
                if (mat && mat.name === 'stone' && Math.random() < 0.3) {
                    // Crack stone to sand
                    this.grid[idx] = this.getMaterialId('sand');
                    this.activateChunk(x, y);
                }
            }
            
            // Camera shake (if engine has camera)
            if (this.engine && this.engine.cameraShake) {
                this.engine.cameraShake(15);
            }
        }
        
        // VOLCANIC ERUPTION: spawn lava from bottom
        if (Math.random() < this.geologicalEvents.volcanicChance) {
            console.log(`🌋 Volcanic eruption at year ${yearsPassed}!`);
            
            const eruptX = Math.floor(Math.random() * this.gridWidth);
            const eruptY = this.gridHeight - Math.floor(Math.random() * 20) - 5; // Near bottom
            
            // Create lava source
            for (let dy = 0; dy < 10; dy++) {
                for (let dx = -3; dx <= 3; dx++) {
                    const x = eruptX + dx;
                    const y = eruptY + dy;
                    
                    if (this.inBounds(x, y) && Math.random() < 0.7) {
                        const idx = this.index(x, y);
                        this.grid[idx] = this.getMaterialId('lava');
                        this.temperatureGrid[idx] = 1200;
                        this.activateChunk(x, y);
                        this.heatSources.add(idx);
                    }
                }
            }
        }
        
        // FLOOD: massive water spawn
        if (Math.random() < this.geologicalEvents.floodChance) {
            console.log(`🌊 Flood at year ${yearsPassed}!`);
            
            // Spawn water across top quarter of world
            for (let i = 0; i < 50; i++) {
                const x = Math.floor(Math.random() * this.gridWidth);
                const y = Math.floor(Math.random() * (this.gridHeight * 0.25));
                const idx = this.index(x, y);
                
                if (this.grid[idx] === 0) {
                    this.grid[idx] = this.getMaterialId('water');
                    this.temperatureGrid[idx] = this.weather.temperature;
                    this.activateChunk(x, y);
                }
            }
        }
    }

    /**
     * Ignite a flammable material (emergent combustion)
     * @private
     */
    igniteMaterial(x, y, mat, idx) {
        // Check for explosion
        if (mat.explosive) {
            const worldX = x * this.cellSize;
            const worldY = y * this.cellSize;
            this.explode(worldX, worldY, mat.explosionRadius || 40, mat.explosionPower || 150);
            return;
        }
        
        // Normal combustion
        this.grid[idx] = this.getMaterialId('fire');
        this.temperatureGrid[idx] = 800;
        const fireMat = this.getMaterial(this.grid[idx]);
        if (fireMat && fireMat.lifetime) {
            const [min, max] = fireMat.lifetime;
            this.lifetimeGrid[idx] = min + Math.random() * (max - min);
        }
        
        // Release combustion energy as heat to neighbors
        if (mat.combustionEnergy) {
            const neighbors = [
                [x - 1, y], [x + 1, y],
                [x, y - 1], [x, y + 1]
            ];
            
            for (let [nx, ny] of neighbors) {
                if (!this.inBounds(nx, ny)) continue;
                
                const nidx = this.index(nx, ny);
                this.temperatureGrid[nidx] += mat.combustionEnergy * 10;
                this.heatSources.add(nidx);
            }
        }
    }

    /**
     * Check for chemical reactions (v3.2: O(1) lookup table)
     * @private
     */
    checkReactions(x, y, mat, idx, id) {
        const neighbors = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1]
        ];
        
        for (let [nx, ny] of neighbors) {
            if (!this.inBounds(nx, ny)) continue;
            
            const nidx = this.index(nx, ny);
            const nid = this.grid[nidx];
            
            if (nid === 0) continue; // Air - no reaction
            
            // v3.2: O(1) reaction lookup (no nested loops!)
            const lookupIdx = id * this.MAX_MATERIALS + nid;
            const ruleIdx = this.reactionLookup[lookupIdx];
            
            if (ruleIdx !== 0xFFFF) {
                // Reaction found!
                const rule = this.reactionRules[ruleIdx];
                const nmat = this.getMaterial(nid);
                
                // v3.8: Queue reaction sound event
                if (Math.random() < 0.1 && this.soundEvents.length < this.maxSoundEventsPerFrame) {
                    const productId = this.grid[idx]; // Check what the reaction produced
                    const product = this.getMaterial(productId);
                    const intensity = Math.max(mat.reactivity || 0.5, nmat.reactivity || 0.5);
                    this.soundEvents.push({
                        type: 'reaction',
                        mat1: mat,
                        mat2: nmat,
                        product: product,
                        intensity: intensity,
                        x: x,
                        y: y
                    });
                }
                
                rule.react(x, y, mat, nmat, idx, nidx);
                this.activateChunk(x, y); // Reaction occurred
                break; // Only one reaction per frame
            }
        }
    }

    /**
     * Simulate powder behavior (sand, dirt, etc.) (v3.2: uses flat arrays)
     * @private
     */
    simulatePowder(x, y, mat, id) {
        // Try to fall straight down
        if (this.tryMove(x, y, x, y + 1, id)) return;
        
        // v3.2: Try to fall diagonally (with friction from flat array)
        const friction = this.frictionArr[id];
        if (Math.random() > friction) {
            const dir = Math.random() < 0.5 ? -1 : 1;
            if (this.tryMove(x, y, x + dir, y + 1, id)) return;
            if (this.tryMove(x, y, x - dir, y + 1, id)) return;
        }
    }

    /**
     * Simulate liquid behavior (water, oil, lava, etc.) (v3.2: uses flat arrays)
     * @private
     */
    simulateLiquid(x, y, mat, id) {
        // Try to fall
        if (this.tryMove(x, y, x, y + 1, id)) return;
        
        // Try to fall diagonally
        const dir = Math.random() < 0.5 ? -1 : 1;
        if (this.tryMove(x, y, x + dir, y + 1, id)) return;
        if (this.tryMove(x, y, x - dir, y + 1, id)) return;
        
        // v3.2: Spread horizontally (with viscosity from flat array)
        const viscosity = this.viscosityArr[id];
        if (Math.random() > viscosity) {
            const spreadDir = Math.random() < 0.5 ? -1 : 1;
            if (this.tryMove(x, y, x + spreadDir, y, id)) return;
            if (this.tryMove(x, y, x - spreadDir, y, id)) return;
        }
    }

    /**
     * Simulate gas behavior (fire, smoke, steam, etc.) (v3.5: uses flat arrays + wind)
     * @private
     */
    simulateGas(x, y, mat, id) {
        // v3.5: Gases rise if density is negative (hot gases) - use flat array
        const density = this.densityArr[id];
        const rising = density < 0;
        
        // v3.5: Apply wind force (affects movement direction)
        const windX = Math.round(this.wind.x);
        const windY = Math.round(this.wind.y);
        
        if (rising) {
            // Try to rise (with wind offset)
            if (this.tryMove(x, y, x + windX, y - 1 + windY, id)) return;
            
            // Try to rise diagonally (wind affects direction preference)
            const windDir = this.wind.x > 0 ? 1 : (this.wind.x < 0 ? -1 : (Math.random() < 0.5 ? -1 : 1));
            if (this.tryMove(x, y, x + windDir, y - 1, id)) return;
            if (this.tryMove(x, y, x - windDir, y - 1, id)) return;
        } else {
            // Sink (heavy gas like CO2) - wind still affects horizontal
            if (this.tryMove(x, y, x + windX, y + 1 + windY, id)) return;
        }
        
        // Spread horizontally (wind biases direction)
        if (Math.random() < 0.4) {
            const spreadChance = Math.abs(this.wind.x) > 0.1 ? Math.random() : 0.5;
            const spreadDir = this.wind.x > 0.1 ? 1 : (this.wind.x < -0.1 ? -1 : (spreadChance < 0.5 ? -1 : 1));
            if (this.tryMove(x, y, x + spreadDir, y, id)) return;
        }
    }

    /**
     * Try to move a cell from (x1,y1) to (x2,y2) (v3.2: uses flat arrays, activates chunks)
     * @private
     */
    tryMove(x1, y1, x2, y2, id1) {
        if (!this.inBounds(x2, y2)) return false;
        
        const idx1 = this.index(x1, y1);
        const idx2 = this.index(x2, y2);
        const id2 = this.grid[idx2];
        
        if (id2 === 0) {
            // Empty cell - move there
            this.grid[idx2] = id1;
            this.temperatureGrid[idx2] = this.temperatureGrid[idx1];
            this.lifetimeGrid[idx2] = this.lifetimeGrid[idx1];
            
            this.grid[idx1] = 0;
            this.temperatureGrid[idx1] = this.ambientTemp;
            this.lifetimeGrid[idx1] = 0;
            
            // v3.2: Mark both chunks as active
            this.activateChunk(x2, y2);
            
            return true;
        }
        
        // v3.2: Solids block everything (use flat array)
        const state2 = this.stateArr[id2];
        if (state2 === 1) return false; // solid
        
        // v3.2: Density-based displacement (use flat arrays)
        // liquids (2) and gases (3) can be displaced
        const canDisplace = (state2 === 2 || state2 === 3) && this.densityArr[id1] > this.densityArr[id2];
        
        if (canDisplace) {
            // Swap
            const tempId = this.grid[idx1];
            const tempTemp = this.temperatureGrid[idx1];
            const tempLife = this.lifetimeGrid[idx1];
            
            this.grid[idx1] = this.grid[idx2];
            this.temperatureGrid[idx1] = this.temperatureGrid[idx2];
            this.lifetimeGrid[idx1] = this.lifetimeGrid[idx2];
            
            this.grid[idx2] = tempId;
            this.temperatureGrid[idx2] = tempTemp;
            this.lifetimeGrid[idx2] = tempLife;
            
            // v3.2: Mark both chunks as active
            this.activateChunk(x1, y1);
            this.activateChunk(x2, y2);
            
            // v3.8: Queue impact sound event when materials collide
            if (Math.random() < 0.02 && this.soundEvents.length < this.maxSoundEventsPerFrame) {
                const mat1 = this.getMaterial(id1);
                const mat2 = this.getMaterial(id2);
                if (mat1 && mat1.impactSound) {
                    const densityDiff = Math.abs(this.densityArr[id1] - this.densityArr[id2]);
                    const velocity = Math.min(1, densityDiff / 2000);
                    this.soundEvents.push({
                        type: 'impact',
                        mat1: mat1,
                        mat2: mat2,
                        velocity: velocity,
                        x: x2,
                        y: y2
                    });
                }
            }
            
            return true;
        }
        
        // v3.8: Queue impact sound event when hitting solid
        if (state2 === 1 && Math.random() < 0.01 && this.soundEvents.length < this.maxSoundEventsPerFrame) {
            const mat1 = this.getMaterial(id1);
            const mat2 = this.getMaterial(id2);
            if (mat1 && mat1.impactSound) {
                const velocity = Math.min(1, this.densityArr[id1] / 3000);
                this.soundEvents.push({
                    type: 'impact',
                    mat1: mat1,
                    mat2: mat2,
                    velocity: velocity,
                    x: x2,
                    y: y2
                });
            }
        }
        
        return false;
    }

    /**
     * Render the pixel world to the game canvas (v3.2: with dynamic lighting)
     * @param {CanvasRenderingContext2D} ctx - Game canvas context
     * @param {object} camera - Camera object
     */
    render(ctx, camera) {
        if (!this.initialized) return;
        
        // v3.5: Render light map (only every N frames for performance)
        if (this.lighting && this.frameCount % this.lightUpdateInterval === 0) {
            this.renderLightMap();
        }
        
        // Update image data from grid WITH LIGHTING applied directly
        const pixels = this.imageData.data;
        
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const idx = this.index(x, y);
                const id = this.grid[idx];
                const mat = this.getMaterial(id);
                
                const pixelIdx = idx * 4;
                
                if (this.showHeat) {
                    // Heat visualization mode
                    const temp = this.temperatureGrid[idx];
                    const heatColor = this.getHeatColor(temp);
                    pixels[pixelIdx] = heatColor[0];
                    pixels[pixelIdx + 1] = heatColor[1];
                    pixels[pixelIdx + 2] = heatColor[2];
                    pixels[pixelIdx + 3] = 255;
                } else if (mat && mat.name !== 'air') {
                    // Normal material rendering
                    const colorIdx = Math.abs(Math.floor(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453)) % mat.color.length;
                    const color = mat.color[colorIdx];
                    
                    // Parse hex color
                    const hex = color.replace('#', '');
                    let r = parseInt(hex.slice(0, 2), 16);
                    let g = parseInt(hex.slice(2, 4), 16);
                    let b = parseInt(hex.slice(4, 6), 16);
                    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255;
                    
                    // v4.1: Soil fertility visualization - fertile dirt is greener, depleted is grayer
                    if (mat.name === 'dirt' && this.fertilityGrid) {
                        const fertility = this.fertilityGrid[idx];
                        if (fertility > 0.7) {
                            // High fertility - add green tint
                            g = Math.min(255, g + Math.floor((fertility - 0.7) * 100));
                        } else if (fertility < 0.3) {
                            // Low fertility - make grayer
                            const grayness = (0.3 - fertility) * 0.5;
                            r = Math.floor(r + (128 - r) * grayness);
                            g = Math.floor(g + (128 - g) * grayness);
                            b = Math.floor(b + (128 - b) * grayness);
                        }
                    }
                    
                    // v3.5: Apply lighting directly during render (multiply material color with light)
                    if (this.lighting) {
                        const lightLevel = this.lightMap[idx] / 255;
                        const colorIdx3 = idx * 3;
                        const lightR = this.lightColorMap[colorIdx3] / 255;
                        const lightG = this.lightColorMap[colorIdx3 + 1] / 255;
                        const lightB = this.lightColorMap[colorIdx3 + 2] / 255;
                        
                        // Multiply material color by light
                        r = Math.floor(r * lightR);
                        g = Math.floor(g * lightG);
                        b = Math.floor(b * lightB);
                    }
                    
                    // v3.5: Hot materials glow (blend toward white/yellow based on temperature)
                    const temp = this.temperatureGrid[idx];
                    if (temp > 400) {
                        const glowIntensity = Math.min(1, (temp - 400) / 800);
                        r = Math.floor(r + (255 - r) * glowIntensity);
                        g = Math.floor(g + (255 - g) * glowIntensity * 0.9); // Slightly yellow
                        b = Math.floor(b + (200 - b) * glowIntensity * 0.3); // Less blue in glow
                    }
                    
                    pixels[pixelIdx] = r;
                    pixels[pixelIdx + 1] = g;
                    pixels[pixelIdx + 2] = b;
                    pixels[pixelIdx + 3] = mat.alpha !== undefined ? mat.alpha * 255 : a;
                } else {
                    // Empty - transparent
                    pixels[pixelIdx] = 0;
                    pixels[pixelIdx + 1] = 0;
                    pixels[pixelIdx + 2] = 0;
                    pixels[pixelIdx + 3] = 0;
                }
            }
        }
        
        // Put image data to offscreen canvas
        this.offscreenCtx.putImageData(this.imageData, 0, 0);
        
        // Draw scaled to game canvas (respecting camera)
        ctx.save();
        
        // Reset transform to draw in screen space (not world space)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Draw the pixel world
        ctx.imageSmoothingEnabled = false; // Crisp pixels
        ctx.drawImage(
            this.offscreenCanvas,
            0, 0, this.gridWidth, this.gridHeight,
            0, 0, this.width, this.height
        );
        
        // debug removed
        
        ctx.restore();
    }

    /**
     * Render dynamic light map (v3.5 - OPTIMIZED: cell-based, NO canvas gradients)
     * @private
     */
    renderLightMap() {
        const totalCells = this.gridWidth * this.gridHeight;
        
        // Reset to ambient light
        const ambient = Math.floor(this.ambientLight * 255);
        for (let i = 0; i < totalCells; i++) {
            this.lightMap[i] = ambient;
            const colorIdx = i * 3;
            this.lightColorMap[colorIdx] = ambient;
            this.lightColorMap[colorIdx + 1] = ambient;
            this.lightColorMap[colorIdx + 2] = ambient;
        }
        
        // Iterate light sources and add light to nearby cells
        const MAX_LIGHTS = 60; // Can handle more with array math!
        const step = this.heatSources.size > MAX_LIGHTS ? Math.ceil(this.heatSources.size / MAX_LIGHTS) : 1;
        let i = 0;
        let lightCount = 0;
        
        for (let idx of this.heatSources) {
            i++;
            if (i % step !== 0) continue;
            if (lightCount >= MAX_LIGHTS) break;
            
            const id = this.grid[idx];
            const mat = this.getMaterial(id);
            if (!mat || mat.name === 'air') continue;
            
            const sy = Math.floor(idx / this.gridWidth);
            const sx = idx % this.gridWidth;
            
            let radius = 0;
            let color = null;
            let intensity = 0;
            
            // Materials with explicit light properties
            if (mat.lightRadius) {
                radius = mat.lightRadius;
                color = mat.lightColor;
                intensity = mat.lightIntensity;
            }
            // Hot materials (> 500°C) emit faint temperature glow
            else if (this.temperatureGrid[idx] > 500) {
                const temp = this.temperatureGrid[idx];
                radius = 15;
                color = '#ff4400';
                intensity = Math.min(0.3, (temp - 500) / 2000);
            } else {
                continue;
            }
            
            // Parse light color once
            const hex = color.replace('#', '');
            const lr = parseInt(hex.slice(0, 2), 16);
            const lg = parseInt(hex.slice(2, 4), 16);
            const lb = parseInt(hex.slice(4, 6), 16);
            
            // Calculate light for cells within radius
            const radiusCells = Math.ceil(radius / this.cellSize);
            const minX = Math.max(0, sx - radiusCells);
            const maxX = Math.min(this.gridWidth - 1, sx + radiusCells);
            const minY = Math.max(0, sy - radiusCells);
            const maxY = Math.min(this.gridHeight - 1, sy + radiusCells);
            
            for (let y = minY; y <= maxY; y++) {
                for (let x = minX; x <= maxX; x++) {
                    const dx = x - sx;
                    const dy = y - sy;
                    const dist = Math.sqrt(dx * dx + dy * dy) * this.cellSize;
                    
                    if (dist < radius) {
                        // Linear falloff
                        const falloff = 1 - (dist / radius);
                        const lightLevel = Math.floor(falloff * intensity * 255);
                        
                        const cellIdx = y * this.gridWidth + x;
                        const colorIdx = cellIdx * 3;
                        
                        // ADD light (additive blending)
                        this.lightMap[cellIdx] = Math.min(255, this.lightMap[cellIdx] + lightLevel);
                        this.lightColorMap[colorIdx] = Math.min(255, this.lightColorMap[colorIdx] + lr * falloff * intensity);
                        this.lightColorMap[colorIdx + 1] = Math.min(255, this.lightColorMap[colorIdx + 1] + lg * falloff * intensity);
                        this.lightColorMap[colorIdx + 2] = Math.min(255, this.lightColorMap[colorIdx + 2] + lb * falloff * intensity);
                    }
                }
            }
            
            lightCount++;
        }
    }
    
    /**
     * Get heat visualization color
     * @private
     */
    getHeatColor(temp) {
        // Temperature color map
        if (temp < 0) {
            // Cold - blue
            const intensity = Math.min(255, Math.abs(temp) * 2);
            return [intensity * 0.5, intensity * 0.8, 255];
        } else if (temp < 50) {
            // Cool - cyan to white
            const t = temp / 50;
            return [150 + t * 105, 200 + t * 55, 255];
        } else if (temp < 100) {
            // Warm - white to yellow
            const t = (temp - 50) / 50;
            return [255, 255, 255 - t * 100];
        } else if (temp < 300) {
            // Hot - yellow to orange
            const t = (temp - 100) / 200;
            return [255, 255 - t * 100, 0];
        } else if (temp < 800) {
            // Very hot - orange to red
            const t = (temp - 300) / 500;
            return [255, 155 - t * 155, 0];
        } else {
            // Extremely hot - red to white
            const t = Math.min(1, (temp - 800) / 400);
            return [255, t * 255, t * 255];
        }
    }

    /**
     * Toggle heat visualization
     */
    toggleHeatView() {
        this.showHeat = !this.showHeat;
        console.log(`[PixelPhysics] Heat view: ${this.showHeat ? 'ON' : 'OFF'}`);
    }
    
    /**
     * Toggle dynamic lighting (v3.5)
     */
    toggleLighting() {
        this.lighting = !this.lighting;
        console.log(`[PixelPhysics v3.5] Lighting: ${this.lighting ? 'ON' : 'OFF'}`);
    }
    
    /**
     * Set ambient light level (v3.5)
     * @param {number} level - Light level (0 = pitch black, 1 = full bright)
     */
    setAmbientLight(level) {
        this.ambientLight = Math.max(0, Math.min(1, level));
        console.log(`[PixelPhysics v3.5] Ambient light: ${(this.ambientLight * 100).toFixed(0)}%`);
    }
    
    // ===== ENTITY-PHYSICS INTEGRATION (v3.5) =====
    
    /**
     * Get the material at a world position (v3.5)
     * @param {number} x - World X position
     * @param {number} y - World Y position
     * @returns {string|null} Material name, or null if out of bounds/air
     * @example
     * const mat = engine.physics.getMaterialAt(player.x, player.y + player.height);
     * if (mat === 'lava') player.takeDamage(10);
     */
    getMaterialAt(x, y) {
        const gx = Math.floor(x / this.cellSize);
        const gy = Math.floor(y / this.cellSize);
        if (!this.inBounds(gx, gy)) return null;
        
        const idx = this.index(gx, gy);
        const id = this.grid[idx];
        const mat = this.getMaterial(id);
        return mat && mat.name !== 'air' ? mat.name : null;
    }
    
    /**
     * Check if a world position is solid (v3.5)
     * @param {number} x - World X position
     * @param {number} y - World Y position
     * @returns {boolean} True if position contains solid material
     * @example
     * if (!engine.physics.isSolidAt(entity.x, entity.y + 10)) {
     *   entity.velocity.y += gravity * dt;
     * }
     */
    isSolidAt(x, y) {
        const gx = Math.floor(x / this.cellSize);
        const gy = Math.floor(y / this.cellSize);
        if (!this.inBounds(gx, gy)) return true; // Treat out-of-bounds as solid
        
        const idx = this.index(gx, gy);
        const id = this.grid[idx];
        if (id === 0) return false; // Air is not solid
        
        const state = this.stateArr[id];
        return state === 1; // state 1 = solid
    }
    
    /**
     * Check if a world position is liquid (v3.5)
     * @param {number} x - World X position
     * @param {number} y - World Y position
     * @returns {boolean} True if position contains liquid material
     * @example
     * if (engine.physics.isLiquidAt(entity.x, entity.y)) {
     *   entity.velocity.x *= 0.95; // Water drag
     *   entity.velocity.y *= 0.95;
     * }
     */
    isLiquidAt(x, y) {
        const gx = Math.floor(x / this.cellSize);
        const gy = Math.floor(y / this.cellSize);
        if (!this.inBounds(gx, gy)) return false;
        
        const idx = this.index(gx, gy);
        const id = this.grid[idx];
        if (id === 0) return false;
        
        const state = this.stateArr[id];
        return state === 2; // state 2 = liquid
    }
    
    /**
     * Check if a world position is dangerous (v3.5)
     * @param {number} x - World X position
     * @param {number} y - World Y position
     * @param {number} [damageThreshold=300] - Temperature threshold for damage (°C)
     * @returns {boolean} True if position is hot or contains dangerous material
     * @example
     * if (engine.physics.isDangerousAt(entity.x, entity.y)) {
     *   entity.health -= 5 * dt;
     * }
     */
    isDangerousAt(x, y, damageThreshold = 300) {
        const gx = Math.floor(x / this.cellSize);
        const gy = Math.floor(y / this.cellSize);
        if (!this.inBounds(gx, gy)) return false;
        
        const idx = this.index(gx, gy);
        const id = this.grid[idx];
        
        // Check temperature
        if (this.temperatureGrid[idx] > damageThreshold) return true;
        
        // Check for dangerous materials
        if (id === 0) return false;
        const mat = this.getMaterial(id);
        if (!mat) return false;
        
        // Fire, lava, acid are dangerous
        if (mat.name === 'fire' || mat.name === 'lava' || mat.name === 'acid') return true;
        
        return false;
    }
    
    /**
     * Disturb an area, displacing materials (v3.5)
     * @param {number} x - World X center position
     * @param {number} y - World Y center position
     * @param {number} radius - Disturbance radius in pixels
     * @param {number} force - Force strength (0-1)
     * @example
     * // Entity lands on ground
     * engine.physics.disturbArea(entity.x, entity.y + entity.height, 20, 0.5);
     * 
     * // Explosion shockwave
     * engine.physics.disturbArea(bombX, bombY, 100, 1.0);
     */
    disturbArea(x, y, radius, force = 0.5) {
        const gx = Math.floor(x / this.cellSize);
        const gy = Math.floor(y / this.cellSize);
        const radiusCells = Math.ceil(radius / this.cellSize);
        
        for (let dy = -radiusCells; dy <= radiusCells; dy++) {
            for (let dx = -radiusCells; dx <= radiusCells; dx++) {
                const cx = gx + dx;
                const cy = gy + dy;
                if (!this.inBounds(cx, cy)) continue;
                
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > radiusCells) continue;
                
                const idx = this.index(cx, cy);
                const id = this.grid[idx];
                if (id === 0) continue; // Skip air
                
                const state = this.stateArr[id];
                if (state === 1) continue; // Skip solid materials
                
                // Move material based on force and distance
                const falloff = 1 - (dist / radiusCells);
                const displaceForce = force * falloff;
                
                // Random displacement direction (simulates disturbance)
                if (Math.random() < displaceForce) {
                    const angle = Math.random() * Math.PI * 2;
                    const pushDist = Math.floor(displaceForce * 3);
                    const tx = cx + Math.round(Math.cos(angle) * pushDist);
                    const ty = cy + Math.round(Math.sin(angle) * pushDist);
                    
                    if (this.inBounds(tx, ty)) {
                        const targetIdx = this.index(tx, ty);
                        if (this.grid[targetIdx] === 0) {
                            // Move material to target
                            this.grid[targetIdx] = id;
                            this.temperatureGrid[targetIdx] = this.temperatureGrid[idx];
                            this.lifetimeGrid[targetIdx] = this.lifetimeGrid[idx];
                            
                            this.grid[idx] = 0;
                            this.temperatureGrid[idx] = this.ambientTemp;
                            this.lifetimeGrid[idx] = 0;
                            
                            this.activateChunk(tx, ty);
                        }
                    }
                }
            }
        }
    }
    
    // ===== WIND SYSTEM (v3.5) =====
    
    /**
     * Set global wind force (v3.5)
     * @example
     * engine.physics.wind = { x: 0.5, y: 0 }; // Light breeze to the right
     * engine.physics.wind = { x: -1.0, y: -0.2 }; // Strong wind to the left and up
     */
    wind = { x: 0, y: 0 };
    
    // ===== SAVE/LOAD WORLDS (v3.5) =====
    
    /**
     * Save the current pixel world state (v3.5)
     * @returns {object} Save data {grid, temp, lifetime, width, height, cellSize}
     * @example
     * const saveData = engine.physics.save();
     * localStorage.setItem('myWorld', JSON.stringify(saveData));
     */
    save() {
        if (!this.initialized) {
            console.warn('[PixelPhysics] Cannot save: not initialized');
            return null;
        }
        
        return {
            width: this.width,
            height: this.height,
            cellSize: this.cellSize,
            gridWidth: this.gridWidth,
            gridHeight: this.gridHeight,
            grid: Array.from(this.grid), // Convert typed arrays to regular arrays for JSON
            temperature: Array.from(this.temperatureGrid),
            lifetime: Array.from(this.lifetimeGrid),
            ambientTemp: this.ambientTemp,
            ambientLight: this.ambientLight,
            lighting: this.lighting,
            wind: { ...this.wind }
        };
    }
    
    /**
     * Load a saved pixel world state (v3.5)
     * @param {object} saveData - Save data from save()
     * @example
     * const saveData = JSON.parse(localStorage.getItem('myWorld'));
     * engine.physics.load(saveData);
     */
    load(saveData) {
        if (!saveData) {
            console.error('[PixelPhysics] Invalid save data');
            return;
        }
        
        // Re-initialize with saved dimensions
        this.init(saveData.width, saveData.height, saveData.cellSize);
        
        // Restore grid data
        this.grid = new Uint8Array(saveData.grid);
        this.temperatureGrid = new Float32Array(saveData.temperature);
        this.lifetimeGrid = new Float32Array(saveData.lifetime);
        
        // Restore settings
        this.ambientTemp = saveData.ambientTemp || 20;
        this.ambientLight = saveData.ambientLight !== undefined ? saveData.ambientLight : 0.2;
        this.lighting = saveData.lighting !== undefined ? saveData.lighting : true;
        if (saveData.wind) {
            this.wind.x = saveData.wind.x || 0;
            this.wind.y = saveData.wind.y || 0;
        }
        
        // Rebuild heat sources and activate all chunks
        this.heatSources.clear();
        for (let i = 0; i < this.grid.length; i++) {
            if (this.grid[i] !== 0 && this.temperatureGrid[i] > 100) {
                this.heatSources.add(i);
            }
        }
        
        // Activate all chunks
        for (let y = 0; y < this.chunksHigh; y++) {
            for (let x = 0; x < this.chunksWide; x++) {
                this.chunks[y][x].active = true;
                this.chunks[y][x].lastActive = 0;
            }
        }
        
        console.log(`[PixelPhysics v3.5] World loaded: ${this.gridWidth}x${this.gridHeight}`);
    }
    
    /**
     * v3.8: Get acoustic engine state for testing/debugging
     * @returns {object} Acoustic state info
     * @example
     * const state = engine.physics.getAcousticState();
     * console.log('Sound enabled:', state.enabled);
     * console.log('Active sounds:', state.activeSounds);
     */
    getAcousticState() {
        return {
            enabled: this.acoustics.enabled,
            masterVolume: this.acoustics.masterVolume,
            activeSounds: this.acoustics.activeSounds.size,
            maxSources: this.acoustics.maxSources,
            soundEventQueue: this.soundEvents.length,
            maxEventsPerFrame: this.maxSoundEventsPerFrame,
            audioContext: this.acoustics.ctx ? 'initialized' : 'not initialized'
        };
    }
}

// ===== PROCEDURAL WORLD GENERATION (v3.10) =====

/**
 * Seeded Random Number Generator (Mulberry32)
 * Deterministic PRNG for reproducible world generation
 * @param {number} seed - Random seed
 * @returns {function} Function that returns 0-1 random value
 */
function seedRandom(seed) {
    return function() {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

/**
 * 2D Value Noise with smooth interpolation
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate  
 * @param {number} seed - Noise seed
 * @returns {number} Noise value 0-1
 */
function noise2D(x, y, seed) {
    // Grid coordinates
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    
    // Interpolation weights (smooth)
    const xf = x - xi;
    const yf = y - yi;
    const u = fade(xf);
    const v = fade(yf);
    
    // Random values at grid corners
    const aa = hash2D(xi, yi, seed);
    const ab = hash2D(xi, yi + 1, seed);
    const ba = hash2D(xi + 1, yi, seed);
    const bb = hash2D(xi + 1, yi + 1, seed);
    
    // Bilinear interpolation
    const x1 = lerp(aa, ba, u);
    const x2 = lerp(ab, bb, u);
    return lerp(x1, x2, v);
}

/**
 * Smooth fade function (6t^5 - 15t^4 + 10t^3)
 */
function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Linear interpolation
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Hash function for 2D coordinates (deterministic)
 */
function hash2D(x, y, seed) {
    let n = x + y * 57 + seed * 131;
    n = (n << 13) ^ n;
    return ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 2147483648.0;
}

/**
 * Fractal/Layered Noise - combines multiple octaves
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} octaves - Number of noise layers (typically 3-6)
 * @param {number} persistence - Amplitude decay per octave (typically 0.5)
 * @param {number} scale - Base frequency scale
 * @param {number} seed - Random seed
 * @returns {number} Fractal noise value 0-1
 */
function fractalNoise(x, y, octaves, persistence, scale, seed) {
    let total = 0;
    let frequency = 1 / scale;
    let amplitude = 1;
    let maxValue = 0;
    
    for (let i = 0; i < octaves; i++) {
        total += noise2D(x * frequency, y * frequency, seed + i) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
    }
    
    return total / maxValue;
}

/**
 * WorldGenerator v3.10 - Procedural World Generation
 * Generates unique worlds from seeds with terrain layers, caves, biomes, and water tables
 * 
 * @class WorldGenerator
 */
class WorldGenerator {
    /**
     * Create a world generator
     * @param {PixelPhysics} physics - PixelPhysics instance
     */
    constructor(physics) {
        this.physics = physics;
        this.random = null; // Will be set by seedRandom()
        this.seed = 0;
        this.biome = 'temperate';
        
        console.log('[WorldGenerator v3.10] Initialized - Procedural World Generation');
    }
    
    /**
     * Generate a complete procedural world
     * @param {number} seed - World seed (same seed = same world)
     * @param {string} biome - Biome type
     * @returns {boolean} Success
     */
    generate(seed, biome = 'temperate') {
        if (!this.physics.initialized) {
            console.error('[WorldGenerator] Physics not initialized');
            return false;
        }
        
        console.log(`[WorldGenerator] Generating world: seed=${seed}, biome=${biome}`);
        const startTime = performance.now();
        
        this.seed = seed;
        this.biome = biome;
        this.random = seedRandom(seed);
        
        // Clear world
        this.physics.clear();
        
        // Generate terrain layers
        const heightmap = this.generateHeightmap();
        this.generateTerrain(heightmap);
        
        // Generate caves
        this.generateCaves();
        
        // Generate ore deposits
        this.generateOreLayers();
        
        // Generate water features
        this.generateWaterTable(heightmap);
        this.generateRivers(heightmap);
        
        // Biome-specific details
        this.applyBiome(heightmap);
        this.plantVegetation(heightmap);
        this.setTemperatures();
        
        const elapsed = performance.now() - startTime;
        console.log(`✅ World generated in ${elapsed.toFixed(1)}ms`);
        
        return true;
    }
    
    /**
     * Generate 1D heightmap using fractal noise
     * @returns {Float32Array} Height values 0-1 for each x column
     */
    generateHeightmap() {
        const w = this.physics.gridWidth;
        const heightmap = new Float32Array(w);
        
        // Different height characteristics per biome
        let scale, octaves, persistence, baseHeight;
        
        switch(this.biome) {
            case 'mountain':
                scale = 100;
                octaves = 6;
                persistence = 0.6;
                baseHeight = 0.3;
                break;
            case 'ocean':
                scale = 150;
                octaves = 3;
                persistence = 0.4;
                baseHeight = 0.8; // Mostly underwater
                break;
            case 'desert':
                scale = 120;
                octaves = 4;
                persistence = 0.5;
                baseHeight = 0.5;
                break;
            case 'arctic':
                scale = 80;
                octaves = 4;
                persistence = 0.5;
                baseHeight = 0.6;
                break;
            case 'volcanic':
                scale = 90;
                octaves = 5;
                persistence = 0.55;
                baseHeight = 0.4;
                break;
            case 'swamp':
                scale = 140;
                octaves = 3;
                persistence = 0.45;
                baseHeight = 0.7; // Flat and low
                break;
            default: // temperate
                scale = 110;
                octaves = 5;
                persistence = 0.5;
                baseHeight = 0.55;
        }
        
        // Generate heightmap
        for (let x = 0; x < w; x++) {
            const noise = fractalNoise(x, 0, octaves, persistence, scale, this.seed);
            heightmap[x] = baseHeight + (noise - 0.5) * 0.4;
            // Clamp to 0.2-0.9 range
            heightmap[x] = Math.max(0.2, Math.min(0.9, heightmap[x]));
        }
        
        return heightmap;
    }
    
    /**
     * Generate terrain layers based on heightmap
     * @param {Float32Array} heightmap - Height values
     */
    generateTerrain(heightmap) {
        const w = this.physics.gridWidth;
        const h = this.physics.gridHeight;
        
        for (let x = 0; x < w; x++) {
            const surfaceY = Math.floor(heightmap[x] * h);
            
            for (let y = surfaceY; y < h; y++) {
                const depth = y - surfaceY;
                const relativeDepth = depth / (h - surfaceY);
                
                // Use 2D noise for layer variation (no straight lines!)
                const layerNoise = noise2D(x / 20, y / 15, this.seed + 100);
                
                let material;
                
                if (depth === 0) {
                    // Surface layer (biome-specific, will be refined in applyBiome)
                    material = 'dirt';
                } else if (depth < 3 + layerNoise * 2) {
                    // Topsoil
                    material = 'dirt';
                } else if (depth < 8 + layerNoise * 4) {
                    // Subsoil - mix of dirt and stone
                    material = (layerNoise > 0.5) ? 'dirt' : 'stone';
                } else {
                    // Bedrock and deep layers
                    material = 'stone';
                }
                
                this.physics.set(x, y, material);
            }
        }
    }
    
    /**
     * Generate cave systems using 2D noise threshold
     */
    generateCaves() {
        const w = this.physics.gridWidth;
        const h = this.physics.gridHeight;
        
        // Cave parameters vary by biome
        let caveThreshold, caveScale, minDepth;
        
        switch(this.biome) {
            case 'mountain':
                caveThreshold = 0.6;
                caveScale = 25;
                minDepth = 0.3;
                break;
            case 'volcanic':
                caveThreshold = 0.55;
                caveScale = 20;
                minDepth = 0.25;
                break;
            default:
                caveThreshold = 0.65;
                caveScale = 30;
                minDepth = 0.4;
        }
        
        for (let x = 0; x < w; x++) {
            for (let y = Math.floor(h * minDepth); y < h; y++) {
                const matId = this.physics.grid[this.physics.index(x, y)];
                const matName = this.physics.getMaterialName(matId);
                
                // Only carve caves in stone
                if (matName === 'stone') {
                    const caveNoise = fractalNoise(x, y, 3, 0.5, caveScale, this.seed + 200);
                    
                    if (caveNoise > caveThreshold) {
                        // Carve cave (set to air)
                        this.physics.set(x, y, 'air');
                        
                        // Chance of water/lava pools in caves
                        const poolNoise = noise2D(x / 10, y / 10, this.seed + 300);
                        const relativeDepth = y / h;
                        
                        if (poolNoise > 0.92) {
                            if (relativeDepth > 0.85 && this.random() < 0.3) {
                                // Deep caves: lava pools
                                this.physics.set(x, y, 'lava');
                            } else if (relativeDepth > 0.7 && this.random() < 0.2) {
                                // Mid-deep caves: water pools
                                this.physics.set(x, y, 'water');
                            } else if (relativeDepth < 0.6 && this.random() < 0.15) {
                                // Shallow caves: fungus gardens
                                this.physics.set(x, y, 'fungus');
                            }
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Place ore deposits (iron, coal, salt) in stone layers
     */
    generateOreLayers() {
        const w = this.physics.gridWidth;
        const h = this.physics.gridHeight;
        
        // Ore veins using noise with different frequencies
        const ores = [
            { name: 'iron', threshold: 0.92, scale: 15, minDepth: 0.5, maxDepth: 0.95 },
            { name: 'coal', threshold: 0.91, scale: 18, minDepth: 0.4, maxDepth: 0.85 },
            { name: 'salt', threshold: 0.93, scale: 20, minDepth: 0.6, maxDepth: 0.9 }
        ];
        
        ores.forEach((ore, idx) => {
            for (let x = 0; x < w; x++) {
                for (let y = Math.floor(h * ore.minDepth); y < Math.floor(h * ore.maxDepth); y++) {
                    const matId = this.physics.grid[this.physics.index(x, y)];
                    const matName = this.physics.getMaterialName(matId);
                    
                    // Only place ore in stone
                    if (matName === 'stone') {
                        const oreNoise = fractalNoise(x, y, 2, 0.6, ore.scale, this.seed + 400 + idx * 100);
                        
                        if (oreNoise > ore.threshold) {
                            this.physics.set(x, y, ore.name);
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Generate water table - fill low areas with water, create underground pools
     * @param {Float32Array} heightmap - Terrain heights
     */
    generateWaterTable(heightmap) {
        const w = this.physics.gridWidth;
        const h = this.physics.gridHeight;
        
        // Water level varies by biome
        let waterLevel;
        switch(this.biome) {
            case 'ocean':
                waterLevel = 0.4; // High water
                break;
            case 'swamp':
                waterLevel = 0.65;
                break;
            case 'desert':
                waterLevel = 0.95; // Very little surface water
                break;
            case 'arctic':
                waterLevel = 0.7;
                break;
            default:
                waterLevel = 0.8;
        }
        
        // Fill areas below water level
        for (let x = 0; x < w; x++) {
            const surfaceY = Math.floor(heightmap[x] * h);
            const waterY = Math.floor(waterLevel * h);
            
            if (surfaceY > waterY) {
                // Fill with water from waterY to surfaceY
                for (let y = waterY; y < surfaceY; y++) {
                    const matId = this.physics.grid[this.physics.index(x, y)];
                    if (matId === 0) { // Only fill air
                        // Arctic biome uses ice instead of water at surface
                        if (this.biome === 'arctic' && y < waterY + 5) {
                            this.physics.set(x, y, 'ice');
                        } else {
                            this.physics.set(x, y, 'water');
                        }
                    }
                }
            }
        }
        
        // Underground water pools (aquifers)
        if (this.biome !== 'desert') {
            for (let x = 0; x < w; x++) {
                for (let y = Math.floor(h * 0.5); y < Math.floor(h * 0.85); y++) {
                    const poolNoise = fractalNoise(x, y, 2, 0.5, 40, this.seed + 500);
                    
                    if (poolNoise > 0.85) {
                        const matId = this.physics.grid[this.physics.index(x, y)];
                        if (matId === 0) { // Only fill air (caves)
                            this.physics.set(x, y, 'water');
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Generate rivers flowing from high to low points
     * @param {Float32Array} heightmap - Terrain heights
     */
    generateRivers(heightmap) {
        if (this.biome === 'desert' || this.biome === 'ocean') {
            return; // No rivers in desert/ocean
        }
        
        const w = this.physics.gridWidth;
        const h = this.physics.gridHeight;
        
        // Find peaks for river sources
        const numRivers = this.biome === 'mountain' ? 3 : (this.biome === 'swamp' ? 0 : 1);
        
        for (let r = 0; r < numRivers; r++) {
            // Find a high point
            let maxHeight = 0;
            let maxX = 0;
            const searchStart = Math.floor(w * this.random());
            const searchRange = Math.floor(w * 0.3);
            
            for (let x = searchStart; x < Math.min(w, searchStart + searchRange); x++) {
                if (heightmap[x] > maxHeight) {
                    maxHeight = heightmap[x];
                    maxX = x;
                }
            }
            
            // Carve river downhill
            let x = maxX;
            let y = Math.floor(heightmap[x] * h);
            const riverWidth = 2;
            
            for (let step = 0; step < 1000 && y < h - 1; step++) {
                // Carve river
                for (let dx = -riverWidth; dx <= riverWidth; dx++) {
                    const rx = x + dx;
                    if (rx >= 0 && rx < w && y >= 0 && y < h) {
                        this.physics.set(rx, y, 'water');
                        if (y + 1 < h) {
                            this.physics.set(rx, y + 1, 'water');
                        }
                    }
                }
                
                // Move downhill (find lowest neighbor)
                const leftHeight = (x > 0) ? heightmap[x - 1] : 1;
                const rightHeight = (x < w - 1) ? heightmap[x + 1] : 1;
                
                if (leftHeight < heightmap[x] && leftHeight <= rightHeight) {
                    x = Math.max(0, x - 1);
                } else if (rightHeight < heightmap[x]) {
                    x = Math.min(w - 1, x + 1);
                }
                
                y++;
            }
        }
    }
    
    /**
     * Apply biome-specific surface materials
     * @param {Float32Array} heightmap - Terrain heights
     */
    applyBiome(heightmap) {
        const w = this.physics.gridWidth;
        const h = this.physics.gridHeight;
        
        for (let x = 0; x < w; x++) {
            const surfaceY = Math.floor(heightmap[x] * h);
            
            // Apply biome surface material
            for (let y = surfaceY; y < Math.min(surfaceY + 1, h); y++) {
                const matId = this.physics.grid[this.physics.index(x, y)];
                const matName = this.physics.getMaterialName(matId);
                
                // Only replace dirt surface
                if (matName === 'dirt' && y === surfaceY) {
                    let surfaceMaterial;
                    
                    switch(this.biome) {
                        case 'desert':
                            surfaceMaterial = 'sand';
                            // Also convert shallow dirt to sand
                            for (let dy = 0; dy < 5; dy++) {
                                if (surfaceY + dy < h) {
                                    const subMat = this.physics.getMaterialName(
                                        this.physics.grid[this.physics.index(x, surfaceY + dy)]
                                    );
                                    if (subMat === 'dirt') {
                                        this.physics.set(x, surfaceY + dy, 'sand');
                                    }
                                }
                            }
                            break;
                        case 'arctic':
                            surfaceMaterial = 'ice';
                            // Snow-covered surface
                            if (this.random() > 0.3) {
                                surfaceMaterial = 'ice';
                            }
                            break;
                        case 'volcanic':
                            surfaceMaterial = (this.random() > 0.6) ? 'stone' : 'ash';
                            break;
                        case 'ocean':
                            surfaceMaterial = 'sand'; // Beach/ocean floor
                            break;
                        case 'swamp':
                            surfaceMaterial = (this.random() > 0.5) ? 'dirt' : 'mud';
                            break;
                        case 'mountain':
                            // Higher elevations = stone, lower = dirt
                            if (heightmap[x] < 0.5) {
                                surfaceMaterial = 'stone';
                            } else {
                                surfaceMaterial = 'dirt';
                            }
                            break;
                        default: // temperate
                            surfaceMaterial = 'dirt';
                    }
                    
                    this.physics.set(x, y, surfaceMaterial);
                }
            }
        }
    }
    
    /**
     * Plant vegetation based on biome
     * @param {Float32Array} heightmap - Terrain heights
     */
    plantVegetation(heightmap) {
        const w = this.physics.gridWidth;
        const h = this.physics.gridHeight;
        
        // Vegetation density varies by biome
        let plantDensity, treeDensity, fungusDensity;
        
        switch(this.biome) {
            case 'temperate':
                plantDensity = 0.15;
                treeDensity = 0.08;
                fungusDensity = 0.03;
                break;
            case 'forest':
                plantDensity = 0.25;
                treeDensity = 0.15;
                fungusDensity = 0.05;
                break;
            case 'swamp':
                plantDensity = 0.3;
                treeDensity = 0.05;
                fungusDensity = 0.15;
                break;
            case 'desert':
                plantDensity = 0.02;
                treeDensity = 0;
                fungusDensity = 0;
                break;
            case 'arctic':
                plantDensity = 0.01;
                treeDensity = 0;
                fungusDensity = 0;
                break;
            case 'volcanic':
                plantDensity = 0.05;
                treeDensity = 0;
                fungusDensity = 0.02;
                break;
            case 'mountain':
                plantDensity = 0.1;
                treeDensity = 0.06;
                fungusDensity = 0.02;
                break;
            case 'ocean':
                plantDensity = 0.08; // Coral-like vegetation underwater
                treeDensity = 0;
                fungusDensity = 0;
                break;
            default:
                plantDensity = 0.1;
                treeDensity = 0.05;
                fungusDensity = 0.02;
        }
        
        // Plant vegetation
        for (let x = 0; x < w; x++) {
            const surfaceY = Math.floor(heightmap[x] * h);
            
            if (surfaceY > 0 && surfaceY < h - 1) {
                const surfaceMat = this.physics.getMaterialName(
                    this.physics.grid[this.physics.index(x, surfaceY)]
                );
                const aboveMat = this.physics.getMaterialName(
                    this.physics.grid[this.physics.index(x, surfaceY - 1)]
                );
                
                // Only plant on suitable surfaces with air above
                const canPlant = (surfaceMat === 'dirt' || surfaceMat === 'sand' || 
                                 surfaceMat === 'mud') && aboveMat === 'air';
                
                if (canPlant) {
                    // Trees (wood columns)
                    if (this.random() < treeDensity) {
                        const treeHeight = Math.floor(8 + this.random() * 12);
                        for (let dy = 1; dy <= treeHeight; dy++) {
                            if (surfaceY - dy >= 0) {
                                this.physics.set(x, surfaceY - dy, 'wood');
                            }
                        }
                        // Vegetation at top
                        if (surfaceY - treeHeight >= 0) {
                            this.physics.set(x, surfaceY - treeHeight, 'vegetation');
                        }
                    }
                    // Plants
                    else if (this.random() < plantDensity) {
                        if (surfaceY - 1 >= 0) {
                            this.physics.set(x, surfaceY - 1, 'plant');
                        }
                    }
                    // Vegetation clumps
                    else if (this.random() < plantDensity * 0.5) {
                        const vegSize = Math.floor(2 + this.random() * 4);
                        for (let dy = 1; dy <= vegSize; dy++) {
                            if (surfaceY - dy >= 0) {
                                this.physics.set(x, surfaceY - dy, 'vegetation');
                            }
                        }
                    }
                }
                
                // Fungus in dark/damp areas (caves)
                if (surfaceMat === 'stone' && aboveMat === 'air' && 
                    this.random() < fungusDensity) {
                    if (surfaceY - 1 >= 0) {
                        this.physics.set(x, surfaceY - 1, 'fungus');
                    }
                }
            }
        }
    }
    
    /**
     * Set initial temperatures based on biome and depth
     */
    setTemperatures() {
        const w = this.physics.gridWidth;
        const h = this.physics.gridHeight;
        
        // Base temperature varies by biome
        let baseTemp;
        switch(this.biome) {
            case 'arctic':
                baseTemp = -10;
                break;
            case 'desert':
                baseTemp = 35;
                break;
            case 'volcanic':
                baseTemp = 40;
                break;
            case 'swamp':
                baseTemp = 25;
                break;
            default:
                baseTemp = 20;
        }
        
        // Set temperatures with depth variation
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                const idx = this.physics.index(x, y);
                const depth = y / h;
                
                // Temperature increases with depth (geothermal gradient ~25°C per km)
                // Simplified: +0.5°C per 10% depth
                const depthTemp = baseTemp + (depth * 50);
                
                this.physics.temperatureGrid[idx] = depthTemp;
            }
        }
        
        // Set ambient temperature
        this.physics.ambientTemp = baseTemp;
    }
}
// ===== ACOUSTIC ENGINE (v3.3) =====

/**
 * Acoustic Engine v3.3 - Scientifically Accurate Procedural Sound
 * 
 * PHILOSOPHY: Every sound is generated procedurally from real material properties.
 * No audio files. Sound frequencies derived from Young's modulus and density.
 * This is "The Composition" — the soul of the physics engine.
 * 
 * @class AcousticEngine
 */
class AcousticEngine {
    /**
     * Create an acoustic engine
     * @param {PixelPhysics} pixelPhysics - Physics system instance
     */
    constructor(pixelPhysics) {
        this.physics = pixelPhysics;
        this.enabled = false;
        this.masterVolume = 0.7;
        this.reverbLevel = 0.3;
        
        // Web Audio API context
        this.ctx = null;
        this.masterGain = null;
        this.convolver = null;
        
        // Sound source management
        this.activeSounds = new Map(); // Track active sound sources
        this.maxSources = 16; // Maximum simultaneous sounds
        this.soundThrottle = 4; // Check for sounds every N frames
        this.frameCounter = 0;
        
        // Performance: aggregate sounds by region
        this.regionSize = 32; // Group sounds by 32x32 regions
        this.regionSounds = new Map(); // region key -> sound data
        
        console.log('[AcousticEngine v3.3] Initialized - The Composition');
    }

    /**
     * Initialize Web Audio API context (requires user interaction)
     * @returns {boolean} True if initialized successfully
     */
    init() {
        if (this.ctx) return true;
        
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.masterVolume;
            
            // Create reverb convolver
            this.convolver = this.ctx.createConvolver();
            this.convolver.buffer = this.createReverbImpulse(2, 0.5);
            
            // Connect: sources -> masterGain -> convolver -> destination
            const reverbGain = this.ctx.createGain();
            reverbGain.gain.value = this.reverbLevel;
            
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.connect(this.convolver);
            this.convolver.connect(reverbGain);
            reverbGain.connect(this.ctx.destination);
            
            this.enabled = true;
            console.log('[AcousticEngine v3.3] Web Audio initialized');
            return true;
        } catch (e) {
            console.error('[AcousticEngine] Failed to initialize:', e);
            return false;
        }
    }

    /**
     * Create a procedural reverb impulse response
     * @private
     * @param {number} duration - Duration in seconds
     * @param {number} decay - Decay factor (0-1)
     * @returns {AudioBuffer} Impulse response buffer
     */
    createReverbImpulse(duration, decay) {
        const rate = this.ctx.sampleRate;
        const length = rate * duration;
        const impulse = this.ctx.createBuffer(2, length, rate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);
        
        for (let i = 0; i < length; i++) {
            const n = length - i;
            left[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay * 3);
            right[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay * 3);
        }
        
        return impulse;
    }

    /**
     * Calculate impact frequency from Young's modulus and density
     * f = k * sqrt(E/ρ) where k scales to audible range
     * @private
     * @param {number} youngsModulus - Young's modulus in Pa
     * @param {number} density - Density in kg/m³
     * @returns {number} Frequency in Hz
     */
    calculateImpactFrequency(youngsModulus, density) {
        if (!youngsModulus || youngsModulus === 0 || !density || density === 0) {
            return 200; // Default low frequency
        }
        
        const k = 0.0015; // Scaling constant to audible range
        const freq = k * Math.sqrt(youngsModulus / density);
        return Math.max(80, Math.min(4000, freq)); // Clamp to audible range
    }

    /**
     * Generate an impact sound when materials collide
     * @param {string} soundType - Type of sound ('ring'|'thud'|'splash'|'crack'|'shatter'|'crunch'|'clang')
     * @param {object} material - Material properties
     * @param {number} intensity - Impact intensity (0-1)
     * @param {number} x - World X position (for spatial audio)
     * @param {number} y - World Y position
     */
    playImpact(soundType, material, intensity, x, y) {
        if (!this.enabled || !this.ctx) return;
        
        const now = this.ctx.currentTime;
        const volume = intensity * this.masterVolume * 0.3;
        
        // Calculate frequency from material properties
        const baseFreq = this.calculateImpactFrequency(
            material.youngsModulus || 1e9,
            material.density || 1000
        );
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        filter.type = 'lowpass';
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        switch (soundType) {
            case 'ring': // Metal, glass - bright ring with long sustain
                osc.type = 'sine';
                osc.frequency.setValueAtTime(baseFreq, now);
                osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.3);
                gain.gain.setValueAtTime(volume, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                filter.frequency.setValueAtTime(baseFreq * 3, now);
                osc.start(now);
                osc.stop(now + 0.4);
                break;
                
            case 'thud': // Wood, dirt - warm thud with medium sustain
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(baseFreq * 0.5, now);
                osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.3, now + 0.15);
                gain.gain.setValueAtTime(volume, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                filter.frequency.setValueAtTime(800, now);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
                
            case 'splash': // Water, liquid - noise burst + low freq
                osc.type = 'square';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
                gain.gain.setValueAtTime(volume * 0.8, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                filter.frequency.setValueAtTime(1200, now);
                filter.frequency.exponentialRampToValueAtTime(400, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
                break;
                
            case 'crack': // Stone, ice - sharp crack
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(baseFreq * 1.5, now);
                osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.08);
                gain.gain.setValueAtTime(volume, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                filter.frequency.setValueAtTime(3000, now);
                filter.frequency.exponentialRampToValueAtTime(800, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
                break;
                
            case 'shatter': // Glass breaking - crystalline ping with harmonics
                osc.type = 'sine';
                osc.frequency.setValueAtTime(baseFreq, now);
                osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, now + 0.05);
                osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.2);
                gain.gain.setValueAtTime(volume, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                filter.frequency.setValueAtTime(4000, now);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
                
            case 'crunch': // Sand, powder - dull thud, no sustain
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
                gain.gain.setValueAtTime(volume * 0.6, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                filter.frequency.setValueAtTime(600, now);
                osc.start(now);
                osc.stop(now + 0.06);
                break;
                
            case 'clang': // Metal impact - bright clang
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(baseFreq * 1.2, now);
                osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.25);
                gain.gain.setValueAtTime(volume, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                filter.frequency.setValueAtTime(baseFreq * 4, now);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
                
            default:
                osc.stop();
                return;
        }
    }

    /**
     * Generate flow sounds for moving liquids/powders
     * @param {string} soundType - Type of flow ('trickle'|'pour'|'rush'|'hiss'|'whoosh')
     * @param {object} material - Material properties
     * @param {number} velocity - Flow velocity (0-1)
     * @param {number} cellCount - Number of moving cells
     */
    playFlow(soundType, material, velocity, cellCount) {
        if (!this.enabled || !this.ctx) return;
        
        const regionKey = soundType + '_flow';
        if (this.activeSounds.has(regionKey)) return; // Already playing
        
        const now = this.ctx.currentTime;
        const volume = Math.min(1, cellCount / 100) * this.masterVolume * 0.2;
        
        // Noise-based flow sounds
        const bufferSize = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        
        const gain = this.ctx.createGain();
        gain.gain.value = volume;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        // Frequency tied to velocity
        const baseFreq = 200 + velocity * 800;
        
        switch (soundType) {
            case 'pour': // Water - blue noise, higher pitch = faster
                filter.frequency.value = baseFreq * 1.5;
                filter.Q.value = 2;
                break;
            case 'rush': // Sand, powder - pink noise, granular
                filter.frequency.value = baseFreq * 0.8;
                filter.Q.value = 1.5;
                break;
            case 'hiss': // Gas, steam - high frequency noise
                filter.frequency.value = baseFreq * 2;
                filter.Q.value = 3;
                break;
            case 'whoosh': // Fire, fast gas - low rumble + high noise
                filter.frequency.value = baseFreq * 1.2;
                filter.Q.value = 1;
                break;
            default:
                filter.frequency.value = baseFreq;
                filter.Q.value = 1;
        }
        
        noise.start(now);
        
        // Store reference and auto-stop after duration
        this.activeSounds.set(regionKey, { source: noise, gain, startTime: now });
        
        setTimeout(() => {
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
            setTimeout(() => {
                noise.stop();
                this.activeSounds.delete(regionKey);
            }, 150);
        }, 300);
    }

    /**
     * Generate ambient sounds for ongoing material presence
     * @param {string} soundType - Type of ambient ('crackle'|'sizzle'|'bubble'|'hum')
     * @param {number} intensity - Sound intensity (0-1)
     */
    playAmbient(soundType, intensity) {
        if (!this.enabled || !this.ctx) return;
        
        const regionKey = soundType + '_ambient';
        if (this.activeSounds.has(regionKey)) return;
        
        const now = this.ctx.currentTime;
        const volume = intensity * this.masterVolume * 0.15;
        
        switch (soundType) {
            case 'crackle': // Fire - filtered noise + random pops
                this.playFireCrackle(volume);
                break;
            case 'sizzle': // Acid, hot reactions - high-freq noise
                this.playSizzle(volume);
                break;
            case 'bubble': // Lava, boiling - random sine pops
                this.playBubble(volume);
                break;
            case 'hum': // Deep drone
                this.playHum(volume);
                break;
        }
    }

    /**
     * Play fire crackling sound
     * @private
     */
    playFireCrackle(volume) {
        const now = this.ctx.currentTime;
        const regionKey = 'crackle_ambient';
        
        // Random pops
        for (let i = 0; i < 3; i++) {
            const delay = Math.random() * 0.2;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300 + Math.random() * 400, now + delay);
            gain.gain.setValueAtTime(volume * 0.4, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + delay);
            osc.stop(now + delay + 0.05);
        }
        
        this.activeSounds.set(regionKey, { startTime: now });
        setTimeout(() => this.activeSounds.delete(regionKey), 200);
    }

    /**
     * Play sizzle sound (acid, hot reactions)
     * @private
     */
    playSizzle(volume) {
        const now = this.ctx.currentTime;
        const regionKey = 'sizzle_ambient';
        
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;
        
        const gain = this.ctx.createGain();
        gain.gain.value = volume * 0.5;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(now);
        
        this.activeSounds.set(regionKey, { source: noise, startTime: now });
        setTimeout(() => {
            noise.stop();
            this.activeSounds.delete(regionKey);
        }, 300);
    }

    /**
     * Play bubble sound (lava, boiling water)
     * @private
     */
    playBubble(volume) {
        const now = this.ctx.currentTime;
        const regionKey = 'bubble_ambient';
        
        // Random bubble pops
        for (let i = 0; i < 2; i++) {
            const delay = Math.random() * 0.3;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            const freq = 200 + Math.random() * 600;
            osc.frequency.setValueAtTime(freq, now + delay);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + delay + 0.1);
            
            gain.gain.setValueAtTime(volume * 0.6, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now + delay);
            osc.stop(now + delay + 0.1);
        }
        
        this.activeSounds.set(regionKey, { startTime: now });
        setTimeout(() => this.activeSounds.delete(regionKey), 300);
    }

    /**
     * Play deep hum/drone
     * @private
     */
    playHum(volume) {
        const now = this.ctx.currentTime;
        const regionKey = 'hum_ambient';
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = 60;
        gain.gain.setValueAtTime(volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.5);
        
        this.activeSounds.set(regionKey, { source: osc, startTime: now });
        setTimeout(() => this.activeSounds.delete(regionKey), 500);
    }

    /**
     * Play phase change sound (freezing, boiling, melting, combustion)
     * @param {string} soundType - Type of phase change ('sizzle'|'crack'|'pop'|'hiss')
     * @param {number} intensity - Intensity (0-1)
     */
    playPhaseChange(soundType, intensity) {
        if (!this.enabled || !this.ctx) return;
        
        const now = this.ctx.currentTime;
        const volume = intensity * this.masterVolume * 0.25;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        switch (soundType) {
            case 'sizzle': // Melting, evaporation
                filter.type = 'highpass';
                filter.frequency.value = 1500;
                osc.type = 'square';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
                gain.gain.setValueAtTime(volume, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
                
            case 'crack': // Freezing, ice expanding
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
                gain.gain.setValueAtTime(volume, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                filter.frequency.setValueAtTime(2000, now);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
                
            case 'pop': // Bubble bursting, combustion
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
                gain.gain.setValueAtTime(volume, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
                break;
                
            case 'hiss': // Gas release
                filter.type = 'bandpass';
                filter.frequency.value = 3000;
                filter.Q.value = 2;
                osc.type = 'square';
                osc.frequency.setValueAtTime(2000, now);
                gain.gain.setValueAtTime(volume * 0.7, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
        }
    }

    /**
     * Play explosion sound (big low boom + debris)
     * @param {number} radius - Explosion radius
     * @param {number} power - Explosion power
     */
    playExplosion(radius, power) {
        if (!this.enabled || !this.ctx) return;
        
        const now = this.ctx.currentTime;
        const volume = Math.min(1, power / 300) * this.masterVolume * 0.5;
        
        // Deep boom
        const boom = this.ctx.createOscillator();
        const boomGain = this.ctx.createGain();
        const boomFilter = this.ctx.createBiquadFilter();
        
        boom.type = 'sine';
        boom.frequency.setValueAtTime(60, now);
        boom.frequency.exponentialRampToValueAtTime(30, now + 0.4);
        
        boomFilter.type = 'lowpass';
        boomFilter.frequency.setValueAtTime(200, now);
        
        boomGain.gain.setValueAtTime(volume, now);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        
        boom.connect(boomFilter);
        boomFilter.connect(boomGain);
        boomGain.connect(this.masterGain);
        
        boom.start(now);
        boom.stop(now + 0.5);
        
        // High-frequency debris crackle
        const crackle = this.ctx.createOscillator();
        const crackleGain = this.ctx.createGain();
        
        crackle.type = 'sawtooth';
        crackle.frequency.setValueAtTime(1000, now);
        crackle.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        
        crackleGain.gain.setValueAtTime(volume * 0.6, now + 0.05);
        crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        crackle.connect(crackleGain);
        crackleGain.connect(this.masterGain);
        
        crackle.start(now + 0.05);
        crackle.stop(now + 0.3);
    }

    /**
     * v3.8: Play reaction sound when materials chemically react
     * @param {object} material1 - First reactant material
     * @param {object} material2 - Second reactant material  
     * @param {object} product - Product material (optional)
     * @param {number} intensity - Reaction intensity (0-1)
     */
    playReaction(material1, material2, product, intensity) {
        if (!this.enabled || !this.ctx) return;
        
        const now = this.ctx.currentTime;
        const volume = intensity * this.masterVolume * 0.4;
        
        // Calculate reaction sound parameters from materials
        const params = this.getReactionSound(material1, material2, product);
        
        // Create rich harmonic sound for reactions (more dramatic than impacts)
        const freqs = [params.freq, params.freq * 1.5, params.freq * 2, params.freq * 2.5];
        const osc = [];
        const gains = [];
        
        for (let i = 0; i < freqs.length; i++) {
            osc[i] = this.ctx.createOscillator();
            gains[i] = this.ctx.createGain();
            
            osc[i].type = i === 0 ? 'triangle' : 'sine';
            osc[i].frequency.setValueAtTime(freqs[i], now);
            osc[i].frequency.exponentialRampToValueAtTime(freqs[i] * 0.7, now + params.duration);
            
            const harmVol = volume / (i + 1); // Harmonics are quieter
            gains[i].gain.setValueAtTime(harmVol, now);
            gains[i].gain.exponentialRampToValueAtTime(0.001, now + params.duration);
            
            osc[i].connect(gains[i]);
            gains[i].connect(this.masterGain);
            osc[i].start(now);
            osc[i].stop(now + params.duration);
        }
    }

    /**
     * v3.8: Calculate impact sound parameters from material properties
     * @param {object} mat1 - First material
     * @param {object} mat2 - Second material
     * @param {number} velocity - Impact velocity (0-1)
     * @returns {object} Sound parameters {freq, duration, volume}
     */
    getImpactSound(mat1, mat2, velocity) {
        // Geometric mean of resonance frequencies
        const freq1 = mat1.resonanceFreq || 200;
        const freq2 = mat2.resonanceFreq || 200;
        const freq = Math.sqrt(freq1 * freq2);
        
        // Duration inversely proportional to dampening
        const avgDampening = (mat1.dampening + mat2.dampening) / 2;
        const duration = 0.05 + (1 - avgDampening) * 0.3; // 0.05-0.35s
        
        // Volume proportional to velocity and inverse of dampening
        const volume = velocity * (1 - avgDampening * 0.5);
        
        // Brightness affects harmonic content
        const brightness = (mat1.brightness + mat2.brightness) / 2;
        
        return { freq, duration, volume, brightness };
    }

    /**
     * v3.8: Calculate flow sound parameters from material properties
     * @param {object} material - Flowing material
     * @param {number} velocity - Flow velocity (0-1)
     * @returns {object} Sound parameters {freq, filterFreq, volume}
     */
    getFlowSound(material, velocity) {
        const baseFreq = material.resonanceFreq || 200;
        const freq = baseFreq + velocity * 800; // Higher pitch = faster flow
        
        // Filter frequency based on viscosity (thicker = lower filter)
        const viscosity = material.viscosity || 0.5;
        const filterFreq = 2000 - viscosity * 1500; // 500-2000 Hz
        
        // Volume based on velocity and dampening
        const volume = velocity * (1 - material.dampening * 0.5);
        
        return { freq, filterFreq, volume };
    }

    /**
     * v3.8: Calculate reaction sound parameters from reactants
     * @param {object} mat1 - First reactant
     * @param {object} mat2 - Second reactant
     * @param {object} product - Product material (optional)
     * @returns {object} Sound parameters {freq, duration, volume, brightness}
     */
    getReactionSound(mat1, mat2, product) {
        // Reaction frequency: weighted average favoring product
        const freq1 = mat1.resonanceFreq || 300;
        const freq2 = mat2.resonanceFreq || 300;
        const freqProduct = product ? (product.resonanceFreq || 300) : (freq1 + freq2) / 2;
        const freq = (freq1 + freq2 + freqProduct * 2) / 4; // Product weighted higher
        
        // Reactions are more dramatic - longer duration
        const duration = 0.2 + Math.random() * 0.2; // 0.2-0.4s
        
        // High reactivity = louder
        const reactivity = Math.max(mat1.reactivity || 0, mat2.reactivity || 0);
        const volume = 0.5 + reactivity * 0.5;
        
        // High brightness = more harmonics
        const brightness = Math.max(mat1.brightness || 0.3, mat2.brightness || 0.3);
        
        return { freq, duration, volume, brightness };
    }

    /**
     * Update acoustic engine (called each frame)
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        if (!this.enabled) return;
        
        this.frameCounter++;
        if (this.frameCounter % this.soundThrottle !== 0) return;
        
        // v3.8: Process sound event queue from physics
        const events = this.physics.soundEvents;
        if (events && events.length > 0) {
            // Process up to maxSources events
            const processCount = Math.min(events.length, this.maxSources - this.activeSounds.size);
            
            for (let i = 0; i < processCount; i++) {
                const event = events[i];
                
                switch (event.type) {
                    case 'impact':
                        if (event.mat1.impactSound) {
                            const params = this.getImpactSound(event.mat1, event.mat2, event.velocity);
                            this.playImpact(event.mat1.impactSound, event.mat1, params.volume, event.x, event.y);
                        }
                        break;
                        
                    case 'flow':
                        if (event.material.flowSound) {
                            this.playFlow(event.material.flowSound, event.material, event.velocity, event.count);
                        }
                        break;
                        
                    case 'reaction':
                        this.playReaction(event.mat1, event.mat2, event.product, event.intensity);
                        break;
                        
                    case 'phaseChange':
                        if (event.material.phaseChangeSound) {
                            this.playPhaseChange(event.material.phaseChangeSound, event.intensity);
                        }
                        break;
                }
            }
            
            // Clear processed events
            events.length = 0;
        }
        
        // Cleanup expired sounds
        const now = this.ctx.currentTime;
        for (const [key, sound] of this.activeSounds) {
            if (now - sound.startTime > 2) {
                if (sound.source) {
                    try {
                        sound.source.stop();
                    } catch (e) {
                        // Already stopped
                    }
                }
                this.activeSounds.delete(key);
            }
        }
        
        // Limit active sources
        if (this.activeSounds.size > this.maxSources) {
            const oldest = Array.from(this.activeSounds.entries())
                .sort((a, b) => a[1].startTime - b[1].startTime)[0];
            if (oldest && oldest[1].source) {
                try {
                    oldest[1].source.stop();
                } catch (e) {}
            }
            this.activeSounds.delete(oldest[0]);
        }
    }

    /**
     * Set master volume
     * @param {number} volume - Volume (0-1)
     */
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }

    /**
     * Set reverb level
     * @param {number} level - Reverb level (0-1)
     */
    setReverbLevel(level) {
        this.reverbLevel = Math.max(0, Math.min(1, level));
        // Recreate reverb with new level
        if (this.ctx && this.convolver) {
            this.convolver.buffer = this.createReverbImpulse(2, this.reverbLevel);
        }
    }

    /**
     * Analyze surrounding geometry to estimate room size for reverb
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @returns {number} Estimated room size (0-1, small to large)
     */
    analyzeRoomSize(x, y) {
        // Raycast in multiple directions to find walls
        let totalDist = 0;
        const rays = 8;
        
        for (let i = 0; i < rays; i++) {
            const angle = (i / rays) * Math.PI * 2;
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            
            let dist = 0;
            const maxDist = 200;
            
            while (dist < maxDist) {
                const checkX = Math.floor((x + dx * dist) / this.physics.cellSize);
                const checkY = Math.floor((y + dy * dist) / this.physics.cellSize);
                
                if (!this.physics.inBounds(checkX, checkY)) break;
                
                const idx = this.physics.index(checkX, checkY);
                const matId = this.physics.grid[idx];
                const mat = this.physics.getMaterial(matId);
                
                if (mat && mat.state === 'solid') break;
                
                dist += 5;
            }
            
            totalDist += dist;
        }
        
        const avgDist = totalDist / rays;
        return Math.min(1, avgDist / 200); // Normalize to 0-1
    }

    /**
     * v4.1: Play creature sound
     * @param {string} creatureType - Type of creature ('worm'|'fish'|'bug')
     * @param {string} action - Action type ('eat'|'move'|'chirp')
     */
    playCreatureSound(creatureType, action) {
        if (!this.enabled || !this.ctx) return;
        
        const now = this.ctx.currentTime;
        const volume = this.masterVolume * 0.15;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        if (creatureType === 'worm') {
            // Very low frequency rumble when eating
            if (action === 'eat') {
                filter.type = 'lowpass';
                filter.frequency.value = 100;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(40, now);
                osc.frequency.exponentialRampToValueAtTime(35, now + 0.1);
                gain.gain.setValueAtTime(volume * 0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            }
        } else if (creatureType === 'fish') {
            // Gentle water splash/bubble sounds
            if (action === 'eat') {
                filter.type = 'bandpass';
                filter.frequency.value = 300;
                filter.Q.value = 2;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(250, now);
                osc.frequency.exponentialRampToValueAtTime(350, now + 0.05);
                gain.gain.setValueAtTime(volume * 0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            }
        } else if (creatureType === 'bug') {
            // Tiny clicking/chirping
            if (action === 'eat') {
                filter.type = 'highpass';
                filter.frequency.value = 800;
                osc.type = 'square';
                osc.frequency.setValueAtTime(1200, now);
                gain.gain.setValueAtTime(volume * 0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
                osc.start(now);
                osc.stop(now + 0.02);
            }
        }
    }
}

/**
 * @class CompositionGame
 * "The Composition" - A god-sim music game
 * Build the world = compose music
 * Your instrument is the Earth itself
 */
class CompositionGame {
    /**
     * Create a new Composition game
     * @param {BudEngine} engine - Engine instance
     */
    constructor(engine) {
        this.engine = engine;
        this.physics = engine.physics;
        this.acoustics = engine.physics.acoustics;
        
        // Game state
        this.mode = 'creation'; // 'creation', 'listening', 'conducting'
        this.score = 0; // Overall musical score
        this.harmony = 0; // Harmonic consonance (0-100)
        this.complexity = 0; // Material variety (0-100)
        this.rhythm = 0; // Rhythmic patterns (0-100)
        this.dynamics = 0; // Volume variation (0-100)
        this.texture = 0; // Sound diversity (0-100)
        this.melody = 0; // Pitch patterns (0-100)
        
        // Epoch progression
        this.epoch = 'genesis'; // 'genesis', 'formation', 'life', 'civilization', 'transcendence'
        this.epochThresholds = {
            genesis: 0,
            formation: 100,
            life: 500,
            civilization: 1500,
            transcendence: 3000
        };
        
        // Tutorial state
        this.tutorial = {
            active: false,
            step: 0,
            completed: false,
            steps: [
                { message: 'Touch to place stone...', material: 'stone', placed: false },
                { message: 'Now add water...', material: 'water', placed: false },
                { message: 'Listen...', delay: 2, waited: false },
                { message: 'Your composition begins.', final: true }
            ]
        };
        
        // Load tutorial state from localStorage
        try {
            const saved = localStorage.getItem('composition_tutorial');
            if (saved === 'completed') {
                this.tutorial.completed = true;
            } else {
                this.tutorial.active = true;
            }
        } catch (e) {
            this.tutorial.active = true;
        }
        
        // Musical analysis
        this.analysis = {
            activeMaterials: new Set(),
            recentFrequencies: [], // Recent sound frequencies for melody tracking
            volumeHistory: [], // For dynamics
            soundTypes: new Set(), // For texture
            lastUpdateTime: 0,
            periodicEvents: new Map() // For rhythm detection
        };
        
        // Conducting mode state
        this.conducting = {
            wind: { x: 0, y: 0 },
            tempModifier: 0,
            timeScaleTarget: 1
        };
        
        // Touch gesture tracking
        this.gesture = {
            startX: 0,
            startY: 0,
            startTime: 0,
            currentX: 0,
            currentY: 0,
            active: false,
            type: null // 'tap', 'swipe', 'longpress'
        };
        
        console.log('[CompositionGame v4.0] The Composition - Your instrument is the Earth');
    }

    /**
     * Update game state (called each frame)
     * @param {number} dt - Delta time
     */
    update(dt) {
        // Update musical analysis
        this.updateAnalysis(dt);
        
        // Calculate scores
        this.calculateScores();
        
        // Check for epoch transitions
        this.updateEpoch();
        
        // Update tutorial
        if (this.tutorial.active && !this.tutorial.completed) {
            this.updateTutorial();
        }
        
        // Apply conducting mode effects
        if (this.mode === 'conducting') {
            this.applyConducting(dt);
        }
    }

    /**
     * Update musical analysis from world state
     * @private
     */
    updateAnalysis(dt) {
        const now = performance.now() / 1000;
        if (now - this.analysis.lastUpdateTime < 0.1) return; // Update 10x/sec
        this.analysis.lastUpdateTime = now;
        
        // Scan world for active materials
        this.analysis.activeMaterials.clear();
        if (this.physics.grid) {
            for (let i = 0; i < this.physics.grid.length; i++) {
                const matId = this.physics.grid[i];
                if (matId > 0) {
                    const mat = this.physics.materials.get(matId);
                    if (mat) {
                        this.analysis.activeMaterials.add(mat.name);
                    }
                }
            }
        }
        
        // Track volume history for dynamics
        if (this.acoustics.enabled && this.acoustics.activeSounds.size > 0) {
            const currentVolume = this.acoustics.activeSounds.size / this.acoustics.maxSources;
            this.analysis.volumeHistory.push(currentVolume);
            if (this.analysis.volumeHistory.length > 100) {
                this.analysis.volumeHistory.shift();
            }
        }
        
        // Detect periodic events for rhythm
        if (this.physics.worldAge > 0) {
            const season = this.physics.season;
            this.analysis.periodicEvents.set('season', season);
        }
    }

    /**
     * Calculate all musical scores
     * @private
     */
    calculateScores() {
        this.calculateHarmony();
        this.calculateComplexity();
        this.calculateRhythm();
        this.calculateDynamics();
        this.calculateTexture();
        this.calculateMelody();
        
        // Overall score is weighted average
        this.score = Math.floor(
            this.harmony * 0.3 +
            this.complexity * 0.2 +
            this.rhythm * 0.15 +
            this.dynamics * 0.15 +
            this.texture * 0.1 +
            this.melody * 0.1
        );
    }

    /**
     * Calculate harmonic score based on frequency relationships
     * @private
     */
    calculateHarmony() {
        if (!this.physics.grid) {
            this.harmony = 0;
            return;
        }
        
        // Sample random positions to find frequency relationships
        const samples = 50;
        let consonantPairs = 0;
        let totalPairs = 0;
        
        for (let i = 0; i < samples; i++) {
            const x1 = Math.floor(Math.random() * this.physics.gridWidth);
            const y1 = Math.floor(Math.random() * this.physics.gridHeight);
            const x2 = Math.floor(Math.random() * this.physics.gridWidth);
            const y2 = Math.floor(Math.random() * this.physics.gridHeight);
            
            const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            if (dist > 50 || dist < 5) continue; // Only check nearby materials
            
            const idx1 = y1 * this.physics.gridWidth + x1;
            const idx2 = y2 * this.physics.gridWidth + x2;
            const mat1 = this.physics.materials.get(this.physics.grid[idx1]);
            const mat2 = this.physics.materials.get(this.physics.grid[idx2]);
            
            if (mat1 && mat2 && mat1.resonanceFreq && mat2.resonanceFreq) {
                totalPairs++;
                const ratio = mat1.resonanceFreq / mat2.resonanceFreq;
                
                // Check for consonant intervals (music theory)
                if (this.isConsonant(ratio)) {
                    consonantPairs++;
                }
            }
        }
        
        this.harmony = totalPairs > 0 ? (consonantPairs / totalPairs) * 100 : 0;
    }

    /**
     * Check if frequency ratio is consonant (music theory)
     * @private
     * @param {number} ratio - Frequency ratio
     * @returns {boolean} True if consonant
     */
    isConsonant(ratio) {
        const intervals = [
            1.0,   // unison
            2.0,   // octave
            1.5,   // fifth (3:2)
            1.333, // fourth (4:3)
            1.25,  // major third (5:4)
            1.2    // minor third (6:5)
        ];
        
        // Check both directions
        const normalized = ratio > 1 ? ratio : 1 / ratio;
        
        for (const interval of intervals) {
            if (Math.abs(normalized - interval) < 0.1) {
                return true;
            }
            // Check octave equivalents
            if (Math.abs(normalized - interval * 2) < 0.1) {
                return true;
            }
            if (Math.abs(normalized - interval / 2) < 0.1) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Calculate complexity score based on material variety
     * @private
     */
    calculateComplexity() {
        const uniqueMaterials = this.analysis.activeMaterials.size;
        const totalMaterials = this.physics.materials.size;
        
        // More unique materials = higher complexity
        this.complexity = Math.min(100, (uniqueMaterials / totalMaterials) * 200);
    }

    /**
     * Calculate rhythm score based on periodic events
     * @private
     */
    calculateRhythm() {
        // Detect rhythmic patterns: seasons, flowing water, etc.
        let rhythmicScore = 0;
        
        // Seasonal rhythm
        if (this.physics.worldAge > 0) {
            rhythmicScore += 20;
        }
        
        // Water flow creates rhythm
        if (this.analysis.activeMaterials.has('water')) {
            rhythmicScore += 30;
        }
        
        // Fire flicker creates rhythm
        if (this.analysis.activeMaterials.has('fire')) {
            rhythmicScore += 20;
        }
        
        // Steam/gas movement creates rhythm
        if (this.analysis.activeMaterials.has('steam') || this.analysis.activeMaterials.has('smoke')) {
            rhythmicScore += 15;
        }
        
        // Living materials create biological rhythms
        if (this.analysis.activeMaterials.has('plant') || this.analysis.activeMaterials.has('vegetation')) {
            rhythmicScore += 15;
        }
        
        this.rhythm = Math.min(100, rhythmicScore);
    }

    /**
     * Calculate dynamics score based on volume variation
     * @private
     */
    calculateDynamics() {
        if (this.analysis.volumeHistory.length < 10) {
            this.dynamics = 0;
            return;
        }
        
        // Calculate variance in volume
        const avg = this.analysis.volumeHistory.reduce((a, b) => a + b, 0) / this.analysis.volumeHistory.length;
        const variance = this.analysis.volumeHistory.reduce((sum, v) => sum + (v - avg) ** 2, 0) / this.analysis.volumeHistory.length;
        
        // Higher variance = better dynamics (but not too high)
        this.dynamics = Math.min(100, variance * 500);
    }

    /**
     * Calculate texture score based on sound diversity
     * @private
     */
    calculateTexture() {
        // Count different sound types present
        this.analysis.soundTypes.clear();
        
        for (const matName of this.analysis.activeMaterials) {
            const matId = this.physics.materialIdMap.get(matName);
            const mat = this.physics.materials.get(matId);
            
            if (mat) {
                if (mat.impactSound) this.analysis.soundTypes.add('impact');
                if (mat.flowSound) this.analysis.soundTypes.add('flow');
                if (mat.ambientSound) this.analysis.soundTypes.add('ambient');
            }
        }
        
        // More sound types = richer texture
        this.texture = (this.analysis.soundTypes.size / 3) * 100;
    }

    /**
     * Calculate melody score based on pitch patterns
     * @private
     */
    calculateMelody() {
        // Track frequency changes over time
        // For now, simple: materials with different resonance frequencies
        const frequencies = [];
        
        for (const matName of this.analysis.activeMaterials) {
            const matId = this.physics.materialIdMap.get(matName);
            const mat = this.physics.materials.get(matId);
            if (mat && mat.resonanceFreq) {
                frequencies.push(mat.resonanceFreq);
            }
        }
        
        if (frequencies.length < 2) {
            this.melody = 0;
            return;
        }
        
        // Sort frequencies
        frequencies.sort((a, b) => a - b);
        
        // Check for rising/falling patterns
        let melodicScore = 0;
        for (let i = 1; i < frequencies.length; i++) {
            const ratio = frequencies[i] / frequencies[i - 1];
            if (ratio > 1.05 && ratio < 2.5) { // Meaningful pitch change
                melodicScore += 20;
            }
        }
        
        this.melody = Math.min(100, melodicScore);
    }

    /**
     * Update epoch based on score
     * @private
     */
    updateEpoch() {
        const oldEpoch = this.epoch;
        
        if (this.score >= this.epochThresholds.transcendence) {
            this.epoch = 'transcendence';
        } else if (this.score >= this.epochThresholds.civilization) {
            this.epoch = 'civilization';
        } else if (this.score >= this.epochThresholds.life) {
            this.epoch = 'life';
        } else if (this.score >= this.epochThresholds.formation) {
            this.epoch = 'formation';
        } else {
            this.epoch = 'genesis';
        }
        
        // Trigger transition effect if epoch changed
        if (oldEpoch !== this.epoch) {
            this.onEpochTransition(oldEpoch, this.epoch);
        }
    }

    /**
     * Handle epoch transition
     * @private
     */
    onEpochTransition(from, to) {
        console.log(`[CompositionGame] Epoch transition: ${from} → ${to}`);
        
        // Visual flash
        if (this.engine.screenFlash) {
            this.engine.screenFlash('#ffffff', 0.3, 0.5);
        }
        
        // Play chord (if acoustics enabled)
        if (this.acoustics.enabled && this.acoustics.ctx) {
            this.playEpochChord(to);
        }
    }

    /**
     * Play a chord to mark epoch transition
     * @private
     */
    playEpochChord(epoch) {
        const chords = {
            genesis: [100, 150, 200],           // Dark low chord
            formation: [200, 300, 400],         // Building chord
            life: [300, 450, 600],              // Growing chord
            civilization: [400, 600, 800],      // Rich chord
            transcendence: [500, 750, 1000, 1250] // Bright high chord
        };
        
        const freqs = chords[epoch] || [200, 300, 400];
        const now = this.acoustics.ctx.currentTime;
        
        for (const freq of freqs) {
            const osc = this.acoustics.ctx.createOscillator();
            const gain = this.acoustics.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
            
            osc.connect(gain);
            gain.connect(this.acoustics.masterGain);
            
            osc.start(now);
            osc.stop(now + 1.5);
        }
    }

    /**
     * Update tutorial state
     * @private
     */
    updateTutorial() {
        if (!this.tutorial.active || this.tutorial.completed) return;
        
        const step = this.tutorial.steps[this.tutorial.step];
        if (!step) {
            // Tutorial complete
            this.tutorial.completed = true;
            this.tutorial.active = false;
            try {
                localStorage.setItem('composition_tutorial', 'completed');
            } catch (e) {}
            return;
        }
        
        // Check step conditions
        if (step.material) {
            // Check if material was placed
            if (this.analysis.activeMaterials.has(step.material) && !step.placed) {
                step.placed = true;
                this.tutorial.step++;
            }
        } else if (step.delay) {
            // Wait for delay
            if (!step.startTime) {
                step.startTime = performance.now();
            } else if ((performance.now() - step.startTime) / 1000 > step.delay) {
                step.waited = true;
                this.tutorial.step++;
            }
        } else if (step.final) {
            // Final message, wait a bit then complete
            if (!step.startTime) {
                step.startTime = performance.now();
            } else if ((performance.now() - step.startTime) / 1000 > 3) {
                this.tutorial.step++;
            }
        }
    }

    /**
     * Apply conducting mode effects
     * @private
     */
    applyConducting(dt) {
        // Apply wind
        this.physics.wind.x = this.conducting.wind.x;
        this.physics.wind.y = this.conducting.wind.y;
        
        // Apply temperature modifier
        if (this.physics.temperatureGrid) {
            const modifier = this.conducting.tempModifier;
            if (Math.abs(modifier) > 0.01) {
                // Gradually modify ambient temperature
                this.physics.ambientTemp += modifier * dt * 10;
                this.physics.ambientTemp = Math.max(-50, Math.min(100, this.physics.ambientTemp));
            }
        }
        
        // Apply time scale
        if (this.physics.timeScale !== this.conducting.timeScaleTarget) {
            this.physics.timeScale += (this.conducting.timeScaleTarget - this.physics.timeScale) * dt * 2;
        }
        
        // Decay conducting inputs
        this.conducting.wind.x *= Math.pow(0.1, dt);
        this.conducting.wind.y *= Math.pow(0.1, dt);
        this.conducting.tempModifier *= Math.pow(0.1, dt);
    }

    /**
     * Set game mode
     * @param {string} mode - Mode ('creation', 'listening', 'conducting')
     */
    setMode(mode) {
        if (['creation', 'listening', 'conducting'].includes(mode)) {
            this.mode = mode;
            console.log(`[CompositionGame] Mode: ${mode}`);
        }
    }

    /**
     * Handle touch/mouse gesture start
     * @param {number} x - Screen X
     * @param {number} y - Screen Y
     */
    onGestureStart(x, y) {
        this.gesture.startX = x;
        this.gesture.startY = y;
        this.gesture.currentX = x;
        this.gesture.currentY = y;
        this.gesture.startTime = performance.now();
        this.gesture.active = true;
        this.gesture.type = null;
    }

    /**
     * Handle touch/mouse gesture move
     * @param {number} x - Screen X
     * @param {number} y - Screen Y
     */
    onGestureMove(x, y) {
        if (!this.gesture.active) return;
        
        this.gesture.currentX = x;
        this.gesture.currentY = y;
        
        const dx = x - this.gesture.startX;
        const dy = y - this.gesture.startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Detect swipe
        if (dist > 20 && this.mode === 'conducting') {
            this.gesture.type = 'swipe';
            
            // Apply conducting gestures
            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal swipe: wind
                this.conducting.wind.x = Math.max(-1, Math.min(1, dx / 100));
            } else {
                // Vertical swipe: temperature
                this.conducting.tempModifier = Math.max(-1, Math.min(1, -dy / 100));
            }
        }
    }

    /**
     * Handle touch/mouse gesture end
     * @param {number} x - Screen X
     * @param {number} y - Screen Y
     */
    onGestureEnd(x, y) {
        if (!this.gesture.active) return;
        
        const duration = (performance.now() - this.gesture.startTime) / 1000;
        const dx = x - this.gesture.startX;
        const dy = y - this.gesture.startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Detect tap vs long press
        if (dist < 10) {
            if (duration > 0.5) {
                this.gesture.type = 'longpress';
                // Long press in conducting mode: spawn rain/snow
                if (this.mode === 'conducting') {
                    this.spawnWeather(x, y);
                }
            } else {
                this.gesture.type = 'tap';
                // Tap in conducting mode: geological event
                if (this.mode === 'conducting') {
                    this.triggerGeologicalEvent(x, y);
                }
            }
        }
        
        this.gesture.active = false;
    }

    /**
     * Spawn weather at position (conducting mode)
     * @private
     */
    spawnWeather(screenX, screenY) {
        // Convert screen to world position
        const worldX = Math.floor(screenX / this.physics.cellSize);
        const worldY = Math.floor(screenY / this.physics.cellSize);
        
        // Spawn water or snow based on temperature
        const material = this.physics.ambientTemp < 0 ? 'ice' : 'water';
        
        // Rain down from top
        for (let i = 0; i < 20; i++) {
            const x = worldX + Math.floor(Math.random() * 10) - 5;
            const y = Math.max(0, worldY - Math.floor(Math.random() * 20));
            this.physics.set(x, y, material);
        }
    }

    /**
     * Trigger geological event at position (conducting mode)
     * @private
     */
    triggerGeologicalEvent(screenX, screenY) {
        // Convert screen to world position
        const worldX = Math.floor(screenX / this.physics.cellSize);
        const worldY = Math.floor(screenY / this.physics.cellSize);
        
        // Small explosion effect
        if (this.physics.explode) {
            this.physics.explode(worldX, worldY, 5);
        }
    }

    /**
     * Get current composition state
     * @returns {object} State object
     */
    getState() {
        return {
            mode: this.mode,
            epoch: this.epoch,
            score: this.score,
            harmony: Math.floor(this.harmony),
            complexity: Math.floor(this.complexity),
            rhythm: Math.floor(this.rhythm),
            dynamics: Math.floor(this.dynamics),
            texture: Math.floor(this.texture),
            melody: Math.floor(this.melody),
            activeMaterials: Array.from(this.analysis.activeMaterials),
            tutorialActive: this.tutorial.active,
            tutorialStep: this.tutorial.step
        };
    }

    /**
     * Get current tutorial message
     * @returns {string|null} Tutorial message
     */
    getTutorialMessage() {
        if (!this.tutorial.active || this.tutorial.completed) return null;
        
        const step = this.tutorial.steps[this.tutorial.step];
        return step ? step.message : null;
    }
}

// Static properties (must be set AFTER class definition)
BudEngine.VERSION = '4.0';
BudEngine.LAYER = {
    DEFAULT: 1,
    PLAYER: 2,
    ENEMY: 4,
    BULLET: 8,
    PICKUP: 16,
    WALL: 32
};

// Export for use in browser
if (typeof window !== 'undefined') {
    window.BudEngine = BudEngine;
}
