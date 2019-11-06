import React, { useState, useEffect } from 'react';
import { Card, Image } from 'semantic-ui-react';

function Store() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('http://localhost:8080/api/products');
        res
        .json()
        .then(data => setProducts(data))
        .catch(err => console.log(err));
        }

        fetchData();
    }, []);

    return (
        <div>
        <Card.Group centered>
            {products.map((product) => 
            <Card>
                <Image src={product.imgUrl} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>{product.name}</Card.Header>
                    <Card.Meta>
                        <span className='price'>Price: ${product.price}</span>
                    </Card.Meta>
                    <Card.Description>
                        some product description
                    </Card.Description>
                </Card.Content>
            </Card>
            )}
        </Card.Group>
        </div>
    );
}

export default Store;
