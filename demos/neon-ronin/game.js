/**
 * NEON RONIN
 * A top-down cyberpunk action RPG built with Bud Engine
 * 
 * Purpose: Stress-test and improve Bud Engine through actual game development
 */

const CONFIG = {
    PLAYER_SPEED: 200,
    PLAYER_DASH_SPEED: 600,
    PLAYER_MAX_HEALTH: 100,
    PLAYER_MAX_ENERGY: 100,
    ENERGY_REGEN: 15, // per second
    DASH_COST: 20,
    RANGED_COST: 10,
    MELEE_DAMAGE: 25,
    RANGED_DAMAGE: 15,
    BULLET_SPEED: 500,
};

// Initialize engine
const engine = new BudEngine({
    width: 1280,
    height: 720,
    backgroundColor: '#0a0814'
});

// Game state
const game = {
    currentRoom: 'room1',
    playerData: {
        health: CONFIG.PLAYER_MAX_HEALTH,
        maxHealth: CONFIG.PLAYER_MAX_HEALTH,
        energy: CONFIG.PLAYER_MAX_ENERGY,
        maxEnergy: CONFIG.PLAYER_MAX_ENERGY,
        weapon: 'katana',
        upgrades: [],
        kills: 0
    }
};

// ===== PLAYER CONTROLLER =====

function createPlayer(x, y) {
    const baseSprite = engine.art.character({
        size: 16,
        color: '#00ffcc',
        body: 'capsule',
        eyes: true,
        glow: true
    });

    const player = engine.spawn('player', {
        x, y,
        sprite: (ctx, entity) => {
            // Procedural bob animation
            const bobAmount = 2;
            const bobSpeed = 12;
            const isMoving = Math.abs(entity.velocity.x) > 10 || Math.abs(entity.velocity.y) > 10;
            
            if (isMoving) {
                entity.bobPhase += engine.dt * bobSpeed;
            }
            
            const yOffset = isMoving ? Math.sin(entity.bobPhase) * bobAmount : 0;
            
            // Squash and stretch
            const squash = isMoving ? 1 + Math.cos(entity.bobPhase * 2) * 0.05 : 1;
            ctx.scale(1 / squash, squash);
            
            ctx.drawImage(baseSprite, -baseSprite.width / 2, -baseSprite.height / 2 + yOffset);
        },
        collider: { type: 'circle', radius: 14 },
        velocity: { x: 0, y: 0 },
        health: game.playerData.health,
        maxHealth: game.playerData.maxHealth,
        energy: game.playerData.energy,
        maxEnergy: game.playerData.maxEnergy,
        speed: CONFIG.PLAYER_SPEED,
        dashCooldown: 0,
        meleeCooldown: 0,
        rangedCooldown: 0,
        invulnerable: 0,
        bobPhase: 0, // For movement animation
        tags: ['player'],
        
        update(dt) {
            // Energy regeneration
            this.energy = Math.min(this.maxEnergy, this.energy + CONFIG.ENERGY_REGEN * dt);
            
            // Cooldowns
            if (this.dashCooldown > 0) this.dashCooldown -= dt;
            if (this.meleeCooldown > 0) this.meleeCooldown -= dt;
            if (this.rangedCooldown > 0) this.rangedCooldown -= dt;
            if (this.invulnerable > 0) this.invulnerable -= dt;
            
            // Dynamic combat camera zoom
            const enemies = engine.findByTag('enemy');
            let nearbyEnemies = 0;
            for (let enemy of enemies) {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 300) nearbyEnemies++;
            }
            
            // Zoom out when surrounded
            let targetZoom = 1.0;
            if (nearbyEnemies >= 4) {
                targetZoom = 0.85;
            } else if (nearbyEnemies >= 2) {
                targetZoom = 0.92;
            }
            
            engine.camera.zoom += (targetZoom - engine.camera.zoom) * dt * 3;
            
            // Movement input
            let moveX = 0;
            let moveY = 0;
            
            if (engine.input.key('w') || engine.input.key('ArrowUp')) moveY -= 1;
            if (engine.input.key('s') || engine.input.key('ArrowDown')) moveY += 1;
            if (engine.input.key('a') || engine.input.key('ArrowLeft')) moveX -= 1;
            if (engine.input.key('d') || engine.input.key('ArrowRight')) moveX += 1;
            
            // Normalize diagonal movement
            if (moveX !== 0 || moveY !== 0) {
                const len = Math.sqrt(moveX * moveX + moveY * moveY);
                moveX /= len;
                moveY /= len;
            }
            
            // Apply movement
            const speed = this.speed;
            this.velocity.x = moveX * speed;
            this.velocity.y = moveY * speed;
            
            // Face mouse cursor
            const mouseWorld = engine.input.mouseWorld;
            this.rotation = Math.atan2(mouseWorld.y - this.y, mouseWorld.x - this.x);
            
            // Dash (Space key)
            if (engine.input.keyPressed(' ') && this.dashCooldown <= 0 && this.energy >= CONFIG.DASH_COST) {
                this.energy -= CONFIG.DASH_COST;
                this.dashCooldown = 0.5;
                this.invulnerable = 0.2;
                this.isDashing = true;
                
                // Dash in movement direction (or facing direction if not moving)
                let dashX = moveX;
                let dashY = moveY;
                if (dashX === 0 && dashY === 0) {
                    dashX = Math.cos(this.rotation);
                    dashY = Math.sin(this.rotation);
                }
                
                this.velocity.x = dashX * CONFIG.PLAYER_DASH_SPEED;
                this.velocity.y = dashY * CONFIG.PLAYER_DASH_SPEED;
                
                // Dash particles
                engine.particles.burst(this.x, this.y, 'electric', 1.2);
                
                engine.sound.play('jump');
                engine.slowMo(0.3, 0.1); // Brief slow-mo for dash
                
                // Schedule dash end
                engine.after(0.15, () => {
                    this.isDashing = false;
                });
            }
            
            // Dash trail effect
            if (this.isDashing && engine.frame % 1 === 0) {
                engine.particles.trail(this.x, this.y, 'cyan', 1.2);
            }
            
            // Melee attack (Left click or E key when close to enemies)
            if ((engine.input.mousePressed || engine.input.keyPressed('e')) && this.meleeCooldown <= 0) {
                this.meleeCooldown = 0.4;
                performMeleeAttack(this);
            }
            
            // Ranged attack (Right click or Q key)
            if ((engine.input.key('q') && engine.input.keyPressed('q')) && 
                this.rangedCooldown <= 0 && 
                this.energy >= CONFIG.RANGED_COST) {
                this.energy -= CONFIG.RANGED_COST;
                this.rangedCooldown = 0.25;
                shootProjectile(this);
            }
            
            // Trail effect when moving fast
            if (this.velocity.x !== 0 || this.velocity.y !== 0) {
                if (engine.frame % 3 === 0) {
                    engine.particles.trail(this.x, this.y, 'cyan', 0.5);
                }
            }
        },
        
        takeDamage(amount) {
            if (this.invulnerable > 0) return;
            
            this.health -= amount;
            this.invulnerable = 0.5;
            
            // Hit feedback
            engine.sound.play('hurt');
            engine.impact(6, { flashColor: '#ff0000' });
            
            // Visual feedback on sprite
            this.flash = 1.0; // Flash white
            this.scale = 1.2; // Briefly enlarge
            engine.after(0.1, () => {
                this.scale = 1.0;
            });
            
            // Damage particles
            engine.particles.burst(this.x, this.y, 'fire', 0.7);
            
            if (this.health <= 0) {
                playerDeath();
            }
        }
    });
    
    return player;
}

