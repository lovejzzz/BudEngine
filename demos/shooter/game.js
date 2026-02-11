// Top-Down Shooter - Bud Engine Demo
// Survive waves of enemies in a 5-room dungeon

const engine = new BudEngine({ 
    width: 1280, 
    height: 720,
    backgroundColor: '#0a0a14'
});

let gameState = {
    wave: 0,
    score: 0,
    kills: 0,
    nextWaveTimer: 0,
    waveAnnouncementTimer: 0
};

// ===== MENU SCENE =====

engine.scene('menu', {
    enter() {
        engine.ui.screen('menu', {
            title: 'NEON DUNGEON',
            subtitle: 'Click to Start',
            button: { text: 'START GAME', action: () => engine.goTo('gameplay') }
        });
    },
    update(dt) {},
    draw(ctx) {}
});

// ===== GAMEPLAY SCENE =====

engine.scene('gameplay', {
    enter() {
        // Reset state
        gameState = {
            wave: 1,
            score: 0,
            kills: 0,
            nextWaveTimer: 3
        };

        // Create dungeon
        createDungeon();

        // Spawn player
        const player = engine.spawn('player', {
            x: 160,
            y: 160,
            sprite: engine.art.character({ 
                body: 'circle', 
                color: '#00ffcc', 
                size: 20,
                eyes: true,
                glow: true
            }),
            collider: { type: 'circle', radius: 16 },
            health: 100,
            maxHealth: 100,
            speed: 250,
            baseSpeed: 250,
            speedBoostTime: 0,
            shootCooldown: 0,
            damageCooldown: 0,
            score: 0,
            tags: ['player', 'friendly']
        });

        // Camera follows player
        engine.cameraFollow(player, 0.1);

        // Spawn first wave
        setTimeout(() => spawnWave(), 3000);

        // Collision handlers
        engine.onCollision('bullet', 'enemy', (bullet, enemy) => {
            enemy.health -= 25;
            engine.particles.emit(enemy.x, enemy.y, {
                count: 10,
                color: ['#ff3333', '#ff6666', '#ff8800'],
                speed: [50, 150],
                life: [0.3, 0.6],
                size: [2, 5],
                fade: true
            });
            engine.sound.play('hit');
            engine.destroy(bullet);

            if (enemy.health <= 0) {
                const enemyX = enemy.x;
                const enemyY = enemy.y;
                const isBomber = enemy.type === 'bomber';
                
                engine.destroy(enemy);
                gameState.score += 10;
                gameState.kills++;
                player.score = gameState.score;
                
                engine.particles.emit(enemyX, enemyY, {
                    count: 30,
                    color: ['#ff3333', '#ff8800', '#ffcc00'],
                    speed: [100, 250],
                    life: [0.5, 1.2],
                    size: [3, 8],
                    fade: true
                });
                engine.sound.play('explode');
                engine.cameraShake(5);

                // Bomber explodes into projectiles
                if (isBomber) {
                    for (let i = 0; i < 8; i++) {
                        const angle = (i / 8) * Math.PI * 2;
                        const speed = 200;
                        shootEnemyBulletAngle(enemyX, enemyY, angle, speed);
                    }
                }

                // Chance to spawn pickups
                const rand = Math.random();
                if (rand < 0.15) {
                    spawnHealthPickup(enemyX, enemyY);
                } else if (rand < 0.25) {
                    spawnSpeedPickup(enemyX, enemyY);
                }
            }
        });

        engine.onCollision('player', 'enemy', (player, enemy) => {
            if (!player.damageCooldown || player.damageCooldown <= 0) {
                player.health -= 15;
                player.damageCooldown = 1.0; // 1 second invincibility
                engine.cameraShake(10);
                engine.sound.play('hurt');
                if (player.health <= 0) {
                    gameOver();
                }
            }
        });

        engine.onCollision('player', 'pickup', (player, pickup) => {
            player.health = Math.min(player.maxHealth, player.health + 30);
            engine.destroy(pickup);
            engine.sound.play('pickup');
            engine.particles.emit(pickup.x, pickup.y, {
                count: 20,
                color: ['#00ffcc', '#00ff88'],
                speed: [80, 200],
                life: [0.4, 0.8],
                size: [2, 6],
                fade: true
            });
        });

        engine.onCollision('player', 'speed-pickup', (player, pickup) => {
            player.speed = 350; // Boost speed
            player.speedBoostTime = 5; // 5 seconds
            engine.destroy(pickup);
            engine.sound.play('powerup');
            engine.particles.emit(pickup.x, pickup.y, {
                count: 25,
                color: ['#ffcc00', '#ff8800', '#ffff00'],
                speed: [100, 250],
                life: [0.5, 1.0],
                size: [3, 7],
                fade: true
            });
        });

        engine.onCollision('bullet', 'wall', (bullet, wall) => {
            engine.destroy(bullet);
            engine.particles.emit(bullet.x, bullet.y, {
                count: 5,
                color: ['#888888', '#aaaaaa'],
                speed: [30, 80],
                life: [0.2, 0.4],
                size: [2, 4],
                fade: true
            });
        });

        engine.onCollision('enemy-bullet', 'player', (bullet, player) => {
            player.health -= 10;
            engine.destroy(bullet);
            engine.sound.play('hurt');
            engine.cameraShake(8);
            
            if (player.health <= 0) {
                gameOver();
            }
        });

        engine.onCollision('enemy-bullet', 'wall', (bullet, wall) => {
            engine.destroy(bullet);
        });
    },

    update(dt) {
        const player = engine.findOne('player');
        if (!player) return;

        // Damage cooldown
        if (player.damageCooldown > 0) {
            player.damageCooldown -= dt;
        }

        // Speed boost timer
        if (player.speedBoostTime > 0) {
            player.speedBoostTime -= dt;
            if (player.speedBoostTime <= 0) {
                player.speed = player.baseSpeed; // Reset to normal speed
            }
        }

        // Player movement
        let moveX = 0;
        let moveY = 0;
        if (engine.input.key('w') || engine.input.key('W')) moveY -= 1;
        if (engine.input.key('s') || engine.input.key('S')) moveY += 1;
        if (engine.input.key('a') || engine.input.key('A')) moveX -= 1;
        if (engine.input.key('d') || engine.input.key('D')) moveX += 1;

        if (moveX !== 0 || moveY !== 0) {
            const len = Math.sqrt(moveX * moveX + moveY * moveY);
            moveX /= len;
            moveY /= len;
            player.x += moveX * player.speed * dt;
            player.y += moveY * player.speed * dt;

            // Leave trail particles when moving
            if (engine.frame % 3 === 0) {
                engine.particles.emit(player.x, player.y, {
                    count: 2,
                    color: ['#00ffcc', '#00ff88'],
                    speed: [20, 40],
                    life: [0.3, 0.5],
                    size: [2, 4],
                    fade: true
                });
            }
        }

        // Player shooting
        player.shootCooldown -= dt;
        if (engine.input.mouseDown && player.shootCooldown <= 0) {
            shootBullet(player, engine.input.mouseWorld.x, engine.input.mouseWorld.y);
            player.shootCooldown = 0.15;
        }

        // Update enemies
        const enemies = engine.findByTag('enemy');
        for (let enemy of enemies) {
            if (enemy.type === 'patrol-drone') {
                updatePatrolDrone(enemy, player, dt);
            } else if (enemy.type === 'chaser') {
                updateChaser(enemy, player, dt);
            } else if (enemy.type === 'turret') {
                updateTurret(enemy, player, dt);
            } else if (enemy.type === 'bomber') {
                updateBomber(enemy, player, dt);
            }
        }

        // Check for next wave
        if (enemies.length === 0) {
            gameState.nextWaveTimer -= dt;
            if (gameState.nextWaveTimer <= 0) {
                gameState.wave++;
                gameState.nextWaveTimer = 3;
                gameState.waveAnnouncementTimer = 2; // Show announcement for 2 seconds
                spawnWave();
            }
        }

        // Update wave announcement timer
        if (gameState.waveAnnouncementTimer > 0) {
            gameState.waveAnnouncementTimer -= dt;
        }

        // UI
        engine.ui.clear();
        engine.ui.healthBar(player, { x: 20, y: 20, width: 300, height: 25 });
        engine.ui.text(`WAVE: ${gameState.wave}`, { 
            x: 1260, y: 30, align: 'right', font: 'bold 24px monospace', color: '#ff3333' 
        });
        engine.ui.text(`SCORE: ${gameState.score}`, { 
            x: 1260, y: 60, align: 'right', font: '20px monospace', color: '#00ffcc' 
        });
        engine.ui.text(`KILLS: ${gameState.kills}`, { 
            x: 1260, y: 85, align: 'right', font: '16px monospace', color: '#888888' 
        });

        // Speed boost indicator
        if (player.speedBoostTime > 0) {
            engine.ui.text(`⚡ SPEED BOOST: ${Math.ceil(player.speedBoostTime)}s`, {
                x: 20, y: 55, font: 'bold 18px monospace', color: '#ffcc00'
            });
        }

        if (enemies.length === 0 && gameState.nextWaveTimer > 0) {
            engine.ui.text(`Next wave in ${Math.ceil(gameState.nextWaveTimer)}...`, {
                x: 640, y: 360, align: 'center', font: 'bold 32px monospace', color: '#ffcc00'
            });
        }

        // Wave announcement
        if (gameState.waveAnnouncementTimer > 0) {
            const alpha = Math.min(1, gameState.waveAnnouncementTimer);
            const scale = 1 + (2 - gameState.waveAnnouncementTimer) * 0.5;
            const fontSize = Math.floor(64 * scale);
            engine.ui.text(`WAVE ${gameState.wave}`, {
                x: 640, y: 300, align: 'center', 
                font: `bold ${fontSize}px monospace`, 
                color: `rgba(255, 51, 51, ${alpha})`
            });
        }
    },

    draw(ctx) {}
});

