# AGENTS.md - Georgmetry Dash

## Project Overview

A Geometry Dash clone built with vanilla JavaScript and HTML5 Canvas. No build tools or dependencies required - runs directly in the browser.

## File Structure

```
georgmetrydash/
├── index.html    # Main HTML entry point
├── game.js       # Core game logic (~600 lines)
├── levels.js     # Level data and generation
├── style.css     # CSS styling with neon effects
└── (no build tools needed)
```

## Build / Run Commands

### Running the Game
Simply open `index.html` in a web browser. No server required.
```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Use a simple HTTP server (optional)
npx serve .
# or
python3 -m http.server 8000
```

### No Linting or Testing
This project has no linting or testing frameworks configured.

## Code Style Guidelines

### General Principles
- Vanilla JavaScript (ES6+) with no external dependencies
- HTML5 Canvas for all rendering
- Single-file structure for game logic (game.js)

### Naming Conventions
- **Variables**: camelCase (e.g., `gameState`, `playerX`, `jumpBuffer`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `TILE_SIZE`, `GRAVITY`, `SHIP_GRAVITY`)
- **Functions**: camelCase, verb-based (e.g., `update()`, `drawPlayer()`, `handleInput()`)
- **Objects/Arrays**: Descriptive singular names (e.g., `player`, `level`, `spikes`)

### Code Structure (game.js)

```javascript
// 1. Constants and Configuration
const TILE_SIZE = 45;
const GRAVITY = 0.8;

// 2. Game State Variables
let gameState = 'menu';
let player = { ... };

// 3. Initialization Functions
function initStars() { }
function loadLevel(index) { }
function resetPlayer() { }

// 4. Core Game Loop
function update() { }      // Physics, collision, logic
function render() { }      // Drawing to canvas

// 5. Helper Functions
function drawPlayer() { }
function drawLevel() { }
function die() { }

// 6. Event Handlers
function handleInput(e) { }

// 7. Entry Point
initStars();
loadLevel(0);
gameLoop();
```

### Formatting Rules
- Use 4 spaces for indentation
- Opening brace on same line (`function update() {`)
- One space after keywords: `if (condition) {`
- No semicolons at end of blocks
- Use template literals for string interpolation: `` `value: ${x}` ``
- Maximum line length: ~100 characters (soft limit)

### Constants Organization
Group related constants together:
```javascript
// Physics
const GRAVITY = 0.8;
const JUMP_FORCE = -14;
const SPEED = 6;

// Ship physics
const SHIP_UP_FORCE = -0.6;
const SHIP_GRAVITY = 0.4;

// Colors
const COLORS = { ... };
const NEON_COLORS = [ ... ];
```

### Canvas Rendering
- Use `ctx.save()` / `ctx.restore()` for transformations
- Use `requestAnimationFrame` for game loop
- Clear canvas each frame with `ctx.fillRect`
- Use `shadowBlur` and `shadowColor` for neon glow effects

### Input Handling
- Support multiple input methods: keyboard (Space, ArrowUp, W), mouse click, touch
- Use event.preventDefault() to avoid page scrolling on space/arrow keys
- Handle both keydown and keyup for held-button mechanics

### Error Handling
- No formal error handling needed for this simple project
- Use `console.log` for debugging
- Validate array bounds when accessing level data

### Comment Guidelines
- No comments unless requested by user
- Complex logic may use inline comments sparingly
- Document game mechanics in comments only if non-obvious

### Levels.js Structure
- Use helper functions for procedural generation (e.g., `generateSpikes()`)
- Keep level data declarative and readable
- Use consistent tile-based coordinate system

## Important Implementation Details

### Game Loop
- Runs at 60 FPS using `requestAnimationFrame`
- `update()` called before `render()` each frame
- Frame timing: ~16.67ms (1000/60)

### Coordinate System
- Tile-based: `TILE_SIZE = 45` pixels
- Player X increases as player moves right
- Camera follows player with offset
- Ground at row 9 (GROUND_Y = 9)

### Collision Detection
- Circle-based for spikes (distance check)
- Rectangle-based for platforms
- Portal detection uses tile coordinates

### Game Modes
- `'cube'`: Jump-based movement with gravity and rotation
- `'ship'`: Hold-to-fly movement with vertical thrust

## Agent Workflow

When working on this codebase:
1. Read relevant files before making changes
2. Use `node --check <filename>` to validate JavaScript syntax
3. Test changes by opening index.html in browser
4. Keep modifications focused and minimal
5. Follow existing code patterns and naming conventions
