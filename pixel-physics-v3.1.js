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
        
        // Simulation grids (typed arrays for performance)
        this.grid = null;              // Uint8Array - material IDs
        this.temperatureGrid = null;   // Float32Array - temperature in °C
        this.lifetimeGrid = null;      // Float32Array - for temporary materials
        
        // Rendering
        this.offscreenCanvas = null;
        this.offscreenCtx = null;
        this.imageData = null;
        
        // Heat visualization
        this.showHeat = false;
        
        // Performance optimizations
        this.dirtyRects = [];
        this.scanDirection = 1; // Alternates between 1 and -1 each frame
        this.heatSources = new Set(); // Track cells near heat for optimization
        
        // Frame counter
        this.frameCount = 0;
        
        // Ambient temperature (°C)
        this.ambientTemp = 20;
        
        // Chemical reaction rules (property-based, not hardcoded materials)
        this.reactionRules = [];
        
        // Register default materials with REAL properties
        this.registerDefaultMaterials();
        this.registerReactionRules();
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
        
        // Initialize all cells to ambient temperature
        for (let i = 0; i < this.temperatureGrid.length; i++) {
            this.temperatureGrid[i] = this.ambientTemp;
        }
        
        // Create offscreen canvas for rendering
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.gridWidth;
        this.offscreenCanvas.height = this.gridHeight;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.imageData = this.offscreenCtx.createImageData(this.gridWidth, this.gridHeight);
        
        this.initialized = true;
        console.log(`[PixelPhysics v3.1] Initialized ${this.gridWidth}x${this.gridHeight} grid (cell size: ${cellSize}px)`);
        console.log('[PixelPhysics v3.1] Property-based emergent physics enabled');
        console.log('[PixelPhysics v3.1] Temperature simulation active');
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
            supportsC combustion: true // Oxygen in air
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
            viscosity: 0.5
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
            immovable: false // ice can slide eventually
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
            alpha: 0.5
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
            liquidForm: 'glass' // melted sand becomes glass!
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
            alpha: 0.3
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
            liquidForm: 'lava'
        });

        // LAVA (molten rock)
        this.material('lava', {
            state: 'liquid',
            density: 3000,
            temperature: 1200,
            meltingPoint: null,
            boilingPoint: 2400,
            ignitionPoint: null,
            thermalConductivity: 1.0,
            specificHeat: 0.84,
            flammability: 0,
            hardness: 0,
            electricConductivity: 0.1,
            pH: 7,
            reactivity: 0.3,
            solubility: null,
            color: ['#ff4400', '#ff6600', '#ff8800', '#ff2200'],
            solidForm: 'obsidian',
            viscosity: 0.9, // very viscous
            ignitesMaterials: true // sets flammable things on fire
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
            liquidForm: 'lava'
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
            cohesion: 0.3
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
            viscosity: 0.9
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
            cohesion: 0.7
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
            metal: true
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
            combustionEnergy: 16 // MJ/kg
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
            combustionEnergy: 24
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
            combustionEnergy: 42
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
            combustionEnergy: 3
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
            heatEmission: 500 // °C per second to neighbors
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
            alpha: 0.6
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
            alpha: 0.3
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
            alpha: 0.25
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
            alpha: 0.3
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
            alpha: 0.3
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
            alpha: 0.7
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
            friction: 0.4
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
            combustionEnergy: 9
        });
    }

    /**
     * Register chemical reaction rules (property-based, not hardcoded!)
     * @private
     */
    registerReactionRules() {
        // Acid + Metal → Hydrogen gas + Salt
        this.reactionRules.push({
            condition: (matA, matB) => {
                return (matA.pH && matA.pH < 3 && matB.metal) ||
                       (matB.pH && matB.pH < 3 && matA.metal);
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                // Produce hydrogen gas
                if (Math.random() < 0.05) {
                    this.grid[idxA] = this.getMaterialId('hydrogen');
                    this.temperatureGrid[idxA] += 10; // exothermic reaction
                }
            }
        });

        // Water + Salt → Saltwater (if we had it, for now just consumes salt)
        // Water + Hot material → Steam
        // These emerge from temperature system

        // Hydrogen + Oxygen + Ignition → Water + EXPLOSION
        this.reactionRules.push({
            condition: (matA, matB) => {
                const hasHydrogen = matA.name === 'hydrogen' || matB.name === 'hydrogen';
                const hasOxygen = (matA.supportsCombustion || matA.name === 'oxygen') ||
                                  (matB.supportsCombustion || matB.name === 'oxygen');
                const hot = (matA.temperature && matA.temperature > 500) ||
                           (matB.temperature && matB.temperature > 500);
                return hasHydrogen && hasOxygen && hot;
            },
            react: (x, y, matA, matB, idxA, idxB) => {
                // BOOM! H₂ + O₂ → H₂O
                if (Math.random() < 0.3) {
                    // Explode
                    const worldX = x * this.cellSize;
                    const worldY = y * this.cellSize;
                    this.explode(worldX, worldY, 30, 100);
                    // Create steam
                    this.grid[idxA] = this.getMaterialId('steam');
                    this.temperatureGrid[idxA] = 100;
                }
            }
        });

        // Melting point reactions (sand → glass when hot enough)
        // These are handled by state transition system
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
     *   heatEmission: 100
     * });
     */
    material(name, props) {
        const id = this.materialIdMap.get(name) || this.nextMaterialId++;
        
        this.materialIdMap.set(name, id);
        this.materials.set(id, {
            id,
            name,
            ...props
        });
        
        return this;
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
     * Simulate one frame of physics
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        if (!this.initialized) return;
        
        this.frameCount++;
        
        // Alternate scan direction each frame to prevent directional bias
        this.scanDirection *= -1;
        
        // First pass: Update temperature and check for state transitions
        this.updateTemperature(dt);
        
        // Second pass: Simulate material physics
        for (let y = this.gridHeight - 1; y >= 0; y--) {
            const xStart = this.scanDirection > 0 ? 0 : this.gridWidth - 1;
            const xEnd = this.scanDirection > 0 ? this.gridWidth : -1;
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
                        continue;
                    }
                }
                
                // Check for ignition (emergent combustion)
                if (mat.ignitionPoint && this.temperatureGrid[idx] >= mat.ignitionPoint) {
                    // Check if there's oxygen/air nearby
                    if (this.hasOxygenNearby(x, y)) {
                        this.igniteMaterial(x, y, mat, idx);
                        continue;
                    }
                }
                
                // Simulate based on state
                if (mat.state === 'powder') {
                    this.simulatePowder(x, y, mat);
                } else if (mat.state === 'liquid') {
                    this.simulateLiquid(x, y, mat);
                } else if (mat.state === 'gas') {
                    this.simulateGas(x, y, mat);
                } else if (mat.state === 'solid') {
                    // Solids mostly don't move
                    // But check for reactions
                    this.checkReactions(x, y, mat, idx);
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
            
            // Add neighbors
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
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
                
                newTemps[idx] -= transfer * 0.25;
                newTemps[nidx] += transfer * 0.25;
                
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
            [x, y - 1], [x, y + 1]
        ];
        
        for (let [nx, ny] of neighbors) {
            if (!this.inBounds(nx, ny)) continue;
            
            const nid = this.grid[this.index(nx, ny)];
            const nmat = this.getMaterial(nid);
            
            if (nmat && (nmat.supportsCombustion || nmat.name === 'oxygen' || nmat.name === 'air')) {
                return true;
            }
        }
        
        return false;
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
     * Check for chemical reactions
     * @private
     */
    checkReactions(x, y, mat, idx) {
        const neighbors = [
            [x - 1, y, this.index(x - 1, y)],
            [x + 1, y, this.index(x + 1, y)],
            [x, y - 1, this.index(x, y - 1)],
            [x, y + 1, this.index(x, y + 1)]
        ];
        
        for (let [nx, ny, nidx] of neighbors) {
            if (!this.inBounds(nx, ny)) continue;
            
            const nid = this.grid[nidx];
            const nmat = this.getMaterial(nid);
            
            if (!nmat || nmat.name === 'air') continue;
            
            // Check all reaction rules
            for (let rule of this.reactionRules) {
                if (rule.condition(mat, nmat)) {
                    rule.react(x, y, mat, nmat, idx, nidx);
                    break;
                }
            }
        }
    }

    /**
     * Simulate powder behavior (sand, dirt, etc.)
     * @private
     */
    simulatePowder(x, y, mat) {
        // Try to fall straight down
        if (this.tryMove(x, y, x, y + 1, mat)) return;
        
        // Try to fall diagonally (with friction)
        const friction = mat.friction || 0.5;
        if (Math.random() > friction) {
            const dir = Math.random() < 0.5 ? -1 : 1;
            if (this.tryMove(x, y, x + dir, y + 1, mat)) return;
            if (this.tryMove(x, y, x - dir, y + 1, mat)) return;
        }
    }

    /**
     * Simulate liquid behavior (water, oil, lava, etc.)
     * @private
     */
    simulateLiquid(x, y, mat) {
        // Try to fall
        if (this.tryMove(x, y, x, y + 1, mat)) return;
        
        // Try to fall diagonally
        const dir = Math.random() < 0.5 ? -1 : 1;
        if (this.tryMove(x, y, x + dir, y + 1, mat)) return;
        if (this.tryMove(x, y, x - dir, y + 1, mat)) return;
        
        // Spread horizontally (with viscosity)
        const viscosity = mat.viscosity || 0.5;
        if (Math.random() > viscosity) {
            const spreadDir = Math.random() < 0.5 ? -1 : 1;
            if (this.tryMove(x, y, x + spreadDir, y, mat)) return;
            if (this.tryMove(x, y, x - spreadDir, y, mat)) return;
        }
    }

    /**
     * Simulate gas behavior (fire, smoke, steam, etc.)
     * @private
     */
    simulateGas(x, y, mat) {
        // Gases rise if density is negative (hot gases)
        // Gases sink if density is positive (CO2)
        const rising = mat.density < 0;
        
        if (rising) {
            // Try to rise
            if (this.tryMove(x, y, x, y - 1, mat)) return;
            
            // Try to rise diagonally
            const dir = Math.random() < 0.5 ? -1 : 1;
            if (this.tryMove(x, y, x + dir, y - 1, mat)) return;
            if (this.tryMove(x, y, x - dir, y - 1, mat)) return;
        } else {
            // Sink (heavy gas like CO2)
            if (this.tryMove(x, y, x, y + 1, mat)) return;
        }
        
        // Spread horizontally
        if (Math.random() < 0.4) {
            const spreadDir = Math.random() < 0.5 ? -1 : 1;
            if (this.tryMove(x, y, x + spreadDir, y, mat)) return;
        }
    }

    /**
     * Try to move a cell from (x1,y1) to (x2,y2)
     * @private
     */
    tryMove(x1, y1, x2, y2, mat) {
        if (!this.inBounds(x2, y2)) return false;
        
        const idx1 = this.index(x1, y1);
        const idx2 = this.index(x2, y2);
        const id2 = this.grid[idx2];
        
        if (id2 === 0) {
            // Empty cell - move there
            this.grid[idx2] = this.grid[idx1];
            this.temperatureGrid[idx2] = this.temperatureGrid[idx1];
            this.lifetimeGrid[idx2] = this.lifetimeGrid[idx1];
            
            this.grid[idx1] = 0;
            this.temperatureGrid[idx1] = this.ambientTemp;
            this.lifetimeGrid[idx1] = 0;
            
            return true;
        }
        
        const mat2 = this.getMaterial(id2);
        if (!mat2) return false;
        
        // Density-based displacement
        if (mat.density > mat2.density) {
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
            
            return true;
        }
        
        return false;
    }

    /**
     * Render the pixel world to the game canvas
     * @param {CanvasRenderingContext2D} ctx - Game canvas context
     * @param {object} camera - Camera object
     */
    render(ctx, camera) {
        if (!this.initialized) return;
        
        // Update image data from grid
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
                    const r = parseInt(hex.slice(0, 2), 16);
                    const g = parseInt(hex.slice(2, 4), 16);
                    const b = parseInt(hex.slice(4, 6), 16);
                    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255;
                    
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
        
        ctx.restore();
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
}