// ===== GAME OVER SCENE =====

engine.scene('gameover', {
    enter() {
        engine.ui.screen('gameover', {
            title: 'SYSTEM FAILURE',
            subtitle: `Wave ${gameState.wave} | Score: ${gameState.score}`,
            button: { text: 'RESTART', action: () => engine.goTo('gameplay') }
        });
    },
    update(dt) {},
    draw(ctx) {}
});

// ===== DUNGEON GENERATION =====

function createDungeon() {
    const map = engine.tilemap(32);
    
    // Room 1 (starting room) - center
    map.room(0, 0, 15, 12, 'floor', 'wall');
    
    // Room 2 - north
    map.room(0, -15, 12, 10, 'floor', 'wall');
    map.door(6, -3, 'north'); // Connect to room 1
    
    // Room 3 - east
    map.room(15, 0, 13, 10, 'floor', 'wall');
    map.door(15, 5, 'east'); // Connect to room 1
    
    // Room 4 - south
    map.room(2, 12, 11, 12, 'floor', 'wall');
    map.door(7, 12, 'south'); // Connect to room 1
    
    // Room 5 - west
    map.room(-12, -2, 10, 13, 'floor', 'wall');
    map.door(-2, 5, 'west'); // Connect to room 1
}

// ===== WAVE SPAWNING =====

