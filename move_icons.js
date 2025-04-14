const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
if (!fs.existsSync('icons')) {
    fs.mkdirSync('icons');
}

// Move icons to the icons directory
['16', '48', '128'].forEach(size => {
    const iconName = `icon${size}.png`;
    if (fs.existsSync(iconName)) {
        fs.renameSync(iconName, path.join('icons', iconName));
        console.log(`Moved ${iconName} to icons directory`);
    }
});

console.log('Icon movement complete!'); 