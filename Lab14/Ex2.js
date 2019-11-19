let fs = require('fs');

if (fs.existsSync('./user_data.json')) {
    let data = fs.readFileSync('./user_data.json', 'utf-8');
    let users_reg_data = JSON.parse(data);
    
    console.log(users_reg_data);
    
    // how to get password info for particular user
    let userPass = users_reg_data.itm352.password;
    console.log("Password for user itm352: " + userPass);
} else {
    console.log("Error loading file");
}