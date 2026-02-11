/**
 * BUD ENGINE v2.1
 * A 2D web game engine designed for AI-human collaboration
 * 
 * Philosophy: AI can write, TEST, and iterate on games independently.
 * Killer feature: AI Testing API + auto-playtest bot
 * 
 * Architecture: Single-file, no build tools, runs in browser
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
            bounds: null // {minX, minY, maxX, maxY}
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

        // Asset loader (P3: Asset loader)
        this.load = new AssetLoader(this);

        // Pathfinding (P3: AI pathfinding)
        this.pathfinding = new PathfindingSystem(this);

        // Tilemap
        this.currentTilemap = null;

        // Gravity (optional, for platformers)
        this.gravity = config.gravity || 0;

        // Scene transitions
        this.transition = {
            active: false,
            type: 'fade',
            progress: 0,
            duration: 0.5,
            fadeOut: false,
            nextScene: null
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

        // Update scene transitions
        if (this.transition.active) {
            this.transition.progress += dt / this.transition.duration;
            
            if (this.transition.progress >= 1) {
                this.transition.progress = 1;
                
                if (this.transition.fadeOut) {
                    // Fade out complete, switch scene
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

            // Update animation (P1: Sprite animation)
            if (entity.animation && entity.animation.playing) {
                entity.animation.update(dt);
                entity.sprite = entity.animation.currentFrame();
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

        // Render entities (sorted by layer)
        const sortedEntities = [...this.entities].sort((a, b) => (a.layer || 0) - (b.layer || 0));
        for (let entity of sortedEntities) {
            if (!entity.enabled || !entity.sprite) continue;
            
            ctx.save();
            ctx.translate(entity.x, entity.y);
            if (entity.rotation) ctx.rotate(entity.rotation);
            
            const sprite = entity.sprite;
            if (sprite.tagName === 'CANVAS') {
                ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
            } else if (typeof sprite === 'function') {
                sprite(ctx, entity);
            }
            
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

        // Render scene transitions
        if (this.transition.active) {
            const alpha = this.transition.fadeOut ? this.transition.progress : 1 - this.transition.progress;
            ctx.fillStyle = `rgba(10, 10, 20, ${alpha})`;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Render debug overlay (P2: Debug overlay)
        if (this.debug) {
            this.debugSystem.render(ctx);
        }
    }

    updateCamera(dt) {
        if (this.camera.target) {
            const target = this.camera.target;
            const targetX = target.x || 0;
            const targetY = target.y || 0;
            
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
     * Switch to a different scene
     * @param {string} name - Scene name
     * @param {boolean} [useTransition=false] - Use fade transition
     * @example
     * engine.goTo('gameover', true); // Go to gameover with fade
     */
    goTo(name, useTransition = false) {
        // Error handling: validate scene exists
        if (!name || typeof name !== 'string') {
            console.error('[BudEngine] goTo() requires a scene name string');
            return;
        }
        if (!this.scenes[name]) {
            console.error(`[BudEngine] Scene '${name}' does not exist. Available scenes:`, Object.keys(this.scenes));
            return;
        }

        if (useTransition && !this.transition.active) {
            // Start fade out transition
            this.transition.active = true;
            this.transition.fadeOut = true;
            this.transition.progress = 0;
            this.transition.nextScene = name;
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
        if (useTransition) {
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

// ===== UI SYSTEM =====

class UISystem {
    constructor(engine) {
        this.engine = engine;
        this.elements = [];
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
    }

    clear() {
        this.elements = [];
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

class AnimationSystem {
    constructor(engine) {
        this.engine = engine;
    }
}

// ===== DEBUG SYSTEM (P2) =====

class DebugSystem {
    constructor(engine) {
        this.engine = engine;
    }

    render(ctx) {
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

// Static properties (must be set AFTER class definition)
BudEngine.VERSION = '2.1';
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
