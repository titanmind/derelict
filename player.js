/**
 * @file player.js
 * @description This file handles player-related functionality, including movement, interactions, and input handling.
 * 
 * Key Functions:
 * - movePlayer(dx, dy): Moves the player by the specified delta if the move is valid
 * - handleInteraction(): Manages player interactions with doors
 * - handleKeyPress(event): Processes keyboard input for player actions
 * 
 * Player Actions:
 * - Movement: WASD keys for up, down, left, right
 * - Interaction: 'e' key for interacting with doors
 * 
 * Game Mechanics:
 * - Collision detection with walls
 * - Door interaction based on player's access level
 * - Opening and closing of doors
 * 
 * Dependencies:
 * - Assumes the existence of a global gameState object
 * - Uses functions from other files:
 *   - renderMap() (likely from gameState.js)
 *   - showMessage() (likely from ui.js)
 * 
 * Note: This file exposes its functions to the global scope, allowing other scripts to access them.
 */

function movePlayer(dx, dy) {
    const newX = gameState.player.x + dx;
    const newY = gameState.player.y + dy;

    if (wallChars.includes(gameState.map[newY][newX])) return;

    const door = gameState.doors.find(d => d.x === newX && d.y === newY);
    if (door && !door.isOpen) {
        showMessage("Door is closed. Can't walk through!");
        return;
    }

    gameState.player.x = newX;
    gameState.player.y = newY;
    renderMap(document.getElementById('mapContainer'));
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
        renderMap(document.getElementById('mapContainer'));
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
        case 'f':  // Add case for 'f' key press
            if (isShutterClosing || shutterY === 0) {
                openShutter();  // Open shutter if it's closed or closing
            } else {
                closeShutter();  // Close shutter if it's open or not closing
            }
            break;
    }
}

// Expose the functions to the global scope
window.movePlayer = movePlayer;
window.handleInteraction = handleInteraction;
window.handleKeyPress = handleKeyPress;
