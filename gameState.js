/**
 * @file gameState.js
 * @description This file manages the core game state, including map generation, rendering, and storing game data.
 * 
 * Key Components:
 * - gameState object: Stores all game-related data (map, doors, player info, etc.)
 * - generateMap(): Creates the initial game map and populates door information
 * - renderMap(mapContainer): Renders the current game state to the provided container
 * 
 * Game Elements:
 * - Map: 2D array representing the game world
 * - Doors: Array of door objects with properties like position, access level, and state
 * - Player: Object containing player properties (position, access level, appearance)
 * 
 * Rendering Logic:
 * - Distinguishes between walls, doors, and the player
 * - Applies visual indicators for adjacent doors
 * 
 * Constants:
 * - wallChars: Array of characters representing different wall types
 * 
 * Note: This file exposes the gameState object and key functions to the global scope,
 *       allowing other scripts to access and modify the game state.
 */

const gameState = {
    map: [],
    doors: [],
    rooms: [],
    visitedRooms: new Set(),
    player: {
        x: 2,
        y: 21,
        accessLevel: 0,
        icon: 'π',
        color: 'red'
    }
};

const wallChars = ['║', '═', '╦', '╩', '╠', '╣', '╬'];

function generateMap() {
    gameState.map = [
        "╔════╦═════╦═══════╦═════╦═════╦══════╗",
        "║    ║     ║       ║     ║     ║      ║",
        "║    ║     ║       ║     ║     ║      ║",
        "║    0     2       0     3     1      ║",
        "║    ║     ║       ║     ║     ║      ║",
        "║    ║     ║       ║     ║     ║      ║",
        "╠═0══╩═════╬═══2═══╬══0══╬══1═════════╣",
        "║          ║       ║     ║            ║",
        "║          ║       ║     ║            ║",
        "║          3       1     2            ║",
        "║          ║       ║     ║            ║",
        "║          ║       ║     ║            ║",
        "╠════╦══0══╬═══════╬══3══╬══1══╦══════╣",
        "║    ║     ║       ║     ║     ║      ║",
        "║    ║     ║       ║     ║     ║      ║",
        "║    2     1       0     3     2      ║",
        "║    ║     ║       ║     ║     ║      ║",
        "║    ║     ║       ║     ║     ║      ║",
        "╠═0══╩═════╬══2════╬══0══╬══1══╩══════╣",
        "║          ║       ║     ║            ║",
        "║          ║       ║     ║            ║",
        "║          0       1     2            ║",
        "║          ║       ║     ║            ║",
        "╚══════════╩═══════╩═════╩════════════╝"
    ];

    gameState.doors = [];
    for (let y = 0; y < gameState.map.length; y++) {
        for (let x = 0; x < gameState.map[y].length; x++) {
            const char = gameState.map[y][x];
            if (char >= '0' && char <= '9') {
                const isVertical = (gameState.map[y][x - 1] === ' ' && gameState.map[y][x + 1] === ' ');
                const isHorizontal = (gameState.map[y - 1][x] === ' ' && gameState.map[y + 1][x] === ' ');
                gameState.doors.push({
                    x,
                    y,
                    accessLevel: parseInt(char),
                    isOpen: false,
                    orientation: isVertical ? 'vertical' : 'horizontal'
                });
            }
        }
    }
}

function renderMap(mapContainer) {
    mapContainer.innerHTML = '';
    gameState.map.forEach((row, y) => {
        const rowDiv = document.createElement('div');
        row.split('').forEach((char, x) => {
            const span = document.createElement('span');
            if (x === gameState.player.x && y === gameState.player.y) {
                // Render player
                span.textContent = gameState.player.icon;
                span.style.color = gameState.player.color;
            } else if (char >= '0' && char <= '9') {
                // Render doors
                const door = gameState.doors.find(d => d.x === x && d.y === y);
                
                // Check if player is adjacent to the door
                const isAdjacent = Math.abs(gameState.player.x - x) + Math.abs(gameState.player.y - y) === 1;
                
                span.textContent = door.isOpen ? '·' : (door.orientation === 'vertical' ? '‖' : '=');
                span.classList.add('door');
                if (isAdjacent) {
                    span.classList.add('adjacent'); // Apply adjacent class if adjacent
                } else {
                    span.classList.remove('adjacent'); // Remove the class if not adjacent
                }
            } else {
                // Render walls and other characters
                span.textContent = char;
            }
            rowDiv.appendChild(span);
        });
        mapContainer.appendChild(rowDiv);
    });
}



// Expose the functions and objects to the global scope
window.gameState = gameState;
window.generateMap = generateMap;
window.renderMap = renderMap;