function performMeleeAttack(player) {
    engine.sound.play('hit'); // Melee sound
    
    // Create visual slash arc
    const slashAngle = player.rotation;
    const slashDist = 35;
    const slashX = player.x + Math.cos(slashAngle) * slashDist;
    const slashY = player.y + Math.sin(slashAngle) * slashDist;
    
    // Spawn enhanced slash effect entity
    engine.spawn('slash-effect', {
        x: slashX,
        y: slashY,
        rotation: slashAngle,
        lifetime: 0.2,
        startAngle: slashAngle - Math.PI / 2.5,
        endAngle: slashAngle + Math.PI / 2.5,
        radius: 55,
        alpha: 1.0,
        layer: 10,
        tags: ['effect'],
        
        sprite: (ctx, entity) => {
            // Draw arc slash with multiple layers for depth
            const progress = 1 - (entity.lifetime / 0.2);
            const arcEnd = entity.startAngle + progress * (entity.endAngle - entity.startAngle);
            
            // Outer glow trail
            ctx.globalAlpha = entity.alpha * 0.4;
            ctx.strokeStyle = '#00ffcc';
            ctx.lineWidth = 12;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#00ffcc';
            
            ctx.beginPath();
            ctx.arc(0, 0, entity.radius, entity.startAngle, arcEnd, false);
            ctx.stroke();
            
            // Main slash
            ctx.globalAlpha = entity.alpha;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 7;
            ctx.shadowBlur = 20;
            
            ctx.beginPath();
            ctx.arc(0, 0, entity.radius, entity.startAngle, arcEnd, false);
            ctx.stroke();
            
            // Inner bright core
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffffff';
            
            ctx.beginPath();
            ctx.arc(0, 0, entity.radius, entity.startAngle, arcEnd, false);
            ctx.stroke();
            
            ctx.globalAlpha = 1;
        },
        
        update(dt) {
            this.lifetime -= dt;
            this.alpha = this.lifetime / 0.2;
            if (this.lifetime <= 0) {
                engine.destroy(this);
            }
        }
    });
    
    // Enhanced slash particles
    engine.particles.burst(slashX, slashY, 'electric', 1.0);
    
    // Check for enemies in range
    const enemies = engine.findByTag('enemy');
    const meleeRange = 60;
    let hitEnemy = false;
    
    for (let enemy of enemies) {
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Check if enemy is in arc in front of player
        const angleToEnemy = Math.atan2(dy, dx);
        const angleDiff = Math.abs(angleToEnemy - slashAngle);
        
        if (dist < meleeRange && angleDiff < Math.PI / 3) {
            if (enemy.takeDamage) {
                enemy.takeDamage(CONFIG.MELEE_DAMAGE);
                hitEnemy = true;
            }
        }
    }
    
    // Extra feedback if we hit something
    if (hitEnemy) {
        engine.impact(5, { noFlash: true }); // Impact feel on successful hit
    }
}

function shootProjectile(player) {
    engine.sound.play('shoot');
    
    const angle = player.rotation;
    const spawnDist = 25;
    const x = player.x + Math.cos(angle) * spawnDist;
    const y = player.y + Math.sin(angle) * spawnDist;
    
    // Muzzle flash effect
    engine.spawn('muzzle-flash', {
        x, y,
        rotation: angle,
        lifetime: 0.08,
        alpha: 1.0,
        scale: 1,
        layer: 15,
        tags: ['effect'],
        
        sprite: (ctx, entity) => {
            const progress = 1 - (entity.lifetime / 0.08);
            const size = 20 * (1 + progress * 0.5);
            
            // Outer glow
            ctx.globalAlpha = entity.alpha * 0.6;
            ctx.fillStyle = '#00ffff';
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#00ffff';
            
            // Star-shaped flash
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2;
                const r = i % 2 === 0 ? size : size * 0.4;
                const px = Math.cos(a) * r;
                const py = Math.sin(a) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            
            // Bright center
            ctx.globalAlpha = entity.alpha;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 1;
        },
        
        update(dt) {
            this.lifetime -= dt;
            this.alpha = this.lifetime / 0.08;
            this.scale = 1 + (1 - this.alpha) * 0.3;
            if (this.lifetime <= 0) {
                engine.destroy(this);
            }
        }
    });
    
    const bulletSprite = engine.art.particle({
        size: 6,
        color: '#00ffff',
        fade: false
    });
    
    engine.spawn('bullet', {
        x, y,
        sprite: bulletSprite,
        rotation: angle,
        collider: { type: 'circle', radius: 6 },
        velocity: {
            x: Math.cos(angle) * CONFIG.BULLET_SPEED,
            y: Math.sin(angle) * CONFIG.BULLET_SPEED
        },
        damage: CONFIG.RANGED_DAMAGE,
        lifetime: 2,
        tags: ['bullet', 'player-bullet'],
        layer: 5,
        
        update(dt) {
            this.lifetime -= dt;
            if (this.lifetime <= 0) {
                engine.destroy(this);
            }
            
            // Enhanced trail
            if (engine.frame % 2 === 0) {
                engine.particles.trail(this.x, this.y, 'cyan', 0.8);
            }
        }
    });
}

// ===== ENEMY SYSTEM =====

