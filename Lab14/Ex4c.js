var express = require('express');
var app = express();
var myParser = require("body-parser");
let data = require('./user_data.json');
let fs = require('fs');

app.use(myParser.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
        <body>
            <form action="" method="POST">
                <input type="text" name="username" size="40" placeholder="enter username" ><br />
                <input type="password" name="password" size="40" placeholder="enter password"><br />
                <input type="submit" value="Submit" id="submit">
            </form>
        </body>
    `;
    response.send(str);
});

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not

    // Check user and pass
    let body = request.body;
    let username = body.username.toLowerCase();

    // Check user exists in the object
    if (typeof data[username] != 'undefined') {
        // check user password matches
        if (data[username].password === body.password) {
            response.send(`
                <body>
                    <h1 align="center">Thank you for logging in, ${data[username].name}
                </body>
            `);
        }
    } else {
        response.status(400).redirect('/login');
    }
});

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
        <body>
            <form action="" method="POST">
                <input type="text" name="username" size="40" placeholder="enter username" ><br />
                <input type="password" name="password" size="40" placeholder="enter password"><br />
                <input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
                <input type="email" name="email" size="40" placeholder="enter email"><br />
                <input type="submit" value="Submit" id="submit">
            </form>
        </body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    let req = request.body;
    let created = false;

    let username = req.username;

    // check username does not exist already
    if (typeof data[username] === 'undefined') {
        // check password matches
        if (req.password === req.repeat_password) {
            data[username] = {
                name: username,
                password: req.password,
                email: req.email
            };

            // Write to the file
            try {
                fs.writeFileSync('./user_data.json', JSON.stringify(data));
                created = true;
            } catch (e) {
                created = false;
            }
        }
    } else {
        created = false;
    }

    if (created) {
        response.redirect('/login');
    } else {
        response.redirect('/register');
    }
});


app.listen(8080, () => console.log(`listening on port 8080`));
