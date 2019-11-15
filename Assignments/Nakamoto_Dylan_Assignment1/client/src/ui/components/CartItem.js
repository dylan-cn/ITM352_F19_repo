import React from 'react';
import { Button, Card, InputGroup, Col } from 'react-bootstrap';

function CartItem({ item, removeCallback }) {
    return (
        <Col lg="4" style={{ marginBottom: '5px' }}>
            <Card className="h-100">
                <Card.Img variant="top" src={item.product.imgUrl} />
                <Card.Body>
                    <Card.Title>{item.product.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Price: ${item.product.price}</Card.Subtitle>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon3">
                                Quantity: {item.amount}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>

                    <Button variant='danger' onClick={() => removeCallback(item)}>Remove</Button>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default CartItem;