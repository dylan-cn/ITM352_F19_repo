let template = require('./invoiceTemplate.js');
let loginTemplate = require('./loginTemplate.js');
var express = require('express');
var app = express();
var path = require('path');
var myParser = require("body-parser");
var fs = require('fs');
var users = require('./users.json');
var products = require('./productData.json');

// Inventory products
let inventory = products.arrayOfProducts;
// Tax: 4.712%
const taxPercent = 0.04712;
// Shipping: 2%
const shippingPercent = 0.02;

// Static folder
app.use(express.static('./public'));

// Allow parsing of data 
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());

// Log all requests and then send it
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

// Home
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Store
app.get("/store", function (req, res) {
    res.sendFile(path.join(__dirname, 'pages', 'store.html'));
});

// API endpoint to get all products
app.get("/api/products", function (req, res) {
    res.json(inventory);
});

// Send to login/register page
app.post('/loginPurchase', function (req, res) {
    res.send(loginTemplate.createLogin(req.body));
});

// Process requests to register a user
app.post('/processRegister', function (req, res) {
    // find user in "database"
    let userExists = typeof users[req.body.username] === 'undefined' ? false: true;

    let message = {};
    let userData = req.body;

    let canRegister = false;
    // CHECK: ensure username does not exist
    if (!userExists) {
        // CHECK: password match
        if (userData.password === userData.passwordConfirm) {
            // CHECK: email validation
            if (userData.email) {
                message = {
                    success: true,
                    msg: 'Account created'
                }
                canRegister = true;
            } else {
                message = {
                    success: false,
                    msg: 'Invalid email'
                }
            }
        } else {
            message = {
                success: false,
                msg: 'Password does not match'
            }
        }
    } else {
        message = {
            success: false,
            msg: 'User name already exists'
        }
    }

    // Add user to file if can register
    if (canRegister) {
        // Add to the object
        users[userData.username] = {
            name: userData.name,
            password: userData.password,
            email: userData.email
        };

        // Write to the file
        fs.writeFile('./users.json', JSON.stringify(users), function (err) {
            // If could not write to file... catastrophic error occurred
            if (err) {
                message = {
                    success: false,
                    msg: "Something went terribly wrong creating your account"
                }
            }
        });
    }

    // send message back to request
    if (message.success) {
        res.status(200).json(message);
    } else {
        res.status(400).json(message);
    }
});

// Process requests to login
app.post('/processLogin', function (req, res) {
    // find user in "database"
    let userExists = typeof users[req.body.username] === 'undefined' ? false: true;

    let message = {};
    let userData = req.body;

    // Check to make sure user exists
    if (userExists) {
        // Check to make sure passwords match
        if (users[userData.username].password === userData.password) {
            message = {
                success: true,
                msg: "Login successful"
            };
        } else {
            message = {
                success: false,
                msg: "Invalid password"
            };
        }
    } else {
        message = {
            success: false,
            msg: 'User does not exist'
        }
    }

    // Send something back to client
    if (message.success) {
        res.status(200).json(message);
    } else {
        res.status(400).json(message);
    }
});

// Checkout the user
app.post("/checkout", function (req, res) {
    // CHECK REFERRER HERE TO TRY TO ENSURE CHECKOUTS OCCURS FROM /loginPurchase


    // Hold items that are purchased
    // So that we can rollback the inventory
    // count if the transaction fails
    let purchaseState = [];

    // Array to hold all errors
    let errors = [];

    // Response to send back to client
    let response = {};

    // The purchase data received
    const purchases = req.body;

    // For each item in purchase, find it in
    // inventory and remove the necessary amount.
    // Process the whole cart even if there are errors
    // because inventory will just be rolled back to 
    // original state if any errors exist.
    for (let item in purchases) {
        const amtPurchased = purchases[item];
        // Skip items that have no quantity
        // ** do not try to purchase nothing of something **
        if (amtPurchased === '' || +amtPurchased === 0) {
            continue;
        }

        // DATA VALIDATION
        // Push any errors to array
        // Don't need to process inventory if data is invalid
        if (!isPositiveInteger(amtPurchased)) {
            errors.push({ item, error: `${amtPurchased} is invalid quantity` });
            continue;
        }

        // Find the purchased item in inventory
        let invIdx = inventory.findIndex(inventoryItem => {
            return inventoryItem.name === item;
        });

        // If invIdx < 0, then the item does not exist in inventory
        if (invIdx < 0) {
            errors.push({ item, error: `does not exist in inventory` });
        } else {
            // Remove from inventory if enough stock available
            // otherwise push an error
            if (inventory[invIdx].stock >= +amtPurchased) {
                inventory[invIdx].stock -= +amtPurchased;
                purchaseState.push({ item, amtPurchased: +amtPurchased, price: inventory[invIdx].price });
            } else {
                errors.push({ item, error: `only (${inventory[invIdx].stock}) available` });
            }
        }

        // If any errors exist, roll back the inventory
        // otherwise send success
        if (errors.length > 0) {
            // For each item processed, revert stock
            purchaseState.forEach((purchase) => {
                // Find the purchased item in inventory
                let invIdx = inventory.findIndex(inventoryItem => {
                    return inventoryItem.name === purchase.item;
                });

                // Add back the purchased amount to inventory
                if (invIdx >= 0) {
                    inventory[invIdx].stock += +purchase.amtPurchased;
                }
            });

            response = { success: false, errors };
        } else {
            response = { success: true, purchaseState };
        }
    }

    // Send a response
    // If transaction was successful, send an invoice
    // else send an error saying what went wrong
    if (response.success) {
        res.send(template.createInvoice(response.purchaseState, taxPercent, shippingPercent));
    } else {
        res.send(template.createErrorInvoice(errors));
    }
});

app.listen(8080, () => console.log(`listening on port 8080`));

/*
Test whether an input is a positive integer or not
*/
function isPositiveInteger(valueToCheck, returnErrors = false) {
    let errors = []; // assume no errors at first
    if (Number(valueToCheck) != valueToCheck) errors.push('Not a number!'); // Check if string is a number value
    if (valueToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(valueToCheck) != valueToCheck) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}