function createMeleeRusher(x, y, variant = 0) {
    // Visual variety - 3 variants
    const variants = [
        { color: '#ff3333', body: 'diamond', size: 14 }, // Red diamond (default)
        { color: '#ff6633', body: 'hexagon', size: 13 }, // Orange hexagon
        { color: '#ff3366', body: 'triangle', size: 15 }  // Pink triangle
    ];
    
    const v = variants[variant % variants.length];
    const baseSprite = engine.art.enemy({
        size: v.size,
        color: v.color,
        body: v.body,
        glow: true
    });
    
    // Create state machine for enemy AI (v2.6)
    const stateMachine = engine.stateMachine({
        chase: {
            enter(entity) {
                entity.pathfindCooldown = 0;
            },
            
            update(entity, dt) {
                const player = engine.findOne('player');
                if (!player) return;
                
                const dx = player.x - entity.x;
                const dy = player.y - entity.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // If in attack range, switch to telegraph
                if (dist < 40) {
                    this.go('telegraph', entity);
                    return;
                }
                
                // Pathfinding AI
                entity.pathfindCooldown -= dt;
                if (entity.pathfindCooldown <= 0 && engine.currentTilemap) {
                    entity.pathfindCooldown = 0.5; // Recalculate path every 0.5s
                    entity.currentPath = engine.pathfind(
                        { x: entity.x, y: entity.y },
                        { x: player.x, y: player.y }
                    );
                    entity.currentWaypoint = 0;
                }
                
                // Follow path if we have one
                if (entity.currentPath && entity.currentPath.length > 0) {
                    const waypoint = entity.currentPath[entity.currentWaypoint];
                    if (waypoint) {
                        const wpDx = waypoint.x - entity.x;
                        const wpDy = waypoint.y - entity.y;
                        const wpDist = Math.sqrt(wpDx * wpDx + wpDy * wpDy);
                        
                        if (wpDist < 20) {
                            // Reached waypoint, move to next
                            entity.currentWaypoint++;
                        } else {
                            // Move towards current waypoint
                            entity.velocity.x = (wpDx / wpDist) * entity.speed;
                            entity.velocity.y = (wpDy / wpDist) * entity.speed;
                        }
                        
                        entity.rotation = Math.atan2(entity.velocity.y, entity.velocity.x);
                    }
                } else {
                    // No path, go direct (fallback)
                    entity.velocity.x = (dx / dist) * entity.speed;
                    entity.velocity.y = (dy / dist) * entity.speed;
                    entity.rotation = Math.atan2(dy, dx);
                }
            }
        },
        
        telegraph: {
            enter(entity) {
                entity.velocity.x = 0;
                entity.velocity.y = 0;
                entity.telegraphTime = 0.4; // Wind-up time
                engine.sound.play('powerup'); // Warning sound
            },
            
            update(entity, dt) {
                entity.telegraphTime -= dt;
                
                // Flash red during telegraph (visual warning)
                const flashIntensity = Math.sin(entity.telegraphTime * 20) * 0.5 + 0.5;
                entity.flash = flashIntensity * 0.8;
                
                // Face player
                const player = engine.findOne('player');
                if (player) {
                    const dx = player.x - entity.x;
                    const dy = player.y - entity.y;
                    entity.rotation = Math.atan2(dy, dx);
                }
                
                if (entity.telegraphTime <= 0) {
                    this.go('attack', entity);
                }
            },
            
            exit(entity) {
                entity.flash = 0;
            }
        },
        
        attack: {
            enter(entity) {
                const player = engine.findOne('player');
                if (!player) {
                    this.go('chase', entity);
                    return;
                }
                
                const dx = player.x - entity.x;
                const dy = player.y - entity.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Quick lunge attack
                if (dist < 60 && player.takeDamage) {
                    player.takeDamage(entity.damage);
                    
                    // Lunge toward player
                    const lungeSpeed = 300;
                    entity.velocity.x = (dx / dist) * lungeSpeed;
                    entity.velocity.y = (dy / dist) * lungeSpeed;
                }
                
                // Return to chase after brief delay
                this.after(0.3, 'chase');
            },
            
            update(entity, dt) {
                // Slow down lunge
                entity.velocity.x *= 0.9;
                entity.velocity.y *= 0.9;
            }
        }
    }, 'chase');
    
    const enemy = engine.spawn('enemy', {
        x, y,
        deathColor: v.color, // Store for death effect
        sprite: (ctx, entity) => {
            // Animated breathing/pulsing
            const pulse = Math.sin(engine.time * 4) * 0.08 + 1;
            ctx.scale(pulse, pulse);
            ctx.drawImage(baseSprite, -baseSprite.width / 2, -baseSprite.height / 2);
        },
        collider: { type: 'circle', radius: 12 },
        velocity: { x: 0, y: 0 },
        health: 50,
        maxHealth: 50,
        speed: 120,
        damage: 15,
        pathfindCooldown: 0,
        currentPath: [],
        currentWaypoint: 0,
        telegraphTime: 0,
        type: 'rusher',
        tags: ['enemy'],
        stateMachine: stateMachine, // Attach state machine
        
        update(dt) {
            // Update state machine (v2.6 - replaces old ad-hoc logic)
            this.stateMachine.update(this, dt);
        },
        
        takeDamage(amount) {
            this.health -= amount;
            engine.sound.play('hit');
            
            // Damage number
            createDamageNumber(this.x, this.y, amount);
            
            // Hit feedback
            engine.impact(3, { noFlash: true });
            this.flash = 1.0;
            this.scale = 1.15;
            engine.after(0.08, () => {
                this.scale = 1.0;
            });
            
            // Hit effect
            engine.particles.impact(this.x, this.y, '#ff3333', 0.8);
            
            if (this.health <= 0) {
                enemyDeath(this);
            }
        }
    });
    
    return enemy;
}

function createRangedEnemy(x, y, variant = 0) {
    // Visual variety - 3 variants
    const variants = [
        { color: '#ff8800', body: 'hexagon', size: 14 },    // Orange hexagon (default)
        { color: '#ffaa00', body: 'star', size: 13 },       // Yellow star
        { color: '#ff6600', body: 'diamond', size: 12 }     // Red-orange diamond
    ];
    
    const v = variants[variant % variants.length];
    const baseSprite = engine.art.enemy({
        size: v.size,
        color: v.color,
        body: v.body,
        glow: true
    });
    
    const enemy = engine.spawn('enemy', {
        x, y,
        deathColor: v.color, // Store for death effect
        sprite: (ctx, entity) => {
            // Spinning animation
            const spin = engine.time * 2;
            ctx.rotate(spin);
            const pulse = Math.sin(engine.time * 3) * 0.06 + 1;
            ctx.scale(pulse, pulse);
            ctx.drawImage(baseSprite, -baseSprite.width / 2, -baseSprite.height / 2);
        },
        collider: { type: 'circle', radius: 12 },
        velocity: { x: 0, y: 0 },
        health: 35,
        maxHealth: 35,
        speed: 80,
        damage: 10,
        shootCooldown: 0,
        pathfindCooldown: 0,
        currentPath: [],
        currentWaypoint: 0,
        type: 'ranged',
        tags: ['enemy'],
        
        update(dt) {
            this.shootCooldown -= dt;
            this.pathfindCooldown -= dt;
            
            // Attack telegraphing - flash orange before shooting
            if (this.shootCooldown > 0 && this.shootCooldown < 0.4) {
                this.flash = 0.5 * (0.4 - this.shootCooldown) / 0.4;
            }
            
            const player = engine.findOne('player');
            if (!player) return;
            
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Kiting behavior with pathfinding
            let targetX = this.x;
            let targetY = this.y;
            
            if (dist < 150) {
                // Too close - move away
                targetX = this.x - dx;
                targetY = this.y - dy;
            } else if (dist > 300) {
                // Too far - move closer
                targetX = player.x - (dx / dist) * 200;
                targetY = player.y - (dy / dist) * 200;
            } else {
                // Good distance - strafe
                const perpAngle = Math.atan2(dy, dx) + Math.PI / 2;
                targetX = this.x + Math.cos(perpAngle) * 100;
                targetY = this.y + Math.sin(perpAngle) * 100;
            }
            
            // Pathfind to target position
            if (this.pathfindCooldown <= 0 && engine.currentTilemap) {
                this.pathfindCooldown = 0.7;
                this.currentPath = engine.pathfind(
                    { x: this.x, y: this.y },
                    { x: targetX, y: targetY }
                );
                this.currentWaypoint = 0;
            }
            
            // Follow path
            if (this.currentPath && this.currentPath.length > 0) {
                const waypoint = this.currentPath[this.currentWaypoint];
                if (waypoint) {
                    const wpDx = waypoint.x - this.x;
                    const wpDy = waypoint.y - this.y;
                    const wpDist = Math.sqrt(wpDx * wpDx + wpDy * wpDy);
                    
                    if (wpDist < 20) {
                        this.currentWaypoint++;
                    } else {
                        this.velocity.x = (wpDx / wpDist) * this.speed;
                        this.velocity.y = (wpDy / wpDist) * this.speed;
                    }
                }
            } else {
                // Fallback - direct movement
                if (dist < 150) {
                    this.velocity.x = -(dx / dist) * this.speed;
                    this.velocity.y = -(dy / dist) * this.speed;
                } else if (dist > 300) {
                    this.velocity.x = (dx / dist) * this.speed;
                    this.velocity.y = (dy / dist) * this.speed;
                } else {
                    this.velocity.x = -dy / dist * this.speed * 0.5;
                    this.velocity.y = dx / dist * this.speed * 0.5;
                }
            }
            
            this.rotation = Math.atan2(dy, dx);
            
            // Shoot at player
            if (this.shootCooldown <= 0 && dist < 400) {
                this.shootCooldown = 2;
                shootEnemyProjectile(this, player);
            }
        },
        
        takeDamage(amount) {
            this.health -= amount;
            engine.sound.play('hit');
            
            // Damage number
            createDamageNumber(this.x, this.y, amount);
            
            // Hit feedback
            engine.impact(3, { noFlash: true });
            this.flash = 1.0;
            this.scale = 1.15;
            engine.after(0.08, () => {
                this.scale = 1.0;
            });
            
            engine.particles.impact(this.x, this.y, '#ff8800', 0.8);
            
            if (this.health <= 0) {
                enemyDeath(this);
            }
        }
    });
    
    return enemy;
}

