# Georgmetry Dash

A Geometry Dash clone built with vanilla JavaScript and HTML5 Canvas. Features a spacy neon visual theme with glowing effects.

## Features

- **Two Game Modes**: Cube and Ship
- **Neon Visual Theme**: Glowing neon borders on black background
- **Starfield Background**: Twinkling stars effect
- **Particle Effects**: Death explosion particles
- **Trail Effect**: Glowing trail behind player
- **Jump Buffering**: Pre-jump input buffering for smoother gameplay
- **Portal System**: Switch between cube and ship modes

## How to Play

### Controls
- **Jump (Cube)**: Space, Arrow Up, W, or Click
- **Fly (Ship)**: Hold Space, Arrow Up, W, or Click

### Gameplay
- Avoid spikes to survive
- Go through **pink portals** to switch to ship mode
- Go through **lime portals** to switch back to cube
- Reach the finish line to complete the level

## Running the Game

Simply open `index.html` in any modern web browser. No server or build process required.

```bash
# Option 1: Open directly
open index.html

# Option 2: Using a local server
npx serve .
# or
python3 -m http.server 8000
```

## Tech Stack

- Vanilla JavaScript (ES6+)
- HTML5 Canvas
- CSS3 with neon effects
- No external dependencies

## Project Structure

```
georgmetrydash/
├── index.html    # Main entry point
├── game.js       # Core game logic
├── levels.js     # Level data and generation
├── style.css     # Styling with neon effects
├── README.md     # This file
└── AGENTS.md     # Developer guidelines
```

## License

MIT
