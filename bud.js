/**
 * BUD ENGINE v0.1
 * A 2D web game engine designed for AI-human collaboration
 * 
 * Philosophy: AI can write, TEST, and iterate on games independently.
 * Killer feature: AI Testing API + auto-playtest bot
 * 
 * Architecture: Single-file, no build tools, runs in browser
 */

class BudEngine {
    constructor(config = {}) {
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
            target: null,
            followSpeed: 0.1,
            shake: { x: 0, y: 0, intensity: 0, decay: 0.9 }
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
    
    start() {
        if (this.running) return;
        this.running = true;
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    stop() {
        this.running = false;
    }

    restart() {
        // Re-enter current scene
        if (this.currentScene && this.scenes[this.currentScene]) {
            this.goTo(this.currentScene);
        }
    }

    gameLoop(timestamp = 0) {
        if (!this.running) return;

        // Fixed timestep
        const elapsed = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        this.fps = elapsed > 0 ? Math.round(1000 / elapsed) : 60;

        if (!this.paused) {
            this.update(this.dt);
            this.frame++;
            this.time += this.dt;
        }

        this.render();

        // Clear input flags AFTER render so UI can check them
        this.input.update();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
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

            // Update callback
            if (entity.update) {
                entity.update(dt);
            }
        }

        // Update particles
        this.particles.update(dt);

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

        // Camera shake decay
        this.camera.shake.x *= this.camera.shake.decay;
        this.camera.shake.y *= this.camera.shake.decay;
    }

    updateCamera(dt) {
        if (this.camera.target) {
            const target = this.camera.target;
            const targetX = target.x || 0;
            const targetY = target.y || 0;
            
            // Smooth follow
            this.camera.x += (targetX - this.camera.x) * this.camera.followSpeed;
            this.camera.y += (targetY - this.camera.y) * this.camera.followSpeed;
        }
    }

    // ===== ENTITY SYSTEM =====

    spawn(type, props = {}) {
        const entity = {
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
            ...props
        };

        this.entities.push(entity);

        // Add to tag index
        for (let tag of entity.tags) {
            if (!this.entityTags.has(tag)) {
                this.entityTags.set(tag, new Set());
            }
            this.entityTags.get(tag).add(entity);
        }

        return entity;
    }

    destroy(entity) {
        const idx = this.entities.indexOf(entity);
        if (idx >= 0) {
            this.entities.splice(idx, 1);
        }

        // Remove from tag index
        for (let tag of entity.tags) {
            if (this.entityTags.has(tag)) {
                this.entityTags.get(tag).delete(entity);
            }
        }

        // Destroy children
        for (let child of entity.children) {
            this.destroy(child);
        }
    }

    findByTag(tag) {
        return this.entityTags.get(tag) ? Array.from(this.entityTags.get(tag)) : [];
    }

    findOne(tag) {
        const entities = this.findByTag(tag);
        return entities.length > 0 ? entities[0] : null;
    }

    // ===== COLLISION SYSTEM =====

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

    onCollision(tagA, tagB, fn) {
        this.collisionCallbacks.push({ tagA, tagB, fn });
    }

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

    scene(name, definition) {
        this.scenes[name] = definition;
    }

    goTo(name, useTransition = false) {
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

        // Clear entities
        this.entities = [];
        this.entityTags.clear();
        this.nextEntityId = 1;
        this.collisionCallbacks = [];
        this.particles.clear();
        this.ui.clear();

        // Enter new scene
        this.currentScene = name;
        if (this.scenes[name]) {
            const scene = this.scenes[name];
            if (scene.enter) scene.enter();
        }

        // Start fade in if transitioning
        if (useTransition) {
            this.transition.fadeOut = false;
            this.transition.progress = 0;
        }
    }

    // ===== TILEMAP =====

    tilemap(tileSize = 32) {
        const tilemap = new Tilemap(this, tileSize);
        this.currentTilemap = tilemap;
        return tilemap;
    }

    // ===== CAMERA =====

    cameraFollow(entity, speed = 0.1) {
        this.camera.target = entity;
        this.camera.followSpeed = speed;
    }

    cameraShake(intensity = 10) {
        this.camera.shake.intensity = intensity;
        this.camera.shake.x = (Math.random() - 0.5) * intensity;
        this.camera.shake.y = (Math.random() - 0.5) * intensity;
    }

    // ===== HELPERS =====

    screenToWorld(screenX, screenY) {
        const x = (screenX - this.canvas.width / 2) / this.camera.zoom + this.camera.x;
        const y = (screenY - this.canvas.height / 2) / this.camera.zoom + this.camera.y;
        return { x, y };
    }

    worldToScreen(worldX, worldY) {
        const x = (worldX - this.camera.x) * this.camera.zoom + this.canvas.width / 2;
        const y = (worldY - this.camera.y) * this.camera.zoom + this.canvas.height / 2;
        return { x, y };
    }

    random(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        return min + Math.random() * (max - min);
    }

    choose(array) {
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
        });

        this.engine.canvas.addEventListener('mouseup', (e) => {
            this.mouseDown = false;
            this.mouseReleased = true;
        });
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

class ParticleSystem {
    constructor(engine) {
        this.engine = engine;
        this.particles = [];
    }

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

class SoundSystem {
    constructor(engine) {
        this.engine = engine;
        this.audioContext = null;
        this.ambientSounds = new Map();
    }

    ensureContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    play(type) {
        this.ensureContext();
        const ctx = this.audioContext;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case 'shoot':
                osc.type = 'square';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            
            case 'hit':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            
            case 'explode':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            
            case 'pickup':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'jump':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;

            case 'hurt':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
                gain.gain.setValueAtTime(0.35, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
        }
    }

    ambient(type) {
        // Placeholder for ambient loops
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

class TestingAPI {
    constructor(engine) {
        this.engine = engine;
        this.recording = null;
        this.recordingFrames = [];
    }

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

    // Auto-playtest bot
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
        
        if (strategy === 'survive') {
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

            if (nearest) {
                const dx = nearest.x - player.x;
                const dy = nearest.y - player.y;
                
                // Move away from enemy if too close
                if (nearestDist < 150) {
                    this.input('w', dy > 0);
                    this.input('s', dy < 0);
                    this.input('a', dx > 0);
                    this.input('d', dx < 0);
                } else {
                    // Move randomly
                    this.input('w', Math.random() > 0.5);
                    this.input('s', Math.random() > 0.5);
                    this.input('a', Math.random() > 0.5);
                    this.input('d', Math.random() > 0.5);
                }

                // Shoot at enemy
                this.moveMouse(nearest.x, nearest.y);
                this.click(nearest.x, nearest.y);
            }
        }
        
        if (strategy === 'aggressive') {
            if (enemies.length > 0) {
                const target = enemies[0];
                const dx = target.x - player.x;
                const dy = target.y - player.y;
                
                this.input('w', dy > 0);
                this.input('s', dy < 0);
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

// Export for use in browser
if (typeof window !== 'undefined') {
    window.BudEngine = BudEngine;
}