function spawnWave() {
    const wave = gameState.wave;
    const spawnPoints = [
        { x: 400, y: -300 },   // North room
        { x: 700, y: 200 },    // East room
        { x: 300, y: 500 },    // South room
        { x: -200, y: 200 }    // West room
    ];

    // Spawn patrol drones
    const droneCount = Math.min(1 + wave, 6);
    for (let i = 0; i < droneCount; i++) {
        const pos = engine.choose(spawnPoints);
        spawnPatrolDrone(pos.x + engine.random(-50, 50), pos.y + engine.random(-50, 50));
    }

    // Spawn chasers (from wave 2)
    if (wave >= 2) {
        const chaserCount = Math.min(wave - 1, 5);
        for (let i = 0; i < chaserCount; i++) {
            const pos = engine.choose(spawnPoints);
            spawnChaser(pos.x + engine.random(-50, 50), pos.y + engine.random(-50, 50));
        }
    }

    // Spawn turrets (from wave 3)
    if (wave >= 3) {
        const turretCount = Math.min(wave - 2, 4);
        for (let i = 0; i < turretCount; i++) {
            const pos = engine.choose(spawnPoints);
            spawnTurret(pos.x + engine.random(-80, 80), pos.y + engine.random(-80, 80));
        }
    }

    // Spawn bombers (from wave 4)
    if (wave >= 4) {
        const bomberCount = Math.min(wave - 3, 3);
        for (let i = 0; i < bomberCount; i++) {
            const pos = engine.choose(spawnPoints);
            spawnBomber(pos.x + engine.random(-60, 60), pos.y + engine.random(-60, 60));
        }
    }

    engine.sound.play('powerup');
}

// ===== ENEMY TYPES =====

function spawnPatrolDrone(x, y) {
    const drone = engine.spawn('patrol-drone', {
        x, y,
        sprite: engine.art.enemy({ 
            body: 'diamond', 
            color: '#ff3333', 
            size: 16 
        }),
        collider: { type: 'circle', radius: 14 },
        health: 50,
        speed: 120,
        patrolAngle: Math.random() * Math.PI * 2,
        tags: ['enemy']
    });
}

function spawnChaser(x, y) {
    const chaser = engine.spawn('chaser', {
        x, y,
        sprite: engine.art.enemy({ 
            body: 'triangle', 
            color: '#ff8800', 
            size: 18,
            spikes: true
        }),
        collider: { type: 'circle', radius: 16 },
        health: 75,
        speed: 180,
        tags: ['enemy']
    });
}

function spawnTurret(x, y) {
    const turret = engine.spawn('turret', {
        x, y,
        sprite: engine.art.enemy({ 
            body: 'hexagon', 
            color: '#8833ff', 
            size: 20 
        }),
        collider: { type: 'circle', radius: 18 },
        health: 100,
        speed: 0,
        shootCooldown: 2,
        tags: ['enemy']
    });
}

