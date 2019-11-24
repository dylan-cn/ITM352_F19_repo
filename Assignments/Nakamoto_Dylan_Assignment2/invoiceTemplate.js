
module.exports = {
    // creates the page for the invoice page
    createInvoice: function (data, taxPercent, shippingPercent, userData) {
        let htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Invoice</title>
                <link rel='stylesheet' type='text/css' href='/css/app.css'>
                <link rel='stylesheet' type='text/css' href='/css/invoice.css'>
                <link rel='stylesheet' type='text/css' href='/css/navbar.css'>
            </head>
            <body>
            <ul class='navbar'>
                <li><a href='/'>Home</a></li>
                <li><a href='store'>Store</a></li>
            </ul>
                <div class="container">
                    <h1 align="center">Hello ${userData.name}!</h1>
                    <hr style="width: 100%;">

                    <div class="header">
                        <div style="grid-column: 1">
                            <h3>DYLAN'S STORE</h3>
                            <p>
                                Dylan Nakamoto <br />
                                2500 Campus Rd Honolulu, HI 96819 <br />
                                808-333-3333 <br />
                                some@email.com
                            </p>
                        </div>

                        <div style="grid-column: 2;">

                            <div style="float: right;">
                                <h3>SALES RECEIPT</h3> <br />
                                <p><strong>Date:</strong> ${new Date().toDateString()}</p>
                            </div>
                        </div>
                        
                        <div style="grid-column: 1">
                            <h3>SOLD TO</h3>
                            <p>
                                ${userData.name} <br />
                                ${userData.email} <br />
                            </p>
                        </div>
                    </div>

                    !!invoice!!
                </div>
            </body>
            </html>
        `;

        let tableTemplate = `
            <table>
                <tbody>
                    <tr>
                        <th style="text-align: center;" colspan="1">Qty</th>
                        <th style="text-align: center;" colspan="3">Item</th>
                        <th style="text-align: center;" colspan="1">Unit Price</th>
                    </tr>

                    !!data!!

                </tbody>
            </table>
        `;

        let subtotal = 0;
        let tableRows = ``;

        data.forEach(purchase => {
            let extendedPrice = purchase.amtPurchased * purchase.price;
            subtotal += extendedPrice;
            tableRows += `
            <tr>
                <td style="text-align: center;" colspan="1">${purchase.amtPurchased}</td>
                <td style="text-align: center;" colspan="3">${purchase.item}</td>
                <td style="text-align: center;" colspan="1">$${purchase.price}</td>
            </tr>
        `;
        });

        // Calculate tax & shipping
        let tax = subtotal * taxPercent;
        let shipping = subtotal * shippingPercent;
        let total = subtotal + tax + shipping;

        // add empty row
        tableRows += `
            <tr>
                <td colspan="5" style="width: 100%;"></td>
            </tr>
        `;

        // add subtotal to table
        tableRows += `
            <tr>
                <td colspan="4" align="right"><strong>Subtotal</strong></td>
                <td colspan="1">$${subtotal.toFixed(2)}</td>
            </tr>
        `;

        // add tax to table
        tableRows += `
            <tr>
                <td colspan="4" align="right">Tax @ ${(taxPercent * 100).toFixed(2)}%</td>
                <td colspan="1">$${tax.toFixed(2)}</td>
            </tr>
        `;

        // add shipping to table
        tableRows += `
            <tr>
                <td colspan="4" align="right">Shipping @ ${(shippingPercent * 100).toFixed(2)}%</td>
                <td colspan="1">$${shipping.toFixed(2)}</td>
            </tr>
        `;

        // add total to table
        tableRows += `
            <tr>
                <td colspan="4" align="right"><strong>Total</strong></td>
                <td colspan="1">$${total.toFixed(2)}</td>
            </tr>
        `;

        // Put the table rows in tableTemplate
        tableTemplate = tableTemplate.replace('!!data!!', tableRows);

        // Put the table in to the htmlTemplate
        let htmlTem = htmlTemplate.replace('!!invoice!!', tableTemplate);

        // return the page
        return htmlTem;
    },

    // Creates the html page for an errorred invoice
    createErrorInvoice: function (data) {
        let htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Invoice</title>
                <link rel='stylesheet' type='text/css' href='/css/app.css'>
                <link rel='stylesheet' type='text/css' href='/css/invoice.css'>
                <link rel='stylesheet' type='text/css' href='/css/navbar.css'>
            </head>
            <body>
            <ul class='navbar'>
                <li><a href='/'>Home</a></li>
                <li><a href='store'>Store</a></li>
            </ul>
                <div class="container">
                <h1>There were errors processing your order!</h1>
                    !!invoice!!
                </div>
            </body>
            </html>
        `;

        let tableTemplate = `
            <table>
                <tbody>
                <tr>
                    <th style="text-align: center;" colspan="2">Item</th>
                    <th style="text-align: center;" colspan="2">Reason</th>
                </tr>

                !!data!!

                </tbody>
            </table
        `;

        let tableRows = ``;
        data.forEach(purchase => {
            tableRows += `
            <tr>
                <td style="text-align: center;" colspan="2">${purchase.item}</th>
                <td style="text-align: center;" colspan="2">${purchase.error}</th>
            </tr>
        `;
        });

        tableTemplate = tableTemplate.replace('!!data!!', tableRows);

        let htmlTem = htmlTemplate.replace('!!invoice!!', tableTemplate);

        return htmlTem;
    },

    createNotLoggedIn: function () {
        let htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Invoice</title>
                <link rel='stylesheet' type='text/css' href='/css/app.css'>
                <link rel='stylesheet' type='text/css' href='/css/navbar.css'>
            </head>
            <body>
            <ul class='navbar'>
                <li><a href='/'>Home</a></li>
                <li><a href='store'>Store</a></li>
            </ul>
                <div class="container">
                    <h1 align="center">You must log in to access!</h1>
                    <p id="countdown" align="center">You will be redirected in... 5 seconds</p>
                </div>

                <script>
                    !!script!!
                    redirectTimer(new Date(), 5000);
                </script>
            </body>
            </html>
        `;

        // Function to update every second
        function redirectTimer(startTime, amtOfTime) {
            // Update the count down every 1 second
            var x = setInterval(function () {

                // Get current time in ms
                var now = new Date().getTime();

                // Get the difference between now and startTime
                var timeElapsed = now - startTime.getTime();

                // Time calculations for seconds
                var seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);

                // Display the result in the element
                document.getElementById("countdown").innerHTML = `You will be redirected in... ${amtOfTime - seconds} seconds`;

                // check 5000 ms countdown
                // send back to homepage when done counting
                if (timeElapsed > amtOfTime) {
                    clearInterval(x);
                    window.location.replace("/");
                }
            }, 1000);
        }

        let finalTemplate = htmlTemplate.replace('!!script!!', redirectTimer.toString());

        return finalTemplate;
    }
};