function shootEnemyProjectile(enemy, target) {
    const angle = Math.atan2(target.y - enemy.y, target.x - enemy.x);
    const spawnDist = 20;
    const x = enemy.x + Math.cos(angle) * spawnDist;
    const y = enemy.y + Math.sin(angle) * spawnDist;
    
    const bulletSprite = engine.art.particle({
        size: 5,
        color: '#ff3333',
        fade: false
    });
    
    engine.spawn('enemy-bullet', {
        x, y,
        sprite: bulletSprite,
        rotation: angle,
        collider: { type: 'circle', radius: 5 },
        velocity: {
            x: Math.cos(angle) * 250,
            y: Math.sin(angle) * 250
        },
        damage: enemy.damage,
        lifetime: 3,
        tags: ['bullet', 'enemy-bullet'],
        layer: 5,
        
        update(dt) {
            this.lifetime -= dt;
            if (this.lifetime <= 0) {
                engine.destroy(this);
            }
        }
    });
}

function enemyDeath(enemy) {
    game.playerData.kills++;
    
    // Get enemy's color for death effect
    const enemyColor = enemy.deathColor || '#ff3333';
    
    // Create dramatic death animation entity
    engine.spawn('death-effect', {
        x: enemy.x,
        y: enemy.y,
        lifetime: 0.6,
        rotation: enemy.rotation || 0,
        rotationSpeed: engine.random(5, 10) * (Math.random() < 0.5 ? 1 : -1),
        scale: 1,
        alpha: 1,
        baseColor: enemyColor,
        layer: 15,
        tags: ['effect'],
        
        sprite: (ctx, entity) => {
            // Expanding ring effect
            const progress = 1 - (entity.lifetime / 0.6);
            const ringRadius = progress * 40;
            
            ctx.strokeStyle = entity.baseColor;
            ctx.lineWidth = 6 * (1 - progress);
            ctx.globalAlpha = entity.alpha;
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = entity.baseColor;
            
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner glow
            ctx.fillStyle = entity.baseColor;
            ctx.globalAlpha = entity.alpha * 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius * 0.5, 0, Math.PI * 2);
            ctx.fill();
        },
        
        update(dt) {
            this.lifetime -= dt;
            this.rotation += this.rotationSpeed * dt;
            this.scale = 1 + (1 - this.lifetime / 0.6) * 0.5;
            this.alpha = this.lifetime / 0.6;
            
            if (this.lifetime <= 0) {
                engine.destroy(this);
            }
        }
    });
    
    // Explosion particles
    engine.particles.burst(enemy.x, enemy.y, 'fire', 1.5);
    
    engine.sound.play('explode');
    engine.impact(4, { noFlash: true }); // Brief pause on death
    
    // Chance to drop pickup
    const roll = Math.random();
    if (roll < 0.3) {
        createHealthPickup(enemy.x, enemy.y);
    } else if (roll < 0.45) {
        createEnergyPickup(enemy.x, enemy.y);
    } else if (roll < 0.50) {
        createWeaponUpgrade(enemy.x, enemy.y);
    }
    
    engine.destroy(enemy);
}

// ===== PICKUPS =====

function createHealthPickup(x, y) {
    const sprite = engine.art.character({
        size: 10,
        color: '#33ff33',
        body: 'circle',
        glow: true
    });
    
    engine.spawn('health-pickup', {
        x, y,
        sprite,
        collider: { type: 'circle', radius: 12, trigger: true },
        healAmount: 30,
        tags: ['pickup', 'health'],
        layer: -1,
        
        update(dt) {
            // Float animation
            this.y += Math.sin(engine.time * 3) * 0.5;
            this.rotation += dt * 2;
        }
    });
}

function createEnergyPickup(x, y) {
    const sprite = engine.art.character({
        size: 10,
        color: '#3333ff',
        body: 'diamond',
        glow: true
    });
    
    engine.spawn('energy-pickup', {
        x, y,
        sprite,
        collider: { type: 'circle', radius: 12, trigger: true },
        energyAmount: 50,
        tags: ['pickup', 'energy'],
        layer: -1,
        
        update(dt) {
            this.y += Math.sin(engine.time * 3) * 0.5;
            this.rotation += dt * 2;
        }
    });
}

function createWeaponUpgrade(x, y) {
    const sprite = engine.art.character({
        size: 12,
        color: '#ffff00',
        body: 'star',
        glow: true
    });
    
    engine.spawn('weapon-upgrade', {
        x, y,
        sprite,
        collider: { type: 'circle', radius: 15, trigger: true },
        upgradeType: engine.choose(['damage', 'speed', 'energy']),
        tags: ['pickup', 'upgrade'],
        layer: -1,
        
        update(dt) {
            this.y += Math.sin(engine.time * 3) * 0.5;
            this.rotation += dt * 2;
            
            // Pulsing glow effect
            const pulse = Math.sin(engine.time * 5) * 0.5 + 0.5;
            // TODO: Could add sprite alpha/scale pulsing (engine improvement)
        }
    });
}

// ===== DAMAGE NUMBERS =====

function createDamageNumber(x, y, damage) {
    engine.spawn('damage-number', {
        x, y: y - 20,
        lifetime: 1.0,
        damage: Math.round(damage),
        velocity: { x: engine.random(-20, 20), y: -80 },
        tags: ['effect'],
        layer: 100,
        alpha: 1.0,
        
        sprite: (ctx, entity) => {
            ctx.font = 'bold 20px monospace';
            ctx.fillStyle = '#ffff00';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Outline
            ctx.strokeText(entity.damage.toString(), 0, 0);
            // Fill
            ctx.fillText(entity.damage.toString(), 0, 0);
        },
        
        update(dt) {
            this.lifetime -= dt;
            this.alpha = this.lifetime / 1.0;
            this.y += this.velocity.y * dt;
            this.velocity.y += 200 * dt; // Gravity
            
            if (this.lifetime <= 0) {
                engine.destroy(this);
            }
        }
    });
}

// ===== DECORATIONS =====

