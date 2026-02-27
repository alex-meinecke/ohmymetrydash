const LEVELS = [
    {
        name: "Neon Gateway",
        data: Array(12).fill(null).map((_, row) => 
            row < 9 ? "0".repeat(400) : "1".repeat(400)
        ),
        spikes: generateSpikes(400, [
            { start: 10, end: 12, every: 1 },
            { start: 20, end: 25, every: 2 },
            { start: 35, end: 38, every: 1 },
            { start: 55, end: 60, every: 1 },
            { start: 80, end: 85, every: 2 },
            { start: 100, end: 105, every: 1 },
            { start: 120, end: 125, every: 2 },
            { start: 140, end: 145, every: 1 },
            { start: 160, end: 170, every: 1 },
            { start: 190, end: 195, every: 2 },
            { start: 210, end: 215, every: 1 },
            { start: 230, end: 240, every: 1 },
            { start: 260, end: 265, every: 2 },
            { start: 280, end: 285, every: 1 },
            { start: 300, end: 310, every: 1 },
            { start: 330, end: 335, every: 2 },
            { start: 350, end: 355, every: 1 },
            { start: 370, end: 375, every: 1 },
        ]),
        platforms: [],
        portals: [
            { x: 25, y: 7, toMode: 'ship' },
            { x: 65, y: 7, toMode: 'cube' },
            { x: 100, y: 7, toMode: 'ship' },
            { x: 150, y: 7, toMode: 'cube' },
            { x: 200, y: 7, toMode: 'ship' },
            { x: 250, y: 7, toMode: 'cube' },
            { x: 300, y: 7, toMode: 'ship' },
            { x: 350, y: 7, toMode: 'cube' },
        ],
        endX: 390,
        length: 400
    },
    {
        name: "Cosmic Tunnel",
        data: Array(12).fill(null).map((_, row) => 
            row < 9 ? "0".repeat(420) : "1".repeat(420)
        ),
        spikes: generateSpikes(420, [
            { start: 8, end: 12, every: 1 },
            { start: 22, end: 26, every: 2 },
            { start: 40, end: 45, every: 1 },
            { start: 60, end: 68, every: 2 },
            { start: 85, end: 90, every: 1 },
            { start: 110, end: 115, every: 2 },
            { start: 135, end: 140, every: 1 },
            { start: 160, end: 170, every: 1 },
            { start: 195, end: 200, every: 2 },
            { start: 220, end: 225, every: 1 },
            { start: 250, end: 260, every: 1 },
            { start: 285, end: 290, every: 2 },
            { start: 310, end: 315, every: 1 },
            { start: 340, end: 350, every: 1 },
            { start: 375, end: 380, every: 2 },
            { start: 400, end: 405, every: 1 },
        ]),
        platforms: [],
        portals: [
            { x: 18, y: 7, toMode: 'ship' },
            { x: 55, y: 7, toMode: 'cube' },
            { x: 95, y: 7, toMode: 'ship' },
            { x: 145, y: 7, toMode: 'cube' },
            { x: 185, y: 7, toMode: 'ship' },
            { x: 235, y: 7, toMode: 'cube' },
            { x: 280, y: 7, toMode: 'ship' },
            { x: 330, y: 7, toMode: 'cube' },
            { x: 375, y: 7, toMode: 'ship' },
        ],
        endX: 410,
        length: 420
    }
];

function generateSpikes(length, patterns) {
    const spikes = [];
    const groundY = 8;
    
    for (const pattern of patterns) {
        for (let x = pattern.start; x <= pattern.end; x += pattern.every) {
            if (x < length) {
                spikes.push({ x: x, y: groundY });
            }
        }
    }
    
    return spikes;
}
