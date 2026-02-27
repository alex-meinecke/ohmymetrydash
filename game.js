const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 45;
const GRAVITY = 0.8;
const JUMP_FORCE = -14;
const SPEED = 6;
const GROUND_Y = 9;

const SHIP_UP_FORCE = -0.6;
const SHIP_GRAVITY = 0.4;
const SHIP_MAX_RISE = -9;
const SHIP_MAX_FALL = 10;

const COLORS = {
    cyan: '#00ffff',
    magenta: '#ff00ff',
    lime: '#00ff66',
    blue: '#0066ff',
    pink: '#ff0066',
    yellow: '#ffff00'
};

const NEON_COLORS = [COLORS.cyan, COLORS.magenta, COLORS.lime, COLORS.blue, COLORS.pink];

let gameState = 'menu';
let currentLevelIndex = 0;
let cameraX = 0;
let deathParticles = [];
let trail = [];
let stars = [];
let gameMode = 'cube';
let shipRotation = 0;
let shipVY = 0;
let player = {
    x: 100,
    y: 0,
    width: 30,
    height: 30,
    vy: 0,
    rotation: 0,
    onGround: false,
    dead: false
};

let level = null;
let score = 0;
let frameCount = 0;
let jumpHeld = false;
let jumpBuffer = 0;
const JUMP_BUFFER_TIME = 150;

function initStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.7,
            size: Math.random() * 2 + 0.5,
            brightness: Math.random(),
            twinkleSpeed: Math.random() * 0.05 + 0.02
        });
    }
}

function loadLevel(index) {
    if (index >= LEVELS.length) {
        index = 0;
    }
    currentLevelIndex = index;
    level = LEVELS[index];
    player.x = 100;
    player.y = (GROUND_Y - 1) * TILE_SIZE - player.height;
    player.vy = 0;
    player.rotation = 0;
    player.dead = false;
    player.onGround = true;
    cameraX = 0;
    score = 0;
    deathParticles = [];
    trail = [];
    gameMode = 'cube';
    shipRotation = 0;
    shipVY = 0;
}

function resetPlayer() {
    player.x = 100;
    player.y = (GROUND_Y - 1) * TILE_SIZE - player.height;
    player.vy = 0;
    player.rotation = 0;
    player.dead = false;
    player.onGround = true;
    cameraX = 0;
    score = 0;
    deathParticles = [];
    trail = [];
    jumpHeld = false;
    jumpBuffer = 0;
    gameMode = 'cube';
    shipRotation = 0;
    shipVY = 0;
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function update() {
    if (gameState !== 'playing') return;
    
    frameCount++;
    
    if (jumpBuffer > 0) {
        jumpBuffer -= 16.67;
    }
    
    player.x += SPEED;
    
    if (gameMode === 'ship') {
        if (jumpHeld) {
            shipVY += SHIP_UP_FORCE;
            if (shipVY < SHIP_MAX_RISE) shipVY = SHIP_MAX_RISE;
        } else {
            shipVY += SHIP_GRAVITY;
            if (shipVY > SHIP_MAX_FALL) shipVY = SHIP_MAX_FALL;
        }
        
        player.y += shipVY;
        
        const targetRotation = shipVY * 0.05;
        shipRotation += (targetRotation - shipRotation) * 0.2;
        
    } else {
        player.vy += GRAVITY;
        player.y += player.vy;
        
        if (player.vy > 0) {
            player.rotation += 0.15;
        } else if (player.vy < 0) {
            player.rotation -= 0.1;
        }
        
        const groundY = GROUND_Y * TILE_SIZE;
        const playerBottom = player.y + player.height;
        
        player.onGround = false;
        
        if (playerBottom >= groundY) {
            player.y = groundY - player.height;
            player.vy = 0;
            player.onGround = true;
            player.rotation = Math.round(player.rotation / (Math.PI / 2)) * (Math.PI / 2);
            
            if (jumpHeld || jumpBuffer > 0) {
                player.vy = JUMP_FORCE;
                player.onGround = false;
                jumpBuffer = 0;
            }
        }
    }
    
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const playerTileX = Math.floor(playerCenterX / TILE_SIZE);
    const playerTileY = Math.floor(playerCenterY / TILE_SIZE);
    
    if (level.portals) {
        for (const portal of level.portals) {
            if (portal.x === playerTileX) {
                const portalTop = portal.y * TILE_SIZE;
                const portalBottom = portal.y * TILE_SIZE + TILE_SIZE;
                
                if (player.y + player.height > portalTop && player.y < portalBottom) {
                    if (portal.toMode !== gameMode) {
                        gameMode = portal.toMode;
                        
                        if (gameMode === 'ship') {
                            shipVY = 0;
                            shipRotation = 0;
                            player.y = portal.y * TILE_SIZE;
                        } else {
                            player.y = Math.min(player.y, (GROUND_Y - 1) * TILE_SIZE - player.height);
                            player.vy = 0;
                            player.rotation = 0;
                            player.onGround = true;
                        }
                    }
                }
            }
        }
    }
    
    const playerBottom = player.y + player.height;
    const playerTop = player.y;
    
    if (gameMode === 'cube') {
        for (const plat of level.platforms) {
            const platX = plat.x * TILE_SIZE;
            const platY = plat.y * TILE_SIZE;
            const platW = plat.w * TILE_SIZE;
            const platH = plat.h * TILE_SIZE;
            
            if (player.x + player.width > platX && 
                player.x < platX + platW &&
                playerBottom > platY && 
                playerTop < platY + platH) {
                
                if (player.vy > 0 && player.y + player.height - player.vy <= platY + 5) {
                    player.y = platY - player.height;
                    player.vy = 0;
                    player.onGround = true;
                    player.rotation = Math.round(player.rotation / (Math.PI / 2)) * (Math.PI / 2);
                    
                    if (jumpHeld || jumpBuffer > 0) {
                        player.vy = JUMP_FORCE;
                        player.onGround = false;
                        jumpBuffer = 0;
                    }
                }
            }
        }
    }
    
    const collisionSize = gameMode === 'ship' ? 20 : 25;
    
    for (const spike of level.spikes) {
        const spikeX = spike.x * TILE_SIZE + TILE_SIZE / 2;
        const spikeY = spike.y * TILE_SIZE + TILE_SIZE;
        
        const dx = (player.x + player.width / 2) - spikeX;
        const dy = (player.y + player.height / 2) - (spikeY - TILE_SIZE / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < collisionSize) {
            die();
            return;
        }
    }
    
    if (player.x > level.endX * TILE_SIZE) {
        gameState = 'win';
        showScreen('win-screen');
    }
    
    cameraX = player.x - 150;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > (level.length - 20) * TILE_SIZE) cameraX = (level.length - 20) * TILE_SIZE;
    
    score = Math.min(100, Math.floor((player.x / (level.endX * TILE_SIZE)) * 100));
    document.getElementById('score').textContent = score + '%';
    
    if (frameCount % 3 === 0) {
        trail.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            rotation: player.rotation,
            alpha: 1,
            color: NEON_COLORS[currentLevelIndex % NEON_COLORS.length]
        });
    }
    
    for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].alpha -= 0.05;
        if (trail[i].alpha <= 0) {
            trail.splice(i, 1);
        }
    }
}