function createPillar(x, y, color = '#1a1a2e', glowColor = '#00ffcc') {
    engine.spawn('pillar', {
        x, y,
        sprite: (ctx, entity) => {
            const pulse = Math.sin(engine.time * 2 + entity.x * 0.1) * 0.3 + 0.7;
            const size = 32;
            
            // Outer glow
            ctx.shadowBlur = 30 * pulse;
            ctx.shadowColor = glowColor;
            
            // Dark base
            ctx.fillStyle = color;
            ctx.fillRect(-size/2, -size/2, size, size);
            
            // Neon border lines
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 3;
            ctx.globalAlpha = pulse;
            ctx.strokeRect(-size/2 + 2, -size/2 + 2, size - 4, size - 4);
            
            // Inner highlight
            ctx.strokeStyle = engine.art.lightenColor(glowColor, 40);
            ctx.lineWidth = 1;
            ctx.strokeRect(-size/2 + 5, -size/2 + 5, size - 10, size - 10);
            
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        },
        collider: { type: 'aabb', width: 32, height: 32 },
        tags: ['wall', 'solid', 'decoration'],
        layer: -1
    });
}

function createNeonLight(x, y, color = '#00ffcc') {
    engine.spawn('light', {
        x, y,
        sprite: (ctx, entity) => {
            const pulse = Math.sin(engine.time * 5 + entity.x) * 0.4 + 0.6;
            const flicker = Math.random() < 0.95 ? 1 : 0.3; // Occasional flicker
            
            ctx.shadowBlur = 40 * pulse * flicker;
            ctx.shadowColor = color;
            ctx.fillStyle = color;
            ctx.globalAlpha = pulse * flicker;
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        },
        tags: ['decoration'],
        layer: 5
    });
}

function createDebris(x, y) {
    const size = engine.random(8, 16);
    const color = engine.choose(['#0d0d16', '#1a1a2e', '#16162a']);
    const shape = engine.choose(['square', 'diamond', 'triangle']);
    
    engine.spawn('debris', {
        x, y,
        sprite: engine.art.character({
            size: size,
            color: color,
            body: shape
        }),
        rotation: engine.random(0, Math.PI * 2),
        tags: ['decoration'],
        layer: -2
    });
}

// ===== AMBIENT PARTICLES =====

function createAmbientParticleEmitter(x, y, theme = 'cyan') {
    const colors = {
        'cyan': ['#00ffcc', '#00ffff', '#88ffff'],
        'red': ['#ff3333', '#ff6666', '#ff9999'],
        'purple': ['#ff00ff', '#ff66ff', '#cc66ff'],
        'orange': ['#ff8800', '#ffaa00', '#ffcc66']
    };
    
    const emitterColors = colors[theme] || colors['cyan'];
    
    engine.spawn('ambient-emitter', {
        x, y,
        emitTimer: 0,
        emitInterval: engine.random(0.8, 1.5),
        theme: theme,
        tags: ['decoration'],
        layer: 10,
        
        update(dt) {
            this.emitTimer -= dt;
            if (this.emitTimer <= 0) {
                this.emitTimer = this.emitInterval;
                
                // Emit a few particles drifting upward
                engine.particles.emit(this.x, this.y, {
                    count: engine.random(1, 3),
                    color: emitterColors,
                    speed: [5, 20],
                    life: [2, 4],
                    size: [1, 3],
                    gravity: -10 // Float upward
                });
            }
        }
    });
}

// ===== ROOM SYSTEM (v2.6 - Using new engine.room API) =====

