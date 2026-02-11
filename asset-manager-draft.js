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
