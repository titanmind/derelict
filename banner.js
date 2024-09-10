/**
 * @file banner.js
 * @description This file creates an animated space banner using HTML5 Canvas.
 * 
 * Key Features:
 * - Creates a starry background with twinkling stars
 * - Generates shooting stars that move across the canvas
 * - Renders a large planet with multiple orbiting moons
 * 
 * Classes:
 * - Star: Represents a single star in the background
 * - ShootingStar: Creates and animates shooting stars
 * - Planet: Renders the main planet in the scene
 * - Moon: Creates and animates moons orbiting the planet
 * 
 * Main Functions:
 * - resizeCanvas(): Ensures the canvas is properly sized
 * - animate(): Main animation loop that updates and draws all elements
 * 
 * Event Listeners:
 * - 'resize': Calls resizeCanvas() to maintain proper canvas dimensions
 * 
 * Note: This script assumes the existence of a canvas element with id 'spaceBanner'
 *       in the HTML document.
 */

const canvas = document.getElementById('spaceBanner');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = 1200;
    canvas.height = 300;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Shutter properties
let shutterY = -canvas.height; // Initial position (hidden above canvas)
let shutterSpeed = 10; // Speed of shutter movement
let isShutterClosing = false; // Controls the shutter's state (closing or opening)
let isShutterOpening = false;
const shutterHeight = canvas.height; // Full height of the shutter

// Function to close the shutter (animate from top to bottom)
function closeShutter() {
    isShutterClosing = true;
    isShutterOpening = false;
}

// Function to open the shutter (animate from bottom to top)
function openShutter() {
    isShutterOpening = true;
    isShutterClosing = false;
}

function drawShutter() {
    if (isShutterClosing && shutterY < 0) {
        shutterY += shutterSpeed; // Move shutter down
        if (shutterY >= 0) {
            shutterY = 0; // Stop when it covers the banner
            isShutterClosing = false; // Stop animation
        }
    } else if (isShutterOpening && shutterY > -shutterHeight) {
        shutterY -= shutterSpeed; // Move shutter up
        if (shutterY <= -shutterHeight) {
            shutterY = -shutterHeight; // Fully open
            isShutterOpening = false; // Stop animation
        }
    }

    // Draw metallic gradient for the shutter
    const gradient = ctx.createLinearGradient(0, shutterY, 0, shutterY + shutterHeight);
    gradient.addColorStop(0, '#777'); // Lighter grey at the top
    gradient.addColorStop(0.5, '#555'); // Darker grey in the middle
    gradient.addColorStop(1, '#333'); // Even darker grey at the bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, shutterY, canvas.width, shutterHeight); // Draw shutter with gradient

    // Add horizontal struts (industrial look)
    const strutHeight = 20;
    const numberOfStruts = 5;
    const strutSpacing = shutterHeight / numberOfStruts;

    for (let i = 0; i < numberOfStruts; i++) {
        const yPosition = shutterY + (i * strutSpacing);
        ctx.fillStyle = '#444'; // Slightly darker grey for struts
        ctx.fillRect(0, yPosition, canvas.width, strutHeight);
    }

    // Add rivets/bolts across the shutter
    const numberOfRivetsX = 10; // Number of rivets across width
    const numberOfRivetsY = 6;  // Number of rivets across height
    const rivetRadius = 4;

    for (let i = 0; i < numberOfRivetsX; i++) {
        for (let j = 0; j < numberOfRivetsY; j++) {
            const xPosition = (i + 1) * (canvas.width / (numberOfRivetsX + 1));
            const yPosition = shutterY + (j + 1) * (shutterHeight / (numberOfRivetsY + 1));

            // Draw rivet
            ctx.beginPath();
            ctx.arc(xPosition, yPosition, rivetRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#222'; // Dark grey for rivet
            ctx.fill();
            ctx.strokeStyle = '#000'; // Black border for rivet
            ctx.stroke();
        }
    }
}

window.closeShutter = closeShutter;
window.openShutter = openShutter;

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() < 0.05 ? 'red' : (Math.random() < 0.15 ? 'blue' : 'white');
        this.twinkleSpeed = Math.random() * 0.05 + 0.01;
        this.brightness = Math.random() * Math.PI * 2;
    }

    draw() {
        const alpha = 0.5 + Math.sin(this.brightness) * 0.5;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
        this.brightness += this.twinkleSpeed;
    }
}

class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() < 0.5 ? 0 : canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 80 + 10;
        this.speed = Math.random() * 3 + 1;
        this.angle = Math.atan2(
            canvas.height - this.y,
            (this.x === 0 ? canvas.width : 0) - this.x
        );
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        
        let gradient = ctx.createLinearGradient(
            this.x, this.y,
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        
        ctx.lineTo(
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        ctx.stroke();

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
}

class Planet {
    constructor() {
        this.x = canvas.width - 100;
        this.y = canvas.height - 25;
        this.radius = 100;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, '#aa5522');
        gradient.addColorStop(1, '#442211');
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

class Moon {
    constructor(mass, orbitalRadius, color) {
        this.mass = mass;
        this.orbitalRadius = orbitalRadius;
        this.color = color;
        
        this.radius = Math.pow(mass / (4/3 * Math.PI), 1/3) * 5;
        
        const k = 1000;
        const orbitalPeriod = Math.sqrt(k * Math.pow(orbitalRadius, 3));
        
        this.angularVelocity = 20 * (2 * Math.PI) / orbitalPeriod;
        
        this.angle = Math.random() * Math.PI * 2;
        this.x = 0;
        this.y = 0;
        this.lastX = 0;
    }

    update() {
        this.lastX = this.x;
        this.x = planet.x + Math.cos(this.angle) * this.orbitalRadius;
        this.y = planet.y + Math.sin(this.angle) * this.orbitalRadius * 0.3;
        
        this.angle += this.angularVelocity;

        return this.x > this.lastX;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, this.getDarkerShade(this.color));
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    getDarkerShade(color) {
        let r = parseInt(color.slice(1, 3), 16);
        let g = parseInt(color.slice(3, 5), 16);
        let b = parseInt(color.slice(5, 7), 16);
        
        r = Math.max(0, r - 100);
        g = Math.max(0, g - 100);
        b = Math.max(0, b - 100);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}

const stars = Array(100).fill().map(() => new Star());
const shootingStars = Array(2).fill().map(() => new ShootingStar());
const planet = new Planet();

const moons = [
    new Moon(10, 150, '#CCCCCC'),
    new Moon(5, 200, '#FFD700'),
    new Moon(20, 250, '#8A9A5B'),
    new Moon(2, 120, '#ADD8E6'),
    new Moon(200, 150, '#EEEEEE'),
    new Moon(15, 350, '#FF0000')
];

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => star.draw());
    shootingStars.forEach(star => star.draw());

    const moonMovingRight = moons.map(moon => moon.update());

    moons.forEach((moon, index) => {
        if (moonMovingRight[index]) {
            moon.draw();
        }
    });

    planet.draw();

    moons.forEach((moon, index) => {
        if (!moonMovingRight[index]) {
            moon.draw();
        }
    });

    drawShutter();

    requestAnimationFrame(animate);
}

animate();