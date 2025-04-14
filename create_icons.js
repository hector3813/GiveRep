const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
if (!fs.existsSync('icons')) {
    fs.mkdirSync('icons');
}

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Set background
    ctx.fillStyle = '#1DA1F2'; // Twitter blue
    ctx.fillRect(0, 0, size, size);
    
    // Draw magnifying glass
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = size * 0.1;
    
    // Draw circle
    const centerX = size * 0.4;
    const centerY = size * 0.4;
    const radius = size * 0.25;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    
    // Draw handle
    ctx.moveTo(centerX + radius * Math.cos(45 * Math.PI / 180), 
               centerY + radius * Math.sin(45 * Math.PI / 180));
    ctx.lineTo(size * 0.75, size * 0.75);
    
    ctx.stroke();
    
    // Draw "Aa" text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.2}px Arial`;
    ctx.fillText('Aa', size * 0.55, size * 0.4);
    
    // Save the icon
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join('icons', `icon${size}.png`), buffer);
    console.log(`Created icon${size}.png`);
}

// Generate icons for all sizes
[16, 48, 128].forEach(size => drawIcon(size));

console.log('All icons have been created!'); 