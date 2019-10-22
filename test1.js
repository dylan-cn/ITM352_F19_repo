/*
c. Following good function naming conventions, rename the function you created in (a) and explain briefly why it is or is not an appropriate name that follows the conventions. Rename the parameter and add comments to the top of the function that explains what the function does and how to use it.
*/

function isPositiveInteger(valueToCheck, logErrors = false) {
    let errors = [];

    // first check if value is a number
    if (typeof valueToCheck !== 'number') {
        errors.push(`${valueToCheck} is not a number`);
    } else {
        // Check value is actually an integer
        if (valueToCheck !== parseInt(valueToCheck)) {
            errors.push(`${valueToCheck} is not an integer`);
        } else {
            // Check negative or not
            if (valueToCheck < 0) {
                errors.push(`${valueToCheck} is a negative number`);
            }
        }
    }

    return (logErrors && errors.length > 0) ? errors : errors.length > 0 ? false : true;
}

let pieces = ['Dylan', 25, 25 + 0.5, 0.5 - 25];
pieces.forEach(x => console.log(x.length > 0));