function die() {
    player.dead = true;
    gameState = 'dead';
    
    for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 / 30) * i + Math.random() * 0.5;
        const speed = Math.random() * 8 + 3;
        deathParticles.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            size: Math.random() * 8 + 4,
            color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)]
        });
    }
    
    showScreen('death-screen');
}

function updateDeathParticles() {
    for (let i = deathParticles.length - 1; i >= 0; i--) {
        const p = deathParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.alpha -= 0.02;
        p.size *= 0.98;
        
        if (p.alpha <= 0) {
            deathParticles.splice(i, 1);
        }
    }
}

function drawStars() {
    for (const star of stars) {
        const twinkle = Math.sin(frameCount * star.twinkleSpeed) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    const offsetX = -cameraX * 0.3 % TILE_SIZE;
    for (let x = offsetX; x < canvas.width; x += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawLevel() {
    const color = NEON_COLORS[currentLevelIndex % NEON_COLORS.length];
    
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, GROUND_Y * TILE_SIZE, canvas.width, canvas.height - GROUND_Y * TILE_SIZE);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y * TILE_SIZE);
    ctx.lineTo(canvas.width, GROUND_Y * TILE_SIZE);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y * TILE_SIZE + 3);
    ctx.lineTo(canvas.width, GROUND_Y * TILE_SIZE + 3);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    if (level.portals) {
        for (const portal of level.portals) {
            const px = portal.x * TILE_SIZE - cameraX;
            const py = portal.y * TILE_SIZE;
            
            if (px < -100 || px > canvas.width + 100) continue;
            
            const portalColor = portal.toMode === 'ship' ? COLORS.magenta : COLORS.lime;
            
            ctx.strokeStyle = portalColor;
            ctx.lineWidth = 4;
            ctx.shadowColor = portalColor;
            ctx.shadowBlur = 25;
            
            ctx.strokeRect(px + 5, py, TILE_SIZE - 10, TILE_SIZE);
            
            ctx.fillStyle = portalColor;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(px + 5, py, TILE_SIZE - 10, TILE_SIZE);
            ctx.globalAlpha = 1;
            
            ctx.shadowBlur = 0;
        }
    }
    
    for (const plat of level.platforms) {
        const x = plat.x * TILE_SIZE - cameraX;
        const y = plat.y * TILE_SIZE;
        const w = plat.w * TILE_SIZE;
        const h = plat.h * TILE_SIZE;
        
        if (x + w < -100 || x > canvas.width + 100) continue;
        
        ctx.fillStyle = '#111111';
        ctx.fillRect(x, y, w, h);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.strokeRect(x, y, w, h);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);
    }
    
    for (const spike of level.spikes) {
        const x = spike.x * TILE_SIZE - cameraX + TILE_SIZE / 2;
        const y = spike.y * TILE_SIZE + TILE_SIZE;
        
        if (x < -50 || x > canvas.width + 50) continue;
        
        ctx.save();
        ctx.translate(x, y);
        
        ctx.beginPath();
        ctx.moveTo(0, -TILE_SIZE);
        ctx.lineTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.closePath();
        
        ctx.fillStyle = '#111111';
        ctx.fill();
        
        ctx.strokeStyle = COLORS.pink;
        ctx.lineWidth = 3;
        ctx.shadowColor = COLORS.pink;
        ctx.shadowBlur = 15;
        ctx.stroke();
        
        ctx.restore();
    }
    
    const endX = level.endX * TILE_SIZE - cameraX;
    if (endX > -50 && endX < canvas.width + 50) {
        ctx.fillStyle = '#111111';
        ctx.fillRect(endX - 10, 0, 20, canvas.height);
        
        ctx.strokeStyle = COLORS.lime;
        ctx.lineWidth = 4;
        ctx.shadowColor = COLORS.lime;
        ctx.shadowBlur = 20;
        
        ctx.beginPath();
        ctx.moveTo(endX, 0);
        ctx.lineTo(endX, canvas.height);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
    }
}