// Define all rooms using new room system
function defineRooms() {
    // Room 1 - Starting room
    engine.room('room1', {
        width: 30,
        height: 20,
        tileSize: 32,
        setup: (room, map) => {
            // Decorations - pillars and lights
        createPillar(300, 300, '#1a1a2e', '#00ffcc');
        createPillar(700, 300, '#1a1a2e', '#00ffcc');
        createNeonLight(150, 150, '#00ffcc');
        createNeonLight(850, 150, '#00ffcc');
        createNeonLight(500, 550, '#00ff88');
        
        // Ambient particles
        createAmbientParticleEmitter(200, 200, 'cyan');
        createAmbientParticleEmitter(750, 450, 'cyan');
        createAmbientParticleEmitter(400, 300, 'cyan');
        
        // Scatter debris
        for (let i = 0; i < 15; i++) {
            createDebris(
                engine.random(100, 900),
                engine.random(100, 580)
            );
        }
        
        // Spawn enemies with visual variety
        createMeleeRusher(200, 200, 0);
        createMeleeRusher(600, 400, 1);
        createRangedEnemy(800, 300, 0);
        
    } else if (roomName === 'room2') {
        // Combat room - more intense
        map.room(0, 0, 35, 25, 'floor', 'wall');
        
        // Door back to room1
        map.door(0, 12, 'left');
        createDoorTrigger(0, 12 * 32, 'room1', 'right');
        
        // Door to room3
        map.door(34, 12, 'right');
        createDoorTrigger(34 * 32, 12 * 32, 'room3', 'left');
        
        // More decorations - red theme for combat
        createPillar(350, 250, '#1a1a2e', '#ff3333');
        createPillar(350, 550, '#1a1a2e', '#ff3333');
        createPillar(950, 250, '#1a1a2e', '#ff3333');
        createPillar(950, 550, '#1a1a2e', '#ff3333');
        createNeonLight(200, 200, '#ff3333');
        createNeonLight(1000, 200, '#ff3333');
        createNeonLight(600, 400, '#ff8800');
        createNeonLight(200, 700, '#ff3333');
        createNeonLight(1000, 700, '#ff3333');
        
        // Ambient particles - red theme
        createAmbientParticleEmitter(300, 300, 'red');
        createAmbientParticleEmitter(800, 400, 'orange');
        createAmbientParticleEmitter(550, 650, 'red');
        createAmbientParticleEmitter(200, 500, 'red');
        
        // Debris
        for (let i = 0; i < 20; i++) {
            createDebris(
                engine.random(100, 1050),
                engine.random(100, 750)
            );
        }
        
        // More enemies with variety
        createMeleeRusher(300, 300, 0);
        createMeleeRusher(700, 300, 2);
        createRangedEnemy(500, 500, 1);
        createRangedEnemy(900, 400, 2);
        
    } else if (roomName === 'room3') {
        // Pre-boss room - ominous
        map.room(0, 0, 30, 30, 'floor', 'wall');
        
        // Door back to room2
        map.door(0, 15, 'left');
        createDoorTrigger(0, 15 * 32, 'room2', 'right');
        
        // Door to boss room (ominous purple glow)
        map.door(29, 15, 'right');
        createDoorTrigger(29 * 32, 15 * 32, 'boss-room', 'left');
        
        // Purple/magenta theme for ominous feeling
        createPillar(300, 300, '#1a1a2e', '#ff00ff');
        createPillar(600, 300, '#1a1a2e', '#ff00ff');
        createPillar(300, 700, '#1a1a2e', '#ff00ff');
        createPillar(600, 700, '#1a1a2e', '#ff00ff');
        createNeonLight(450, 450, '#ff00ff');
        createNeonLight(200, 200, '#8800ff');
        createNeonLight(700, 200, '#8800ff');
        createNeonLight(200, 850, '#8800ff');
        createNeonLight(700, 850, '#8800ff');
        
        // Ambient particles - purple theme (ominous)
        createAmbientParticleEmitter(450, 450, 'purple');
        createAmbientParticleEmitter(250, 350, 'purple');
        createAmbientParticleEmitter(650, 750, 'purple');
        createAmbientParticleEmitter(400, 800, 'purple');
        
        // More debris
        for (let i = 0; i < 25; i++) {
            createDebris(
                engine.random(100, 860),
                engine.random(100, 860)
            );
        }
        
        // Mixed enemies with variety
        createMeleeRusher(400, 300, 1);
        createMeleeRusher(400, 600, 2);
        createRangedEnemy(700, 450, 0);
        createRangedEnemy(200, 450, 2);
        
    } else if (roomName === 'boss-room') {
        // Boss arena - dramatic circular arena
        map.room(0, 0, 40, 30, 'floor', 'wall');
        
        // Door back (locked until boss defeated)
        map.door(0, 15, 'left');
        
        // Ring of pillars around boss spawn
        const centerX = 640;
        const centerY = 400;
        const ringRadius = 200;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const px = centerX + Math.cos(angle) * ringRadius;
            const py = centerY + Math.sin(angle) * ringRadius;
            createPillar(px, py, '#0d0d16', '#ff00ff');
        }
        
        // Dramatic purple lights in corners
        createNeonLight(150, 150, '#ff00ff');
        createNeonLight(1150, 150, '#ff00ff');
        createNeonLight(150, 850, '#ff00ff');
        createNeonLight(1150, 850, '#ff00ff');
        
        // Central spotlight for boss
        createNeonLight(centerX, centerY - 150, '#ff00ff');
        
        // Ambient particles - intense purple (boss arena)
        createAmbientParticleEmitter(centerX - 300, centerY, 'purple');
        createAmbientParticleEmitter(centerX + 300, centerY, 'purple');
        createAmbientParticleEmitter(centerX, centerY - 200, 'purple');
        createAmbientParticleEmitter(centerX, centerY + 200, 'purple');
        
        // Less debris - clean arena
        for (let i = 0; i < 10; i++) {
            createDebris(
                engine.random(100, 1180),
                engine.random(100, 860)
            );
        }
        
        // Spawn boss
        createBoss(centerX, centerY);
    }
}

function createDoorTrigger(x, y, targetRoom, spawnSide) {
    engine.spawn('door-trigger', {
        x, y,
        collider: { type: 'circle', radius: 40, trigger: true },
        targetRoom,
        spawnSide,
        tags: ['door'],
        enabled: true
    });
}

function createBoss(x, y) {
    const baseSprite = engine.art.enemy({
        size: 32,
        color: '#ff00ff',
        body: 'star',
        spikes: true,
        glow: true
    });
    
    const boss = engine.spawn('boss', {
        x, y,
        sprite: (ctx, entity) => {
            // Menacing pulsing and rotation
            const pulse = Math.sin(engine.time * 2) * 0.15 + 1;
            const rotation = Math.sin(engine.time * 1.5) * 0.3;
            
            // Extra pulse in phase 2
            if (entity.phase === 2) {
                const fastPulse = Math.sin(engine.time * 8) * 0.08 + 1;
                ctx.scale(fastPulse, fastPulse);
            }
            
            ctx.rotate(rotation);
            ctx.scale(pulse, pulse);
            ctx.drawImage(baseSprite, -baseSprite.width / 2, -baseSprite.height / 2);
        },
        collider: { type: 'circle', radius: 30 },
        velocity: { x: 0, y: 0 },
        health: 300,
        maxHealth: 300,
        speed: 100,
        damage: 25,
        phase: 1,
        attackCooldown: 0,
        specialCooldown: 0,
        tags: ['enemy', 'boss'],
        
        update(dt) {
            this.attackCooldown -= dt;
            this.specialCooldown -= dt;
            
            const player = engine.findOne('player');
            if (!player) return;
            
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            this.rotation = Math.atan2(dy, dx);
            
            // Phase 2 at 50% health
            if (this.health < this.maxHealth / 2 && this.phase === 1) {
                this.phase = 2;
                this.speed = 150;
                engine.cameraShake(15);
                engine.screenFlash('#ff00ff', 0.8, 0.3); // Purple flash for phase change
            }
            
            // Movement pattern - circle player
            const angle = Math.atan2(dy, dx);
            const perpAngle = angle + Math.PI / 2;
            
            if (dist > 200) {
                // Move towards player
                this.velocity.x = Math.cos(angle) * this.speed;
                this.velocity.y = Math.sin(angle) * this.speed;
            } else if (dist < 150) {
                // Move away
                this.velocity.x = -Math.cos(angle) * this.speed;
                this.velocity.y = -Math.sin(angle) * this.speed;
            } else {
                // Circle strafe
                this.velocity.x = Math.cos(perpAngle) * this.speed;
                this.velocity.y = Math.sin(perpAngle) * this.speed;
            }
            
            // Basic attack - shoot projectiles
            if (this.attackCooldown <= 0) {
                this.attackCooldown = this.phase === 1 ? 1.5 : 1;
                
                // Shoot burst
                const burstCount = this.phase === 1 ? 3 : 5;
                for (let i = 0; i < burstCount; i++) {
                    const spreadAngle = angle + (i - Math.floor(burstCount / 2)) * 0.3;
                    shootBossProjectile(this, spreadAngle);
                }
            }
            
            // Special attack - phase 2 only
            if (this.phase === 2 && this.specialCooldown <= 0) {
                this.specialCooldown = 5;
                // Radial burst
                for (let i = 0; i < 12; i++) {
                    const burstAngle = (i / 12) * Math.PI * 2;
                    shootBossProjectile(this, burstAngle);
                }
                engine.sound.play('powerup');
            }
        },
        
        takeDamage(amount) {
            this.health -= amount;
            engine.sound.play('hit_heavy'); // Heavy sound for boss
            
            // Damage number - larger for boss
            const dmgNum = engine.spawn('damage-number', {
                x: this.x,
                y: this.y - 40,
                lifetime: 1.2,
                damage: Math.round(amount),
                velocity: { x: engine.random(-30, 30), y: -100 },
                tags: ['effect'],
                layer: 100,
                alpha: 1.0,
                
                sprite: (ctx, entity) => {
                    ctx.font = 'bold 28px monospace'; // Bigger for boss
                    ctx.fillStyle = '#ff00ff';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 4;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    ctx.strokeText(entity.damage.toString(), 0, 0);
                    ctx.fillText(entity.damage.toString(), 0, 0);
                },
                
                update(dt) {
                    this.lifetime -= dt;
                    this.alpha = this.lifetime / 1.2;
                    this.y += this.velocity.y * dt;
                    this.velocity.y += 200 * dt;
                    
                    if (this.lifetime <= 0) {
                        engine.destroy(this);
                    }
                }
            });
            
            // Boss hit feedback - more dramatic
            engine.impact(5, { flashColor: '#ff00ff' });
            this.flash = 1.2; // Extra bright flash
            this.scale = 1.08;
            engine.after(0.1, () => {
                this.scale = 1.0;
            });
            
            engine.particles.burst(this.x, this.y, 'magic', 1.2);
            
            if (this.health <= 0) {
                bossDeath(this);
            }
        }
    });
    
    return boss;
}

function shootBossProjectile(boss, angle) {
    const spawnDist = 35;
    const x = boss.x + Math.cos(angle) * spawnDist;
    const y = boss.y + Math.sin(angle) * spawnDist;
    
    const bulletSprite = engine.art.particle({
        size: 8,
        color: '#ff00ff',
        fade: false
    });
    
    engine.spawn('boss-bullet', {
        x, y,
        sprite: bulletSprite,
        rotation: angle,
        collider: { type: 'circle', radius: 8 },
        velocity: {
            x: Math.cos(angle) * 300,
            y: Math.sin(angle) * 300
        },
        damage: boss.damage,
        lifetime: 4,
        tags: ['bullet', 'enemy-bullet'],
        layer: 5,
        
        update(dt) {
            this.lifetime -= dt;
            if (this.lifetime <= 0) {
                engine.destroy(this);
            }
            
            // Trail
            if (engine.frame % 2 === 0) {
                engine.particles.emit(this.x, this.y, {
                    count: 1,
                    color: ['#ff00ff'],
                    speed: [0, 10],
                    life: [0.2, 0.3],
                    size: [3, 5]
                });
            }
        }
    });
}

function bossDeath(boss) {
    engine.particles.burst(boss.x, boss.y, 'magic', 2.5);
    
    engine.sound.play('explode');
    engine.impact(10, { flashColor: '#ff00ff' }); // Maximum impact!
    
    engine.destroy(boss);
    
    // Victory!
    engine.after(2, () => {
        engine.goTo('victory', true);
    });
}

// ===== COLLISION HANDLERS =====

function setupCollisions() {
    // Player bullets hit enemies
    engine.onCollision('player-bullet', 'enemy', (bullet, enemy) => {
        if (enemy.takeDamage) {
            enemy.takeDamage(bullet.damage);
        }
        engine.destroy(bullet);
        engine.particles.impact(bullet.x, bullet.y, '#00ffff', 0.8);
    });
    
    // Enemy bullets hit player
    engine.onCollision('enemy-bullet', 'player', (bullet, player) => {
        if (player.takeDamage) {
            player.takeDamage(bullet.damage);
        }
        engine.destroy(bullet);
        engine.particles.impact(bullet.x, bullet.y, '#ff3333', 0.8);
    });
    
    // Player picks up health
    engine.onCollision('player', 'health', (player, pickup) => {
        player.health = Math.min(player.maxHealth, player.health + pickup.healAmount);
        engine.sound.play('pickup');
        
        engine.particles.burst(pickup.x, pickup.y, 'dust', 1.0);
        
        engine.destroy(pickup);
    });
    
    // Player picks up energy
    engine.onCollision('player', 'energy', (player, pickup) => {
        player.energy = Math.min(player.maxEnergy, player.energy + pickup.energyAmount);
        engine.sound.play('pickup');
        
        engine.particles.burst(pickup.x, pickup.y, 'electric', 0.8);
        
        engine.destroy(pickup);
    });
    
    // Player picks up weapon upgrade
    engine.onCollision('player', 'upgrade', (player, pickup) => {
        engine.sound.play('powerup');
        engine.screenFlash('#ffff00', 0.4, 0.3);
        engine.slowMo(0.5, 0.3); // Brief slow-mo for dramatic effect
        
        // Determine upgrade text
        let upgradeText = '';
        
        // Apply upgrade
        if (pickup.upgradeType === 'damage') {
            CONFIG.MELEE_DAMAGE += 10;
            CONFIG.RANGED_DAMAGE += 5;
            game.playerData.upgrades.push('damage');
            upgradeText = 'DAMAGE +';
        } else if (pickup.upgradeType === 'speed') {
            player.speed += 30;
            game.playerData.upgrades.push('speed');
            upgradeText = 'SPEED +';
        } else if (pickup.upgradeType === 'energy') {
            player.maxEnergy += 20;
            player.energy = player.maxEnergy;
            game.playerData.upgrades.push('energy');
            upgradeText = 'ENERGY +';
        }
        
        // Spawn notification
        engine.spawn('upgrade-notification', {
            x: player.x,
            y: player.y - 50,
            text: upgradeText,
            lifetime: 2.0,
            velocity: { x: 0, y: -30 },
            tags: ['effect'],
            layer: 150,
            alpha: 1.0,
            scale: 0.5,
            
            sprite: (ctx, entity) => {
                ctx.font = 'bold 32px monospace';
                ctx.fillStyle = '#ffff00';
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 5;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#ffff00';
                
                ctx.strokeText(entity.text, 0, 0);
                ctx.fillText(entity.text, 0, 0);
            },
            
            update(dt) {
                this.lifetime -= dt;
                this.y += this.velocity.y * dt;
                
                // Scale up then fade
                if (this.lifetime > 1.5) {
                    this.scale = Math.min(1.2, this.scale + dt * 3);
                } else {
                    this.alpha = this.lifetime / 1.5;
                }
                
                if (this.lifetime <= 0) {
                    engine.destroy(this);
                }
            }
        });
        
        engine.particles.burst(pickup.x, pickup.y, 'magic', 1.5);
        
        engine.destroy(pickup);
    });
    
    // Door triggers
    engine.onCollision('player', 'door', (player, door) => {
        if (door.targetRoom) {
            transitionToRoom(door.targetRoom, door.spawnSide);
        }
    });
}

// ===== ROOM TRANSITIONS =====

function transitionToRoom(roomName, spawnSide) {
    // Save player state
    const player = engine.findOne('player');
    if (player) {
        game.playerData.health = player.health;
        game.playerData.energy = player.energy;
    }
    
    // Fade out
    engine.screenFade('#000000', 1, 0.3);
    engine.slowMo(0.5, 0.3); // Slow-mo during transition
    
    // Wait for fade, then switch room
    engine.after(0.3, () => {
        game.currentRoom = roomName;
        
        // Clear current room
        engine.clear();
        engine.ui.clear();
        
        // Create new room
        createRoom(roomName);
        
        // Spawn player at appropriate position based on entry side
        const roomSizes = {
            room1: { w: 30, h: 20 },
            room2: { w: 35, h: 25 },
            room3: { w: 30, h: 22 },
            boss: { w: 40, h: 30 }
        };
        const size = roomSizes[roomName] || { w: 30, h: 20 };
        const roomMidY = (size.h * 32) / 2;
        
        let spawnX, spawnY;
        if (spawnSide === 'left') {
            spawnX = 80;
            spawnY = roomMidY;
        } else if (spawnSide === 'right') {
            spawnX = size.w * 32 - 80;
            spawnY = roomMidY;
        } else {
            spawnX = (size.w * 32) / 2;
            spawnY = roomMidY;
        }
        
        const newPlayer = createPlayer(spawnX, spawnY);
        
        // Snap camera and set bounds
        engine.camera.x = newPlayer.x;
        engine.camera.y = newPlayer.y;
        engine.cameraFollow(newPlayer, 0.1);
        engine.cameraLookahead(80); // Re-enable lookahead after transition
        
        const halfW = engine.canvas.width / 2;
        const halfH = engine.canvas.height / 2;
        engine.camera.bounds = {
            minX: halfW / engine.camera.zoom,
            minY: halfH / engine.camera.zoom,
            maxX: size.w * 32 - halfW / engine.camera.zoom,
            maxY: size.h * 32 - halfH / engine.camera.zoom
        };
        
        // Setup UI
        setupGameUI();
        
        // Fade in
        engine.screenFade('#000000', 0, 0.3);
    });
}

// ===== UI =====

function setupGameUI() {
    const player = engine.findOne('player');
    if (!player) return;
    
    // Health bar
    engine.ui.healthBar(player, {
        x: 50,
        y: 30,
        width: 200,
        height: 20,
        color: '#33ff33',
        bgColor: '#1a1a2e'
    });
    
    // Energy bar
    engine.ui.elements.push({
        type: 'energybar',
        entity: player,
        x: 50,
        y: 60,
        width: 200,
        height: 15,
        color: '#3333ff',
        bgColor: '#1a1a2e'
    });
    
    // Stats text
    engine.ui.elements.push({
        type: 'stats',
        x: 50,
        y: 95
    });
}

// Custom UI rendering (extend UISystem)
const originalUIRender = engine.ui.render;
engine.ui.render = function(ctx) {
    originalUIRender.call(this, ctx);
    
    // Energy bar
    for (let el of this.elements) {
        if (el.type === 'energybar') {
            const percent = Math.max(0, Math.min(1, el.entity.energy / el.entity.maxEnergy));
            
            ctx.fillStyle = el.bgColor;
            ctx.fillRect(el.x, el.y, el.width, el.height);
            
            ctx.fillStyle = el.color;
            ctx.fillRect(el.x, el.y, el.width * percent, el.height);
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(el.x, el.y, el.width, el.height);
        }
        
        if (el.type === 'stats') {
            const player = engine.findOne('player');
            if (player) {
                ctx.font = '14px monospace';
                ctx.fillStyle = '#00ffcc';
                ctx.textAlign = 'left';
                ctx.fillText(`Kills: ${game.playerData.kills}`, el.x, el.y);
                ctx.fillText(`Room: ${game.currentRoom}`, el.x, el.y + 20);
                
                // Upgrades
                if (game.playerData.upgrades.length > 0) {
                    ctx.fillStyle = '#ffff00';
                    ctx.fillText(`Upgrades: ${game.playerData.upgrades.length}`, el.x, el.y + 40);
                }
                
                // Cooldown indicators
                const yOffset = game.playerData.upgrades.length > 0 ? 65 : 45;
                ctx.fillStyle = '#888888';
                if (player.dashCooldown > 0) {
                    ctx.fillText(`Dash: ${player.dashCooldown.toFixed(1)}s`, el.x, el.y + yOffset);
                } else {
                    ctx.fillStyle = '#00ff00';
                    ctx.fillText(`Dash: Ready (SPACE)`, el.x, el.y + yOffset);
                }
            }
        }
    }
    
    // Boss health bar
    const boss = engine.findOne('boss');
    if (boss) {
        const barWidth = 400;
        const barHeight = 30;
        const barX = engine.canvas.width / 2 - barWidth / 2;
        const barY = 30;
        
        const percent = Math.max(0, boss.health / boss.maxHealth);
        
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(barX, barY, barWidth * percent, barHeight);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('BOSS', engine.canvas.width / 2, barY + barHeight / 2 + 6);
    }
};

// ===== GAME OVER / VICTORY =====

function playerDeath() {
    engine.after(1, () => {
        engine.goTo('gameover', true);
    });
}

// ===== SCENES =====

engine.scene('menu', {
    enter() {
        engine.ui.screen('menu', {
            title: 'NEON RONIN',
            subtitle: 'A cyberpunk samurai tale',
            button: {
                text: 'START GAME',
                action: () => {
                    engine.goTo('gameplay', true);
                }
            }
        });
        
        engine.ui.elements.push({
            type: 'text',
            text: 'WASD - Move | SPACE - Dash | Click - Melee | Q - Ranged',
            x: engine.canvas.width / 2,
            y: engine.canvas.height - 100,
            font: '16px monospace',
            color: '#888888',
            align: 'center'
        });
        
        // Load save if exists
        engine.ui.elements.push({
            type: 'text',
            text: 'Press L to Load Save',
            x: engine.canvas.width / 2,
            y: engine.canvas.height - 50,
            font: '14px monospace',
            color: '#00ffcc',
            align: 'center'
        });
    },
    
    update(dt) {
        if (engine.input.keyPressed('l')) {
            if (loadGame()) {
                engine.goTo('gameplay', true);
            }
        }
    }
});

engine.scene('gameplay', {
    enter() {
        // Reset or start new game
        if (!engine.findOne('player')) {
            createRoom(game.currentRoom);
            // Spawn player in room center
            const roomCenters = {
                room1: { x: 480, y: 320 },
                room2: { x: 560, y: 400 },
                room3: { x: 480, y: 320 },
                boss: { x: 640, y: 480 }
            };
            const center = roomCenters[game.currentRoom] || { x: 480, y: 320 };
            const player = createPlayer(center.x, center.y);
            
            // Snap camera to player immediately
            engine.camera.x = player.x;
            engine.camera.y = player.y;
            engine.cameraFollow(player, 0.1);
            engine.cameraLookahead(80); // Look 80px ahead in direction player faces
            
            // Set camera bounds to room dimensions
            const roomSizes = {
                room1: { w: 30, h: 20 },
                room2: { w: 35, h: 25 },
                room3: { w: 30, h: 22 },
                boss: { w: 40, h: 30 }
            };
            const size = roomSizes[game.currentRoom] || { w: 30, h: 20 };
            const halfW = engine.canvas.width / 2;
            const halfH = engine.canvas.height / 2;
            engine.camera.bounds = {
                minX: halfW / engine.camera.zoom,
                minY: halfH / engine.camera.zoom,
                maxX: size.w * 32 - halfW / engine.camera.zoom,
                maxY: size.h * 32 - halfH / engine.camera.zoom
            };
            
            setupGameUI();
            setupCollisions();
        }
    },
    
    update(dt) {
        // Save game (P key)
        if (engine.input.keyPressed('p')) {
            saveGame();
        }
    }
});

engine.scene('gameover', {
    enter() {
        engine.ui.screen('gameover', {
            title: 'DEFEAT',
            subtitle: `Kills: ${game.playerData.kills}`,
            button: {
                text: 'TRY AGAIN',
                action: () => {
                    resetGame();
                    engine.goTo('gameplay', true);
                }
            }
        });
    }
});

engine.scene('victory', {
    enter() {
        engine.ui.screen('victory', {
            title: 'VICTORY!',
            subtitle: `Total Kills: ${game.playerData.kills}`,
            button: {
                text: 'MAIN MENU',
                action: () => {
                    resetGame();
                    engine.goTo('menu', true);
                }
            }
        });
        
        // Clear save on victory
        localStorage.removeItem('neonronin_save');
    }
});

// ===== SAVE/LOAD =====

function saveGame() {
    const player = engine.findOne('player');
    if (!player) return;
    
    const saveData = {
        playerData: {
            health: player.health,
            maxHealth: player.maxHealth,
            energy: player.energy,
            maxEnergy: player.maxEnergy,
            kills: game.playerData.kills
        },
        currentRoom: game.currentRoom,
        timestamp: Date.now()
    };
    
    localStorage.setItem('neonronin_save', JSON.stringify(saveData));
    
    // Visual feedback
    engine.particles.burst(player.x, player.y, 'electric', 1.2);
    
    console.log('Game saved!');
}

function loadGame() {
    const saveJson = localStorage.getItem('neonronin_save');
    if (!saveJson) {
        console.log('No save found');
        return false;
    }
    
    const saveData = JSON.parse(saveJson);
    
    game.playerData = saveData.playerData;
    game.currentRoom = saveData.currentRoom;
    
    console.log('Game loaded!');
    return true;
}

function resetGame() {
    game.currentRoom = 'room1';
    game.playerData = {
        health: CONFIG.PLAYER_MAX_HEALTH,
        maxHealth: CONFIG.PLAYER_MAX_HEALTH,
        energy: CONFIG.PLAYER_MAX_ENERGY,
        maxEnergy: CONFIG.PLAYER_MAX_ENERGY,
        weapon: 'katana',
        upgrades: [],
        kills: 0
    };
}

// ===== START GAME =====

engine.goTo('menu');
engine.start();
