let fs = require('fs');

if (fs.existsSync('./user_data.json')) {
    let data = fs.statSync('./user_data.json');

    console.log(`user_data.json has ${data.size} characters`);
} else {
    console.log("Error loading file");
}