function drawPlayer() {
    if (player.dead) return;
    
    const x = player.x - cameraX;
    const y = player.y;
    const color = NEON_COLORS[currentLevelIndex % NEON_COLORS.length];
    
    for (const t of trail) {
        ctx.save();
        ctx.translate(t.x - cameraX, t.y);
        if (gameMode === 'ship') {
            ctx.rotate(t.rotation + Math.PI / 2);
        } else {
            ctx.rotate(t.rotation);
        }
        ctx.globalAlpha = t.alpha * 0.5;
        ctx.fillStyle = t.color;
        ctx.shadowColor = t.color;
        ctx.shadowBlur = 10;
        if (gameMode === 'ship') {
            ctx.beginPath();
            ctx.moveTo(0, -15);
            ctx.lineTo(-12, 12);
            ctx.lineTo(12, 12);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
        }
        ctx.restore();
    }
    
    ctx.save();
    ctx.translate(x + player.width / 2, y + player.height / 2);
    
    if (gameMode === 'ship') {
        ctx.rotate(shipRotation);
        
        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(-14, 14);
        ctx.lineTo(14, 14);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(-14, 14);
        ctx.lineTo(14, 14);
        ctx.closePath();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 6);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
    } else {
        ctx.rotate(player.rotation);
        
        ctx.fillStyle = '#111111';
        ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.strokeRect(-player.width / 2, -player.height / 2, player.width, player.height);
        
        ctx.fillStyle = color;
        ctx.shadowBlur = 0;
        ctx.fillRect(-player.width / 2 + 5, -player.height / 2 + 5, 8, 8);
        ctx.fillRect(player.width / 2 - 13, -player.height / 2 + 5, 8, 8);
        ctx.fillRect(-player.width / 2 + 5, player.height / 2 - 13, 8, 8);
        ctx.fillRect(player.width / 2 - 13, player.height / 2 - 13, 8, 8);
    }
    
    ctx.restore();
}

function drawDeathParticles() {
    for (const p of deathParticles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function render() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    drawGrid();
    drawLevel();
    drawPlayer();
    drawDeathParticles();
}

function gameLoop() {
    if (gameState === 'playing') {
        update();
    } else if (gameState === 'dead') {
        updateDeathParticles();
    }
    
    render();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    gameState = 'playing';
    resetPlayer();
    showScreen('hud');
    document.getElementById('hud').classList.add('active');
}

function handleInput(e) {
    const isJumpKey = e.type === 'click' || e.type === 'touchstart' || 
                      e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW' ||
                      e.type === 'mousedown';
    
    if (e.type === 'keydown' && !isJumpKey) return;
    if (e.type === 'keydown') e.preventDefault();
    
    if (e.type === 'keydown') {
        jumpHeld = true;
        if (!player.onGround) {
            jumpBuffer = JUMP_BUFFER_TIME;
        }
    }
    
    if (gameState === 'menu') {
        startGame();
    } else if (gameState === 'playing') {
        if (player.onGround) {
            player.vy = JUMP_FORCE;
            player.onGround = false;
        }
    } else if (gameState === 'dead') {
        gameState = 'playing';
        resetPlayer();
        showScreen('hud');
        document.getElementById('hud').classList.add('active');
    } else if (gameState === 'win') {
        currentLevelIndex++;
        if (currentLevelIndex >= LEVELS.length) currentLevelIndex = 0;
        loadLevel(currentLevelIndex);
        startGame();
    }
}

function handleKeyUp(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        jumpHeld = false;
    }
}

document.addEventListener('keydown', handleInput);
document.addEventListener('keyup', handleKeyUp);
canvas.addEventListener('click', handleInput);
canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleInput(e);
});

initStars();
loadLevel(0);
showScreen('menu-screen');
gameLoop();
