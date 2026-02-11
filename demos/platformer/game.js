// Platformer - Bud Engine Demo
// Collect coins, avoid spikes, complete 3 levels

const engine = new BudEngine({ 
    width: 1280, 
    height: 720,
    backgroundColor: '#0a0a14',
    gravity: 800 // Enable gravity for platformer
});

let gameState = {
    level: 1,
    coins: 0,
    totalCoins: 0
};

// ===== MENU SCENE =====

engine.scene('menu', {
    enter() {
        engine.ui.screen('menu', {
            title: 'NEON JUMP',
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
        gameState.coins = 0;

        // Create level
        createLevel(gameState.level);

        // Count total coins
        gameState.totalCoins = engine.findByTag('coin').length;

        // Spawn player
        const spawnPoint = engine.findOne('spawn');
        if (!spawnPoint) {
            console.error('[Platformer] No spawn point found! Creating default at (100, 100)');
        }
        const player = engine.spawn('player', {
            x: spawnPoint ? spawnPoint.x : 100,
            y: spawnPoint ? spawnPoint.y : 100,
            sprite: engine.art.character({ 
                body: 'capsule', 
                color: '#00ffcc', 
                size: 18,
                eyes: true,
                glow: true
            }),
            collider: { type: 'aabb', width: 32, height: 48 },
            speed: 250,
            jumpForce: 400,
            velocity: { x: 0, y: 0 },
            grounded: false,
            tags: ['player']
        });

        // Camera follows player
        engine.cameraFollow(player, 0.08);

        // Collision handlers
        engine.onCollision('player', 'platform', (player, platform) => {
            // Simple ground check (player above platform)
            if (player.velocity.y > 0 && player.y < platform.y) {
                player.y = platform.y - 32; // Half of platform height
                player.velocity.y = 0;
                player.grounded = true;
            }
        });

        engine.onCollision('player', 'coin', (player, coin) => {
            gameState.coins++;
            engine.destroy(coin);
            engine.sound.play('pickup');
            engine.particles.emit(coin.x, coin.y, {
                count: 15,
                color: ['#ffcc00', '#ff8800'],
                speed: [80, 180],
                life: [0.4, 0.8],
                size: [3, 6],
                gravity: 200,
                fade: true
            });

            // Check if level complete
            if (gameState.coins >= gameState.totalCoins) {
                setTimeout(() => {
                    if (gameState.level >= 3) {
                        winGame();
                    } else {
                        gameState.level++;
                        engine.goTo('gameplay', true); // Use transition
                    }
                }, 500);
            }
        });

        engine.onCollision('player', 'spike', (player, spike) => {
            // Death - restart level
            gameOver();
        });

        engine.onCollision('player', 'goal', (player, goal) => {
            // Level complete
            if (gameState.coins >= gameState.totalCoins) {
                if (gameState.level >= 3) {
                    winGame();
                } else {
                    gameState.level++;
                    engine.goTo('gameplay', true); // Use transition
                }
            }
        });
    },

    update(dt) {
        const player = engine.findOne('player');
        if (!player) return;

        // Reset grounded flag
        player.grounded = false;

        // Check if standing on platform (using spatial collision)
        const platforms = engine.findByTag('platform');
        for (let platform of platforms) {
            const px = player.x;
            const py = player.y + 24; // Bottom of player
            const pw = 16; // Half width of player collider
            
            const platX = platform.x;
            const platY = platform.y;
            const platW = platform.collider.width / 2;
            const platH = platform.collider.height / 2;

            // Check if player is on top of platform
            if (px + pw > platX - platW && px - pw < platX + platW) {
                if (py >= platY - platH - 2 && py <= platY - platH + 10) {
                    if (player.velocity.y >= 0) {
                        player.y = platY - platH - 24;
                        player.velocity.y = 0;
                        player.grounded = true;
                    }
                }
            }
        }

        // Player movement
        let moveX = 0;
        if (engine.input.key('ArrowLeft') || engine.input.key('a') || engine.input.key('A')) moveX -= 1;
        if (engine.input.key('ArrowRight') || engine.input.key('d') || engine.input.key('D')) moveX += 1;

        player.velocity.x = moveX * player.speed;

        // Jump
        if ((engine.input.keyPressed('ArrowUp') || engine.input.keyPressed(' ') || engine.input.keyPressed('w') || engine.input.keyPressed('W')) && player.grounded) {
            player.velocity.y = -player.jumpForce;
            engine.sound.play('jump');
            engine.particles.emit(player.x, player.y + 20, {
                count: 8,
                color: ['#00ffcc', '#00ff88'],
                speed: [30, 80],
                life: [0.2, 0.4],
                size: [2, 4],
                gravity: 200,
                fade: true
            });
        }

        // Apply velocity (gravity is applied by engine)
        player.x += player.velocity.x * dt;

        // Keep player in bounds (prevent falling forever)
        if (player.y > 2000) {
            gameOver();
        }

        // UI
        engine.ui.clear();
        engine.ui.text(`LEVEL ${gameState.level}`, { 
            x: 20, y: 30, font: 'bold 28px monospace', color: '#ff3333' 
        });
        engine.ui.text(`COINS: ${gameState.coins}/${gameState.totalCoins}`, { 
            x: 20, y: 65, font: '20px monospace', color: '#ffcc00' 
        });
    },

    draw(ctx) {}
});

// ===== GAME OVER SCENE =====

engine.scene('gameover', {
    enter() {
        engine.ui.screen('gameover', {
            title: 'TRY AGAIN',
            subtitle: `Level ${gameState.level}`,
            button: { text: 'RESTART', action: () => engine.goTo('gameplay') }
        });
    },
    update(dt) {},
    draw(ctx) {}
});

// ===== WIN SCENE =====

engine.scene('win', {
    enter() {
        engine.ui.screen('win', {
            title: 'VICTORY!',
            subtitle: 'All levels complete!',
            button: { text: 'PLAY AGAIN', action: () => { gameState.level = 1; engine.goTo('gameplay'); } }
        });
    },
    update(dt) {},
    draw(ctx) {}
});

// ===== LEVEL GENERATION =====

function createLevel(levelNum) {
    if (levelNum === 1) {
        createLevel1();
    } else if (levelNum === 2) {
        createLevel2();
    } else if (levelNum === 3) {
        createLevel3();
    }
}

function createLevel1() {
    // Tutorial level - simple platforms
    
    // Spawn point
    engine.spawn('spawn', { x: 100, y: 300, tags: ['spawn'] });

    // Ground
    createPlatform(0, 500, 400, 40);
    
    // Steps going up
    createPlatform(350, 450, 150, 30);
    createPlatform(450, 400, 150, 30);
    createPlatform(550, 350, 150, 30);
    
    // Upper platform
    createPlatform(700, 250, 300, 40);
    
    // Final platform with goal
    createPlatform(1050, 200, 200, 40);
    
    // Coins
    createCoin(200, 350);
    createCoin(400, 320);
    createCoin(500, 270);
    createCoin(600, 220);
    createCoin(800, 150);
    createCoin(900, 150);
    createCoin(1150, 100);
    
    // Goal
    createGoal(1150, 150);
}

function createLevel2() {
    // Intermediate level - gaps and spikes
    
    engine.spawn('spawn', { x: 100, y: 300, tags: ['spawn'] });

    // Starting platform
    createPlatform(0, 500, 250, 40);
    
    // Gap
    createPlatform(400, 500, 250, 40);
    
    // Spikes on ground
    createSpike(280, 550);
    createSpike(320, 550);
    createSpike(360, 550);
    
    // Floating platforms
    createPlatform(700, 400, 150, 30);
    createPlatform(900, 350, 150, 30);
    createPlatform(1100, 250, 200, 40);
    
    // Elevated platform with coins
    createPlatform(500, 300, 200, 30);
    
    // Coins
    createCoin(150, 350);
    createCoin(500, 350);
    createCoin(600, 200);
    createCoin(750, 300);
    createCoin(950, 250);
    createCoin(1200, 150);
    
    // Goal
    createGoal(1200, 180);
}

function createLevel3() {
    // Advanced level - complex jumps
    
    engine.spawn('spawn', { x: 100, y: 500, tags: ['spawn'] });

    // Starting area
    createPlatform(0, 600, 300, 40);
    
    // Tower of platforms
    createPlatform(350, 550, 120, 30);
    createPlatform(520, 480, 120, 30);
    createPlatform(380, 410, 120, 30);
    createPlatform(550, 340, 120, 30);
    
    // Spikes below
    createSpike(250, 650);
    createSpike(290, 650);
    createSpike(430, 600);
    createSpike(470, 600);
    
    // Upper section
    createPlatform(750, 300, 200, 30);
    createPlatform(1000, 250, 150, 30);
    createPlatform(1200, 350, 150, 30);
    
    // Final platform
    createPlatform(1400, 200, 200, 40);
    
    // Coins (harder to collect)
    createCoin(150, 450);
    createCoin(400, 450);
    createCoin(570, 380);
    createCoin(430, 310);
    createCoin(600, 240);
    createCoin(850, 200);
    createCoin(1075, 150);
    createCoin(1275, 250);
    createCoin(1500, 100);
    
    // Spikes on platforms
    createSpike(800, 270);
    createSpike(1050, 220);
    
    // Goal
    createGoal(1500, 140);
}

// ===== ENTITY CREATION =====

function createPlatform(x, y, width, height) {
    engine.spawn('platform', {
        x: x + width / 2,
        y: y + height / 2,
        sprite: createPlatformSprite(width, height),
        collider: { type: 'aabb', width, height },
        tags: ['platform', 'solid']
    });
}

function createPlatformSprite(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Main body
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // Grid pattern
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.3)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Border
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
    
    return canvas;
}

function createCoin(x, y) {
    engine.spawn('coin', {
        x, y,
        sprite: engine.art.character({ 
            body: 'circle', 
            color: '#ffcc00', 
            size: 12,
            glow: true
        }),
        collider: { type: 'circle', radius: 12 },
        noGravity: true,
        tags: ['coin']
    });
}

function createSpike(x, y) {
    const spike = engine.spawn('spike', {
        x, y,
        sprite: engine.art.enemy({ 
            body: 'triangle', 
            color: '#ff3333', 
            size: 16,
            spikes: true
        }),
        collider: { type: 'circle', radius: 14 },
        noGravity: true,
        tags: ['spike', 'hazard']
    });
    spike.rotation = Math.PI; // Point up
}

function createGoal(x, y) {
    engine.spawn('goal', {
        x, y,
        sprite: engine.art.character({ 
            body: 'star', 
            color: '#00ff88', 
            size: 24,
            glow: true
        }),
        collider: { type: 'circle', radius: 20 },
        noGravity: true,
        tags: ['goal']
    });
}

// ===== GAME FLOW =====

function gameOver() {
    engine.goTo('gameover');
}

function winGame() {
    engine.goTo('win');
}

// ===== AUTOPLAY TEST =====

function runAutoplay() {
    console.log('🤖 Starting platformer autoplay test...');
    gameState.level = 1;
    engine.goTo('gameplay');
    
    setTimeout(() => {
        // Test all 3 levels
        let allLevelsComplete = true;
        
        for (let level = 1; level <= 3; level++) {
            gameState.level = level;
            engine.goTo('gameplay');
            
            // Give bot 60 seconds per level
            const result = testLevel(level, 60);
            console.log(`Level ${level}: ${result.completed ? '✅ COMPLETED' : '❌ FAILED'} (${result.coinsCollected}/${result.totalCoins} coins)`);
            
            if (!result.completed) {
                allLevelsComplete = false;
            }
        }
        
        alert(`Platformer Autoplay Results:\n\n${allLevelsComplete ? '✅ All levels completable!' : '❌ Some levels failed'}\n\nCheck console for details.`);
    }, 1000);
}

function testLevel(levelNum, maxSeconds) {
    gameState.level = levelNum;
    engine.restart();
    
    let completed = false;
    let coinsCollected = 0;
    const totalCoins = gameState.totalCoins;
    
    // Simple AI: move right, jump occasionally
    const maxFrames = maxSeconds * 60;
    for (let frame = 0; frame < maxFrames; frame++) {
        const player = engine.findOne('player');
        if (!player) break;
        
        // Move right
        engine.test.input('ArrowRight', true);
        
        // Jump every 30 frames
        if (frame % 30 === 0) {
            engine.test.input(' ', true);
        } else {
            engine.test.input(' ', false);
        }
        
        engine.test.step(1);
        
        coinsCollected = gameState.coins;
        
        // Check if won
        if (coinsCollected >= totalCoins) {
            completed = true;
            break;
        }
        
        // Check if fell
        if (player.y > 2000) {
            break;
        }
    }
    
    return { completed, coinsCollected, totalCoins };
}

// ===== START GAME =====

engine.goTo('menu');
engine.start();