function spawnBomber(x, y) {
    const bomber = engine.spawn('bomber', {
        x, y,
        sprite: engine.art.enemy({ 
            body: 'circle', 
            color: '#ff00ff', 
            size: 22,
            glow: true
        }),
        collider: { type: 'circle', radius: 20 },
        health: 150,
        speed: 80,
        tags: ['enemy']
    });
}

// ===== ENEMY AI =====

function updatePatrolDrone(enemy, player, dt) {
    // Patrol in circles
    enemy.patrolAngle += dt * 2;
    enemy.x += Math.cos(enemy.patrolAngle) * enemy.speed * dt;
    enemy.y += Math.sin(enemy.patrolAngle) * enemy.speed * dt;
}

function updateChaser(enemy, player, dt) {
    // Chase player
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
        enemy.x += (dx / dist) * enemy.speed * dt;
        enemy.y += (dy / dist) * enemy.speed * dt;
    }
}

function updateTurret(enemy, player, dt) {
    // Shoot at player
    enemy.shootCooldown -= dt;
    if (enemy.shootCooldown <= 0) {
        shootEnemyBullet(enemy, player.x, player.y);
        enemy.shootCooldown = 2.5;
    }
}

function updateBomber(enemy, player, dt) {
    // Move slowly toward player
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
        enemy.x += (dx / dist) * enemy.speed * dt;
        enemy.y += (dy / dist) * enemy.speed * dt;
    }
}

// ===== SHOOTING =====

function shootBullet(player, targetX, targetY) {
    const dx = targetX - player.x;
    const dy = targetY - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist === 0) return;

    const bullet = engine.spawn('bullet', {
        x: player.x,
        y: player.y,
        velocity: { x: (dx / dist) * 600, y: (dy / dist) * 600 },
        sprite: engine.art.particle({ color: '#00ffcc', size: 4 }),
        collider: { type: 'circle', radius: 4 },
        tags: ['bullet', 'friendly'],
        layer: 1
    });

    // Auto-destroy after 2 seconds
    setTimeout(() => {
        if (engine.entities.includes(bullet)) {
            engine.destroy(bullet);
        }
    }, 2000);

    engine.sound.play('shoot');
}

function shootEnemyBullet(enemy, targetX, targetY) {
    const dx = targetX - enemy.x;
    const dy = targetY - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist === 0) return;

    const bullet = engine.spawn('enemy-bullet', {
        x: enemy.x,
        y: enemy.y,
        velocity: { x: (dx / dist) * 300, y: (dy / dist) * 300 },
        sprite: engine.art.particle({ color: '#ff3333', size: 5 }),
        collider: { type: 'circle', radius: 5 },
        tags: ['enemy-bullet'],
        layer: 1
    });

    setTimeout(() => {
        if (engine.entities.includes(bullet)) {
            engine.destroy(bullet);
        }
    }, 3000);

    engine.sound.play('shoot');
}

function shootEnemyBulletAngle(x, y, angle, speed) {
    const bullet = engine.spawn('enemy-bullet', {
        x, y,
        velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        sprite: engine.art.particle({ color: '#ff00ff', size: 6 }),
        collider: { type: 'circle', radius: 6 },
        tags: ['enemy-bullet'],
        layer: 1
    });

    setTimeout(() => {
        if (engine.entities.includes(bullet)) {
            engine.destroy(bullet);
        }
    }, 3000);
}

// ===== PICKUPS =====

function spawnHealthPickup(x, y) {
    engine.spawn('pickup', {
        x, y,
        sprite: engine.art.character({ 
            body: 'star', 
            color: '#00ff88', 
            size: 12,
            glow: true
        }),
        collider: { type: 'circle', radius: 10 },
        tags: ['pickup']
    });
}

function spawnSpeedPickup(x, y) {
    engine.spawn('speed-pickup', {
        x, y,
        sprite: engine.art.character({ 
            body: 'star', 
            color: '#ffcc00', 
            size: 14,
            glow: true
        }),
        collider: { type: 'circle', radius: 10 },
        tags: ['speed-pickup']
    });
}

// ===== GAME OVER =====

function gameOver() {
    engine.goTo('gameover');
}

// ===== AUTOPLAY TEST =====

function runAutoplay() {
    console.log('🤖 Starting autoplay test...');
    engine.goTo('gameplay');
    
    setTimeout(() => {
        const results = engine.test.autoplay({
            strategy: 'survive',
            duration: 60,
            runs: 10,
            report: true
        });
        
        alert(`Autoplay Results:\n\nAvg Survival: ${results.avgSurvival.toFixed(1)}s\nDeaths: ${results.deaths}/10\nAvg Score: ${results.avgScore.toFixed(0)}\n\n${results.avgSurvival >= 30 ? '✅ PASSED (30s+ target)' : '❌ FAILED (below 30s target)'}`);
    }, 1000);
}

// ===== START GAME =====

engine.goTo('menu');
engine.start();
