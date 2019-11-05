var express = require('express');
var app = express();
var path = require('path');
var myParser = require("body-parser");
var fs = require('fs');
var templates = require('./view/templates');
var products = require('./model/products');
//var products = require('./product_data');

app.use(express.static(path.join(__dirname + '/public')));
app.use(myParser.urlencoded({ extended: true }));

// Routes

// Home
app.all('/', function (req, res, next) {
    res.send(templates.htmlboilerplate.replace('templatebody', ''));
});

// Store
app.all('/store', function (req, res, next) {
    let productsHtml = `<div class="row">`;
    products.forEach(element => {
        productsHtml += `
        <div class="col-sm-6 mt-2">
            <div class="card">
            <div class="card-body">
                <h5 class="card-title">${element.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">$${element.price}</h6>
                <h6 class="card-subtitle mb-2">Stock: ${element.stock}</h6>
            </div>
            </div>
        </div>
        `;
    });
    productsHtml += `</div>`;


    res.send(templates.htmlboilerplate.replace('templatebody', productsHtml));
});

// All else send to 404
app.all('*', function (request, response, next) {
    let html = templates.htmlboilerplate.replace('templatebody',
        "<img src='./assets/images/404.png' class='img-fluid mx-auto d-block'");
    response.status(404).send(html);
});

app.listen(8080, () => console.log(`listening on port 8080`));