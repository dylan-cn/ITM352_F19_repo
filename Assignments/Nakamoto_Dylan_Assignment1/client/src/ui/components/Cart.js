import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Table, Row } from 'react-bootstrap/';
import CartItem from './CartItem';

function Cart({ cart, setCart }) {
    const [showCart, setShowCart] = useState(false);
    const [checkoutErrors, setCheckoutErrors] = useState([]);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receipt, setReceipt] = useState({});
    const [invoice, setInvoice] = useState({});
    const [purchaseComplete, setPurchaseComplete] = useState(false);
    const [policy, setPolicy] = useState({});

    // get policy just once
    useEffect(() => {
        getTaxShippingPolicy().then(function (data) {
            setPolicy(data);
        })
    }, []);

    // update invoice whenever cart is updated
    useEffect(() => {
        let data = calcCart();
        setInvoice(data);
    }, [cart]);

    // Remove errors if cart is closed
    function handleCloseCart() {
        setShowCart(false);
        setCheckoutErrors([]);
    }

    function handleShow() {
        setShowCart(!showCart);
    }

    // When receipt is closed, reset all states
    function handleReceiptClose() {
        setShowReceipt(false);
        setPurchaseComplete(false);
        setReceipt({});
    }
    const handleReceipt = () => setShowReceipt(!showReceipt);
    const handlePurchaseComplete = () => setPurchaseComplete(true);

    function removeItemCallback(item) {
        // Remove from cart
        let arr = [...cart];
        let idx = arr.findIndex(i => i.product.name.toLowerCase() === item.product.name.toLowerCase());

        arr.splice(idx, 1);
        setCart(arr);
    }

    // Post the checkout to server
    async function postData(data) {
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            });

            const json = await res.json();
            let parsedData = JSON.parse(JSON.stringify(json));
            return parsedData;
        } catch (error) {
            console.log(error);
        }
    }

    async function getTaxShippingPolicy() {
        try {
            const res = await fetch('/api/policy', {
                method: 'GET',
            });

            const json = await res.json();
            let parsedData = JSON.parse(JSON.stringify(json));
            return parsedData;
        } catch (error) {
            console.log(error);
        }
    }

    function handleCheckout() {
        // Do not try to process empty carts
        if (cart.length === 0) {
            return;
        }

        // Send post request and process the response
        let data = postData(cart);
        data.then(function (i) {
            // Check if purchase was successful or not
            if (i.success) {
                // Reset errors
                setCheckoutErrors([]);
                // Reset cart
                setCart([]);
                // Close cart modal
                handleCloseCart();

                // Prepare the invoice
                setReceipt(i);

                // Show purchase complete
                handlePurchaseComplete();
            } else {
                let newCart = [...cart];
                let errors = [];
                // for each item that could not be purchased, adjust the cart to display the max they can buy
                i.forEach(function (item) {
                    for (const element of newCart) {
                        if (element.product.name.toLowerCase() === item.name.toLowerCase()) {
                            element.amount = item.stock;
                            //console.log(item);
                            errors.push(item.errors);
                            console.log("Changing product " + item.name + " stock to : " + item.stock);
                            break;
                        }
                    }
                });

                // remove items that have 0 quantity
                for (let i = newCart.length - 1; i >= 0; i--) {
                    if (newCart[i].amount === 0) {
                        newCart.splice(i, 1);
                    }
                }
                setCheckoutErrors(errors);
                setCart(newCart);
            }
        }).catch(function (e) {
            setCheckoutErrors(['Could not process checkout']);
        });
    }

    function printErrors() {
        if (checkoutErrors.length > 0) {
            //checkoutErrors.unshift('Your cart has been updated: ')
            return (
                <div>
                    <h3 style={{ color: 'red' }}>Your cart has been updated: </h3>
                    <ListGroup variant="flush">
                        {checkoutErrors.map((e, idx) => <ListGroup.Item key={idx}>{e}</ListGroup.Item>)}
                    </ListGroup>
                </div>
            );
        }
    }

    function receiptModal() {
        if (receipt.success) {
            return (
                <Modal backdrop="static" centered size="lg" show={purchaseComplete} onHide={handleReceiptClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Purchase Completed</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h6>Your purchase order has been completed.</h6>
                        {(receipt.invoice && showReceipt) ?
                            <>
                                <hr />
                                <h3>Receipt</h3>
                                {createReceiptTable(receipt)}
                            </>
                            : ''}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleReceiptClose}>
                            Close
                        </Button>
                        <Button variant='info' onClick={handleReceipt}>
                            {showReceipt ? 'Hide Receipt' : 'Show Receipt'}
                        </Button>
                    </Modal.Footer>
                </Modal >
            );
        } else {
            return (
                ''
            );
        }
    }

    function calcCart() {
        let invoice = [];
        let response = {};
        let subTotal = 0;
        // Process each item in cart
        cart.forEach(function (item) {
            let quantity = +item.amount;
            let price = +item.product.price;
            let extendedPrice = +(price * quantity);
            invoice.push({
                item: item.product.name,
                quantity,
                price,
                extendedPrice: +extendedPrice.toFixed(2)
            });

            subTotal += extendedPrice;
        });

        let tax = (subTotal * policy.taxPercent);
        let shipping = (subTotal * policy.shippingPercent);
        let total = subTotal + tax + shipping;

        total = subTotal + tax + shipping;

        response = {
            invoice: invoice,
            subTotal: +subTotal.toFixed(2),
            tax: +tax.toFixed(2),
            shipping: +shipping.toFixed(2),
            total: +total.toFixed(2)
        };

        return response;
    }

    function createReceiptTable(data) {
        return (
            <Table responsive bordered striped>
                <thead>
                    <tr>
                        <th>Quantity</th>
                        <th>Item</th>
                        <th>Unit Price</th>
                    </tr>
                </thead>
                <tbody>
                    {data.invoice.map((e, idx) =>
                        <tr key={idx}>
                            <td>{e.quantity}</td>
                            <td>{e.item}</td>
                            <td>${Number(e.price).toFixed(2)}</td>
                        </tr>
                    )}

                    <tr>
                        <td colSpan='4'></td>
                    </tr>

                    <tr>
                        <td colSpan='2' align='right'><strong>Subtotal</strong></td>
                        <td>${Number(data.subTotal).toFixed(2)}</td>
                    </tr>

                    <tr>
                        <td colSpan='2' align='right'>Tax @ {Number(policy.taxPercent * 100).toFixed(2)}%</td>
                        <td>${data.tax}</td>
                    </tr>

                    <tr>
                        <td colSpan='2' align='right'>Shipping @ {Number(policy.shippingPercent * 100).toFixed(2)}%</td>
                        <td>${data.shipping}</td>
                    </tr>

                    <tr>
                        <td colSpan='2' align='right'><strong>Total</strong></td>
                        <td>${Number(data.total).toFixed(2)}</td>
                    </tr>
                </tbody>
            </Table>
        );
    }

    return (
        <>
            <Button variant="secondary" onClick={handleShow}>
                Cart
            </Button>

            {/* Cart Modal */}
            <Modal backdrop={checkoutErrors.length > 0 ? "static" : true} size="lg" centered show={showCart} onHide={handleCloseCart}>
                <Modal.Header closeButton>
                    <Modal.Title>Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(cart.length > 0 && checkoutErrors.length === 0) ?
                        <>
                            <Row className='mt-3'>
                                {cart.map((e, idx) =>
                                    <CartItem item={e} removeCallback={removeItemCallback} key={idx} />
                                )}
                            </Row>

                            {invoice.invoice ?
                                <>
                                    <hr />
                                    <h2>Invoice</h2>
                                    {createReceiptTable(invoice)}
                                    <hr />
                                    <h3>Tax and Shipping Policy</h3>
                                    <p>
                                        Tax is calculated at a rate of {+(policy.taxPercent * 100).toFixed(2)}%
                                        <br />
                                        Shipping is calculated at a flat {+(policy.shippingPercent * 100).toFixed(2)}% of purchase total.
                                    </p>
                                </> : ''}
                        </>
                        : checkoutErrors.length > 0 ? printErrors() : `You have no items in the cart!`}
                    {/* {printErrors()} */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCart}>
                        Close
                    </Button>
                    {
                        checkoutErrors.length === 0 && cart.length > 0 ?
                            <Button variant="primary" onClick={handleCheckout}>
                                Purchase
                        </Button> : checkoutErrors.length > 0 ?
                                <Button variant="primary" onClick={() => setCheckoutErrors([])}>
                                    Go to cart
                        </Button> :
                                ''
                    }
                </Modal.Footer>
            </Modal>

            {/* Invoice modal */}
            {receiptModal()}
        </>
    );
}

export default Cart;