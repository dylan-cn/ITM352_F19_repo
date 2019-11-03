var express = require('express');
var app = express();
var myParser = require("body-parser");

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(express.static('./public'));
app.use(myParser.urlencoded({ extended: true }));

app.post("/process_form", function (request, response) {
    let POST = request.body;
    //response.send(POST);

    if (POST.quantity_textbox != 'undefined') {
        if (!isPositiveInteger(POST.quantity_textbox)) {
            response.send(`${POST.quantity_textbox} is not a quantity! Press the back button and try again.`);
        } else {

            response.send(`Thank you for purchasing ${POST.quantity_textbox} things!`);
        }
    }
});

app.listen(8080, () => console.log(`listening on port 8080`));




function isPositiveInteger(valueToCheck, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(valueToCheck) != valueToCheck) errors.push('Not a number!'); // Check if string is a number value
    if (valueToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(valueToCheck) != valueToCheck) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}