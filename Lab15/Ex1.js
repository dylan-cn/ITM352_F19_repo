const express = require('express');
const app = express();
const myParser = require("body-parser");
const data = require('./user_data.json');
const fs = require('fs');
const cookieParser = require('cookie-parser');

app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());
app.use(cookieParser());

app.get('/set_cookie', function (req, res) {
    res.cookie('name', 'Dylan Nakamoto').status(200).send('Saved name cookie');
});

app.get('/use_cookie', function (req, res) {
    const cookie = req.cookies;
    
    if (cookie.name) {
        res.send('Welcome to the Use Cookie page ' + cookie.name);
    } else {
        res.send('Name cookie does not exist...');
    }
    
    
});

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
        <body>
            <div id="bdy">
                <form onsubmit="sendLoginRequest(this); return false;">
                    <input type="text" name="username" size="40" placeholder="enter username" ><br />
                    <input type="password" name="password" size="40" placeholder="enter password"><br />
                    <input type="submit" value="Submit" id="submit">
                </form>
            </div>

            <script>
                async function sendLoginRequest(form) {
                    let userInfo = {
                        username: form.username.value,
                        password: form.password.value
                    };

                    const res = await fetch('/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userInfo)
                    });

                    res.json().then(function (data) {
                        if (data.success) {
                            let element = document.getElementById("bdy");
                            element.innerHTML = "<h1>Thank you for logging in, " + userInfo.username + "</h1>";
                        } else {
                            alert("invalid credentials");
                            form.password.value = '';
                        }
                    });
                }
            </script>
        </body>
    `;
    response.send(str);
});

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not

    // Check user and pass
    let body = request.body;
    let username = body.username.toLowerCase();
    let validUser = false;
    // Check user exists in the object
    if (typeof data[username] != 'undefined') {
        // check user password matches
        if (data[username].password === body.password) {
            validUser = true;
        }
    } 

    if (!validUser) {
        response.status(400).json({
            success: false
        });
    } else {
        response.status(200).json({
            success:true
        });
    }
});

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
        <body>
            <form onsubmit="sendRegisterRequest(this); return false;">
                <input type="text" name="username" size="40" placeholder="enter username" ><br />
                <input type="password" name="password" size="40" placeholder="enter password"><br />
                <input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
                <input type="email" name="email" size="40" placeholder="enter email"><br />
                <input type="submit" value="Submit" id="submit">
            </form>

            <script>
                async function sendRegisterRequest(form) {
                    let userInfo = {
                        username: form.username.value,
                        password: form.password.value,
                        repeat_password: form.repeat_password.value,
                        email: form.email.value
                    };

                    const res = await fetch('/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userInfo)
                    });

                    res.json().then(function (data) {
                        if (data.success) {
                            alert("successful registration");
                            window.location.replace("/login");
                        } else {
                            alert("invalid credentials");
                            form.password.value = '';
                            form.repeat_password.value = '';
                        }
                    });
                }
            </script>
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
        response.status(200).json({
            success: true
        });
    } else {
        response.status(400).json({
            success: false
        });
    }
});


app.listen(8080, () => console.log(`listening on port 8080`));
