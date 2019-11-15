import React, { useEffect } from 'react';
import { Row } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';

function Store({ cart, setCart, products, setProducts }) {
    // Handles adding items to the cart
    function handleAddToCartCallback(product) {
        // Check if the item already exists in the cart
        let itemExists = cart.length > 0 ? cart.findIndex(i => i.product.name.toLowerCase() === product.product.name.toLowerCase()) : -1;

        // if item exists in cart,
        // get the product and update the amont in cart
        if (itemExists !== -1) {
            let arr = [...cart];
            arr[itemExists].amount = parseInt(arr[itemExists].amount) + parseInt(product.amount);
            setCart(arr);
        } else {
            // item does not exist in cart...
            // so just push it into the cart
            let arr = cart.length > 0 ? [...cart] : [];
            arr.push(product);
            setCart(arr);
        }

        return true;
    }

    // useEffect(() => {
    //     console.log(cart);
    // }, [cart]);

    // Fetch data from server just once on mount
    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/products');
            res
                .json()
                .then(data => setProducts(data))
                .catch(err => console.log(err));
        }

        fetchData();
    }, []);

    return (
        <>
            <h1 align="center" className='text-uppercase'>Store</h1>
            <hr />
            <Row className="justify-content-md-center">
                {products.map((product, idx) => <ProductCard key={idx} product={product} handleAddToCart={handleAddToCartCallback} />)}
            </Row>
        </>
    );
}

export default Store;
