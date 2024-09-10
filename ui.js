/**
 * @file ui.js
 * @description This file manages the user interface elements of the game, including layout creation and updates.
 * 
 * Key Functions:
 * - createUILayout(): Generates the main UI structure for the game
 * - updateStatsCard(): Updates the player's statistics display
 * - showMessage(message): Displays temporary messages to the player
 * 
 * UI Components:
 * - Stats Card: Displays player information (e.g., access level)
 * - Map Container: Holds the rendered game map
 * - Increase Access Level Button: Allows manual increase of player's access level
 * 
 * DOM Manipulation:
 * - Creates and modifies elements to build the game interface
 * - Uses setTimeout for temporary message display
 * 
 * Dependencies:
 * - Assumes the existence of a global gameState object
 * - Requires specific DOM elements:
 *   - An element with id 'gameArea'
 *   - An element with id 'gameMessage'
 * 
 * Note: This file exposes its functions to the global scope, allowing other scripts to access them.
 */

function createUILayout() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';  // Clear any previous content

    // Stats Card
    const statsCard = document.createElement('div');
    statsCard.id = 'statsCard';
    statsCard.className = 'card';

    // Map Container
    const mapContainer = document.createElement('div');
    mapContainer.id = 'mapContainer';
    mapContainer.className = 'card';

    // Local Interaction Card (twice as wide as map)
    const localInteractionCard = document.createElement('div');
    localInteractionCard.id = 'localInteractionCard';
    localInteractionCard.className = 'card';
    localInteractionCard.innerHTML = `<h2>Local Interaction</h2>`;

    // Flex container for map, stats, and local interaction
    const flexContainer = document.createElement('div');
    flexContainer.id = 'gameFlexContainer';
    flexContainer.appendChild(statsCard);
    flexContainer.appendChild(mapContainer);
    flexContainer.appendChild(localInteractionCard);  // Add local interaction

    // Global Interaction Card (below the 3 cards)
    const globalInteractionCard = document.createElement('div');
    globalInteractionCard.id = 'globalInteractionCard';
    globalInteractionCard.className = 'card';
    globalInteractionCard.innerHTML = `<h2>Global Interaction</h2>`;

    // Add elements to the game area
    gameArea.appendChild(flexContainer);
    gameArea.appendChild(globalInteractionCard);  // Add global interaction below
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

// Expose the functions to the global scope
window.createUILayout = createUILayout;
window.updateStatsCard = updateStatsCard;
window.showMessage = showMessage;
