
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
                    obj.registerBtn.disabled = true;

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

                    // Client side validation
                    let validation = validateRegistration(obj);

                    // if does not pass validation, just exit function
                    if (validation) {
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
                    } else {
                        console.log("bad submission");
                    }
                    

                    // enable login button after we finish
                    obj.registerBtn.disabled = false;
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
                
                // Check username, password, passwordConfirm, email, name
                function validateRegistration(input) {
                    let inputForm = input;
                    let errors = [];
                
                    let nameErr = document.getElementById("_nameError");
                    let passwordErr = document.getElementById("_passwordError");
                    let usernameErr = document.getElementById("_usernameError");
                    let emailErr = document.getElementById("_emailError");
                    
                    // check username
                    // 4-10chars
                    // only letter and numbers
                    let usernameRegex = /^[a-zA-Z0-9]*$/;
                    let username = inputForm.username.value;
                    if (username.length < 4 || username.length > 10 || !usernameRegex.test(username)) {
                        errors.push('Invalid username: Username must be 4-10 characters in length and can only contain letters and numbers.');
                
                        usernameErr.style.display = "block";
                        usernameErr.innerHTML = 'Username must be 4-10 characters in length and can only contain letters and numbers.';
                    } else {
                        usernameErr.style.display = "none";
                        usernameErr.innerHTML = '';
                    }
                
                    // Check password: min 6 characters
                    let password = inputForm.password.value;
                    let passwordConfirm = inputForm.passwordConfirm.value;
                    if (password !== passwordConfirm) {
                        errors.push('Invalid password: Passwords do not match.');
                        passwordErr.style.display = "block";
                        passwordErr.innerHTML = 'Passwords do not match.';
                    } else {
                        if (password.length < 6) {
                            errors.push('Invalid password: Password length must be 6 or greater');
                            passwordErr.style.display = "block";
                            passwordErr.innerHTML = 'Password length must be 6 or greater';
                        } else {
                            passwordErr.style.display = "none";
                            passwordErr.innerHTML = '';
                        }
                    }
                
                    let emailRegex = ${/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/};
                    // check email
                    if (!emailRegex.test(inputForm.email.value)) {
                        console.log("passed email");
                        errors.push('Invalid email: ' + inputForm.email.validationMessage);
                        emailErr.style.display = 'block';
                        emailErr.innerHTML = 'Email is not valid.';
                    } else {
                        emailErr.style.display = 'none';
                        emailErr.innerHTML = '';
                    }
                
                    // Check name: letters only and less than or equal to 30 characters
                    let nameRegex = /^[a-zA-Z ]*$/;
                    let name = inputForm.name.value;
                    if (name.length <= 0 || name.length > 30 || !nameRegex.test(name)) {
                        errors.push('Invalid name: Your name must be at max 30 characters and can only contain letters');
                        nameErr.style.display = 'block';
                        nameErr.innerHTML = 'Your name must be at max 30 characters and can only contain letters';
                    } else {
                        nameErr.style.display = 'none';
                        nameErr.innerHTML = '';
                    }
                
                    if (errors.length > 0 ) {
                        // write errors
                        let errorDiv = "<ul>!!replace!!</ul>";
                
                        let lis = '';
                        errors.map(function(error) {
                            let h = '<li>' + error + '</li>';
                            lis += h;
                        });
                
                        let final = errorDiv.replace("!!replace!!", lis);
                
                        let errorSection = document.getElementById("registerErrors");
                        //errorSection.style.display = 'block';
                        errorSection.innerHTML = final;
                        return false;
                    } else {
                        return true;
                    }
                }

                function validateEmail(input){
                    if (input.validity.typeMismatch) {
                        input.setCustomValidity("Enter a valid email");
                    }
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
                        <input id="username" name='username' type='text' placeholder="Username" required></input>
                        <input id="password" name='password' type='password' placeholder="Password" required></input>

                        <!-- Login submit button -->
                        <input name='login-btn' class='login-btn btn' type='submit' value='Login' onclick="validation(this);">
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
                    <form id='registerForm' onsubmit="registerUser(this); return false;">
                        
                        <input name='name' type='text' placeholder='Full Name (First Last)'></input>
                        <span style="display: none;" id="_nameError" class="formerror"></span>
                        
                        <input name='username' type='text' placeholder="Username"></input>
                        <span style="display: none;" id="_usernameError" class="formerror"></span>

                        <input name='password' type='password' placeholder="Password"></input>
                        <span style="display: none;" id="_passwordError" class="formerror"></span>

                        <input name='passwordConfirm' type='password' placeholder="Retype Password"></input>
                        <span style="display: none;" id="_passwordConfirmError" class="formerror"></span>

                        <input name='email' type='text' placeholder="E-mail"></input>
                        <span style="display: none;" id="_emailError" class="formerror"></span>

                        <!-- Register submit button -->
                        <input name='registerBtn' class='register-btn btn' type='submit' value='Register'>
                    </form>

                    Already have an account?
                    <input style="margin: 5px 5px 5px 5px;" name='login-btn' class='btn small' type='button' value='Login' onclick="loginHandler();">

                    <div style="display: none;" id="registerErrors">
                    </div>

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
