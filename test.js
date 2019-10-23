/*
c. Following good function naming conventions, rename the function you created in (a) and explain briefly why it is or is not an appropriate name that follows the conventions. Rename the parameter and add comments to the top of the function that explains what the function does and how to use it.
*/


let pieces = ['Dylan', 25, 25 + 0.5, 0.5 - 25];
pieces.forEach(function (value) {
    console.log(isPositiveInteger(value));
});

/*
This function checks if a value is a positive integer.

Return Value
    Returns true if valueToCheck is a positive integer, false otherwise.

    If returnErrors parameter is set to true, the function returns an empty array if it is a valid value, else it
    will return an array containing the reasons why the value
    is not a valid value.

Parameters
    valueToCheck
        This parameter is required. It is the value that will be
        checked.

    returnErrors
        This parameter is optional. When set to true, the return
        value changes as described above.

syntax: isPositiveInteger(valueToCheck[, returnErrors]);
*/
function isPositiveInteger(valueToCheck, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(valueToCheck) != valueToCheck) errors.push('Not a number!'); // Check if string is a number value
    if (valueToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(valueToCheck) != valueToCheck) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}