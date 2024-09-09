const gameState = {
    map: [],
    doors: [],
    rooms: [],
    visitedRooms: new Set(),
    player: {
        x: 2, // Starting position of the player
        y: 21,
        accessLevel: 0,
        icon: 'π', // Player symbol
        color: 'red' // Player color
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
                const isVertical = (gameState.map[y][x-1] === ' ' && gameState.map[y][x+1] === ' ');
                const isHorizontal = (gameState.map[y-1][x] === ' ' && gameState.map[y+1][x] === ' ');
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

function renderMap() {
    const mapContainer = document.getElementById('mapContainer');
    mapContainer.innerHTML = '';
    gameState.map.forEach((row, y) => {
        const rowDiv = document.createElement('div');
        row.split('').forEach((char, x) => {
            const span = document.createElement('span');

            // Render player
            if (x === gameState.player.x && y === gameState.player.y) {
                span.textContent = gameState.player.icon;
                span.style.color = gameState.player.color; // Player color is red
            } 
            // Render doors and check adjacency
            else if (char >= '0' && char <= '9') {
                const door = gameState.doors.find(d => d.x === x && d.y === y);

                // Use distinct symbols for vertical and horizontal doors
                if (door.isOpen) {
                    span.textContent = '·'; // Open doors
                } else {
                    span.textContent = door.orientation === 'vertical' ? '‖' : '='; // Closed doors
                }

                // Check if the player is adjacent to the door and change to cyan
                if (Math.abs(gameState.player.x - x) + Math.abs(gameState.player.y - y) === 1) {
                    span.style.color = 'cyan'; // Make adjacent doors cyan
                } else {
                    span.classList.add('door'); // Apply default door color (green)
                }
            } else {
                span.textContent = char;
            }

            rowDiv.appendChild(span);
        });
        mapContainer.appendChild(rowDiv);
    });
}


function movePlayer(dx, dy) {
    const newX = gameState.player.x + dx;
    const newY = gameState.player.y + dy;

    // Check if player is moving into a wall
    if (wallChars.includes(gameState.map[newY][newX])) return;

    // Check if player is moving into a closed door
    const door = gameState.doors.find(d => d.x === newX && d.y === newY);
    if (door && !door.isOpen) {
        showMessage("Door is closed. Can't walk through!");
        return;
    }

    // Move player if no collision with walls or closed doors
    gameState.player.x = newX;
    gameState.player.y = newY;
    renderMap();
}

function handleInteraction() {
    const x = gameState.player.x;
    const y = gameState.player.y;

    const door = gameState.doors.find(d => (
        (d.x === x && Math.abs(d.y - y) === 1) || (d.y === y && Math.abs(d.x - x) === 1)
    ));

    if (door) {
        if (gameState.player.accessLevel >= door.accessLevel) {
            door.isOpen = !door.isOpen;
            showMessage(door.isOpen ? "Door opened!" : "Door closed!");
        } else {
            showMessage(`Access denied! Required level: ${door.accessLevel}`);
        }
        renderMap();
    }
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'w':
            movePlayer(0, -1);
            break;
        case 's':
            movePlayer(0, 1);
            break;
        case 'a':
            movePlayer(-1, 0);
            break;
        case 'd':
            movePlayer(1, 0);
            break;
        case 'e':
            handleInteraction();
            break;
    }
}

function createUILayout() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    // Create stats card
    const statsCard = document.createElement('div');
    statsCard.id = 'statsCard';
    statsCard.className = 'card';

    // Create map container
    const mapContainer = document.createElement('div');
    mapContainer.id = 'mapContainer';
    mapContainer.className = 'card';

    // Create flex container for layout
    const flexContainer = document.createElement('div');
    flexContainer.id = 'gameFlexContainer';
    flexContainer.appendChild(statsCard);
    flexContainer.appendChild(mapContainer);

    gameArea.appendChild(flexContainer);
}

function updateStatsCard() {
    const statsCard = document.getElementById('statsCard');
    statsCard.innerHTML = `
        <h2>Stats/Resources</h2>
        <p>Access Level: ${gameState.player.accessLevel}</p>
    `;
}

function showMessage(message) {
    const messageElement = document.getElementById('gameMessage');
    messageElement.textContent = message;
    setTimeout(() => {
        messageElement.textContent = '';
    }, 2000);
}

function increaseAccessLevel() {
    gameState.player.accessLevel++;
    updateStatsCard();
    showMessage(`Access level increased to ${gameState.player.accessLevel}!`);
}

function addAccessLevelButton() {
    const button = document.createElement('button');
    button.textContent = 'Increase Access Level';
    button.addEventListener('click', increaseAccessLevel);
    document.body.appendChild(button);
}

function initGame() {
    generateMap();
    createUILayout();
    renderMap();
    updateStatsCard();

    window.addEventListener('keydown', handleKeyPress);
}

window.addEventListener('load', () => {
    initGame();
    addAccessLevelButton();
});
