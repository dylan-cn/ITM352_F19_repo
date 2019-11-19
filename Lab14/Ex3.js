var express = require('express');
var app = express();
var myParser = require("body-parser");
let data = require('./user_data.json');



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

app.listen(8080, () => console.log(`listening on port 8080`));
