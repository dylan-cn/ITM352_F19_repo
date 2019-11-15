var express = require('express');
var app = express();
var myParser = require("body-parser");
var products = require('./productData.json');

// Inventory products
let inventory = products.arrayOfProducts;
// Tax: 4.712%
const taxPercent = 0.04712;
// Shipping: 2%
const shippingPercent = 0.02;

app.use(express.static('./public'));
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());

// API endpoint to get tax / shipping
app.get("/api/policy", function (req, res) {
    res.json({ taxPercent, shippingPercent });
});

// API endpoint to get all products
app.get("/api/products", function (req, res) {
    res.json(inventory);
});

// API endpoint to get a single product
app.get("/api/products/:name", function (req, res) {
    let name = req.params.name;
    let product = inventory.find(function (element) {
        return element.name === name;
    });
    res.json(product);
});

// API endpoint to process checkout
app.post("/api/checkout", function (req, res) {
    let purchases = req.body;

    // Make sure server is receiving an array of product(s)
    // Send bad request 400 if not array
    if (!Array.isArray(purchases)) {
        res.sendStatus(400);
        return;
    }

    // response data
    let response = [];

    // hold all purchases to verify the whole order can be processed
    let purchaseState = [];

    // process data (for every item)
    purchases.forEach(function (i) {
        // find index in inventory of purchased item
        let invIdx = inventory.findIndex(p => p.name == i.product.name);
        let p = inventory[invIdx];
        // Validate that the item actually exists in inventory
        if (invIdx !== -1) {
            // validate data to ensure quantity purchased is correct
            let dataValidation = isPositiveInteger(i.amount, true);
            if (dataValidation.length === 0) {
                // validate to make sure have enough stock in inventory
                if (i.amount <= p.stock) {
                    purchaseState.push({
                        inventoryIdx: invIdx,
                        amtPurchased: i.amount
                    });
                } else {
                    console.log("Not in stock: " + p.name);
                    response.push({
                        name: p.name,
                        stock: p.stock,
                        errors: `Only (${p.stock}) of ${p.name} is in stock`
                    });
                }
            } else {
                console.log("Data is invalid for: " + p.name);
                response.push({
                    name: p.name,
                    stock: p.stock,
                    errors: `Invalid quantity for ${p.name}`
                });
            }
        } else {
            console.log("Does not exist " + i.product.name);
            response.push({
                name: i.product.name,
                stock: 0,
                errors: `${i.product.name} is no longer in inventory!`
            });
        }
    });

    // only process the order if there are no errors (response array is empty)
    if (response.length === 0) {
        let invoice = [];
        let subTotal = 0;
        //process purchases by removing from inventory
        purchaseState.forEach(function (i) {
            // remove from inventory
            inventory[i.inventoryIdx].stock = +inventory[i.inventoryIdx].stock - +i.amtPurchased;

            // push to invoice name and total price
            let quantity = +i.amtPurchased;
            let price = +inventory[i.inventoryIdx].price;
            let extendedPrice = price * quantity;
            invoice.push({
                item: inventory[i.inventoryIdx].name,
                quantity,
                price,
                extendedPrice: +extendedPrice.toFixed(2)
            });

            subTotal += extendedPrice;
        });

        let tax = (subTotal * taxPercent);
        let shipping = (subTotal * shippingPercent);
        let total = subTotal + tax + shipping;

        total = subTotal + tax + shipping;
        // Send the receipt
        response = {
            success: true,
            invoice,
            subTotal: +subTotal.toFixed(2),
            tax: +tax.toFixed(2),
            shipping: +shipping.toFixed(2),
            total: +total.toFixed(2)
        };
    }
    console.log(response);

    res.json(response);
});

app.listen(8080, () => console.log(`listening on port 8080`));

function isPositiveInteger(valueToCheck, returnErrors = false) {
    let errors = []; // assume no errors at first
    if (Number(valueToCheck) != valueToCheck) errors.push('Not a number!'); // Check if string is a number value
    if (valueToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(valueToCheck) != valueToCheck) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}