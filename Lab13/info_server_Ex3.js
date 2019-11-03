var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var products = require('./product_data');

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(express.static('./public'));
app.use(myParser.urlencoded({ extended: true }));

app.post("/process_form", function (request, response) {
    process_quantity_form(request, response);
});

app.listen(8080, () => console.log(`listening on port 8080`));



function process_quantity_form(request, response) {
    let POST = request.body;
    //response.send(POST);
    console.log('this is from 3c');
    if (POST.quantity_textbox != 'undefined') {
        if (!isPositiveInteger(POST.quantity_textbox)) {
            response.send(`${POST.quantity_textbox} is not a quantity! Press the back button and try again.`);
        } else {
            var contents = fs.readFileSync('./Views/display_quantity_template.view', 'utf8');

            response.send(eval('`' + contents + '`')); // render template string
        }
    }
}

function isPositiveInteger(valueToCheck, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(valueToCheck) != valueToCheck) errors.push('Not a number!'); // Check if string is a number value
    if (valueToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(valueToCheck) != valueToCheck) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}