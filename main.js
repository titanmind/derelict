/**
 * @file main.js
 * @description This file serves as the entry point for the game, initializing core components and setting up event listeners.
 * 
 * Key Functions:
 * - initGame(): Initializes the game by performing the following actions:
 *   1. Generates the game map
 *   2. Creates the UI layout
 *   3. Renders the initial map
 *   4. Updates the stats card
 *   5. Sets up the keydown event listener for player input
 * 
 * Event Listeners:
 * - 'load': Calls initGame() when the window finishes loading
 * - 'keydown': Set up in initGame() to handle player movement and interactions
 * 
 * Dependencies:
 * - Assumes the existence of functions from other files:
 *   - generateMap() (likely from gameState.js)
 *   - createUILayout() (likely from ui.js)
 *   - renderMap() (likely from gameState.js)
 *   - updateStatsCard() (likely from ui.js)
 *   - handleKeyPress() (likely from player.js)
 * 
 * Note: This file acts as the central coordinator, bringing together 
 *       functionality from various parts of the game.
 */

function initGame() {
    generateMap();  // This should initialize the map
    createUILayout();  // This creates the layout for the game
    renderMap(document.getElementById('mapContainer'));  // Ensure the map is rendered after layout creation
    updateStatsCard();
    window.addEventListener('keydown', handleKeyPress);
}

window.addEventListener('load', initGame);
