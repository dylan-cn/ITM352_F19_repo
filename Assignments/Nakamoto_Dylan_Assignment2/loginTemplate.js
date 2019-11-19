
module.exports = {
    // creates the page for the invoice page
    createLogin: function (data) {
        let htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Login or Register</title>
                <link rel='stylesheet' type='text/css' href='/css/app.css'>
                <link rel='stylesheet' type='text/css' href='/css/navbar.css'>
                <link rel='stylesheet' type='text/css' href='/css/login.css'>
            </head>
            <body>
                <ul class='navbar'>
                    <li><a href='/'>Home</a></li>
                    <li><a href='store'>Store</a></li>
                </ul>
                <div class="container">
                    <h1>Please login or register...</h1>
                    <div class="flex-break"></div>
                    !!form!!
                </div>

            <script>
                // Validate the form data before sending to server
                async function validation(obj) {
                    // disable the login button while processing
                    obj.disabled = true;

                    // get form
                    const form = document.getElementById('loginForm');
                    // get all inputs of form
                    const inputs = form.elements;

                    let userInfo = {};
                    // check each input
                    for (let i = 0; i < inputs.length; i++) {
                        if (inputs[i].name !== 'login-btn') {
                            userInfo[inputs[i].name] = inputs[i].value;
                        }
                    }

                    // Do client side username and password validation here

                    let validSubmission = false;
                    let response = '';
                    // send a post to server
                    await sendLoginRequest(userInfo).then(function (data) {
                        console.log(data);
                        if (data.success) {
                            validSubmission = true;
                        } else {
                            validSubmission = false;
                            response = data.msg;
                        }
                    });

                    // send to checkout if valid
                    // ** Submit the form **
                    if (validSubmission) {
                        alert('Successful login');
                        document.getElementById('productsForm').submit();
                    } else {
                        alert('Invalid login: ' + response);
                    }

                    // enable login button after we finish
                    obj.disabled = false;
                }

                async function sendLoginRequest(userInfo) {
                    const res = await fetch('/processLogin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userInfo)
                    });

                    return await res.json();
                }

                // show login handler
                function loginHandler() {
                    let loginForm = document.getElementById("loginD");
                    loginForm.style.display = 'block';

                    let registerForm = document.getElementById("registerD");
                    registerForm.style.display = 'none';
                }

                // show register handler
                function registerHandler() {
                    let loginForm = document.getElementById("loginD");
                    loginForm.style.display = 'none';

                    let registerForm = document.getElementById("registerD");
                    registerForm.style.display = 'block';
                }

                // send request to server to register user
                async function registerUser(obj) {
                    // disable the login button while processing
                    obj.disabled = true;

                    // get form
                    const form = document.getElementById('registerForm');
                    // get all inputs of form
                    const inputs = form.elements;

                    let userInfo = {};
                    // check each input
                    for (let i = 0; i < inputs.length; i++) {
                        if (inputs[i].id !== 'ITEM') {
                            userInfo[inputs[i].name] = inputs[i].value;
                        }
                    }

                    // Do client side password, email validation here

                    let validSubmission = false;
                    let response = '';
                    // send a post to server
                    await sendRegisterRequest(userInfo).then(function (data) {
                        console.log(data);
                        if (data.success) {
                            validSubmission = true;
                        } else {
                            validSubmission = false;
                            response = data.msg;
                        }
                    });

                    // send to checkout if valid
                    // ** Submit the form **
                    if (validSubmission) {
                        alert('Successful created account');
                        
                        document.getElementById('productsForm').submit();
                    } else {
                        alert('Could not create account: ' + response);
                    }

                    // enable login button after we finish
                    obj.disabled = false;
                }

                async function sendRegisterRequest(userInfo) {
                    const res = await fetch('/processRegister', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userInfo)
                    });

                    return await res.json();
                }
            </script>
            </body>
            </html>
        `;

        let formLogin = `
            <div id='loginD' class="form" style="display: block; border: 1px solid black;">
                <div style='margin: 10px 10px 10px 10px;'>
                    <h2>Sign in...</h2>
                    <form id='loginForm'>
                        <input id="username" name='username' type='text' placeholder="Username"></input>
                        <input id="password" name='password' type='password' placeholder="Password"></input>

                        <!-- Login submit button -->
                        <input name='login-btn' class='login-btn btn' type='button' value='Login' onclick="validation(this);">
                    </form>

                    Don't have an account?
                    <input style="margin: 5px 5px 5px 5px;" name='register-btn' class='btn small' type='button' value='Register' onclick="registerHandler();">

                </div>
            </div>
        `;

        let formRegister = `
            <div id='registerD' class="form" style="display: none; border: 1px solid black;">
                <div style='margin: 10px 10px 10px 10px;'>
                    <h2>Register...</h2>
                    <form id='registerForm'>
                        <input name='username' type='text' placeholder="Username"></input>

                        <input name='password' type='password' placeholder="Password"></input>

                        <input name='passwordConfirm' type='password' placeholder="Retype Password"></input>

                        <input name='email' type='text' placeholder="E-mail"></input>

                        <!-- Register submit button -->
                        <input name='register-btn' class='register-btn btn' type='button' value='Register' onclick="registerUser(this);">
                    </form>

                    Already have an account?
                    <input style="margin: 5px 5px 5px 5px;" name='login-btn' class='btn small' type='button' value='Login' onclick="loginHandler();">

                </div>
            </div>
        `;

        // put products in its own hidden form to submit without unneccessary data
        let formProducts = `
            <form style='display: none; margin-top: 10px;' id='productsForm' method="POST" action='/checkout'>
                !!inputs!!
            </form>
        `;

        let inputs = ``;
        for (let elem in data) {
            if (data[elem] !== 0 && data[elem] !== '') {
                inputs += `<input id='ITEM' type='hidden' name="${elem}" value=${data[elem]}>`;
            }
        }

        let formIn = formLogin + formRegister + formProducts.replace('!!inputs!!', inputs);
        let res = htmlTemplate.replace('!!form!!', formIn);

        // return the page
        return res;
    }
};
