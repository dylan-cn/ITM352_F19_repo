import React from 'react';
import { Card, Button, InputGroup, FormControl, Modal, Col } from 'react-bootstrap';

class ProductCard extends React.Component {
    constructor(props) {
        super(props);
        // Create state
        this.state = {
            amount: 0,
            showSuccessAlert: false,
            showErrorAlert: false,
            errors: [],
            addedToCart: false
        };

        // bind stuff
        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleSuccessAlert = this.handleSuccessAlert.bind(this);
        this.handleErrorAlert = this.handleErrorAlert.bind(this);
        this.isPositiveInteger = this.isPositiveInteger.bind(this);
    }

    // Handles changes to the input text
    handleChange(e) {
        this.setState({ amount: e.target.value });
    }

    // Handles when an item added to the cart
    handleAdd(item) {
        // Just do some client side validation to
        // check if value entered in actually an integer.
        // If value does not evaluate to an integer, do not attempt
        // to do any more processing.
        let valueValidation = this.isPositiveInteger(this.state.amount, true);
        if (valueValidation.length > 0) {
            this.setState({ errors: valueValidation });
            this.handleErrorAlert();
            return;
        }

        // Make sure the actual quantity being added to cart is more than 0
        if (this.state.amount > 0) {
            // Check to make sure actually added to cart
            if (this.props.handleAddToCart({ product: item.product, amount: parseInt(item.amount) })) {
                // Reset value back to 0
                document.getElementById(this.props.product.name).value = 0;
                this.setState({ amount: 0 });

                //alert("Successfully added to cart.");
                this.handleSuccessAlert();
            } else {
                this.handleErrorAlert();
                this.setState({ errors: ['Catastrophic error trying to add item! Try again later.'] })
            }
        } else {
            this.handleErrorAlert();
            this.setState({ errors: ['Cannot add 0 items to cart!'] })
        }
    }

    // automatically time out success alert
    handleSuccessAlert = () => {
        this.setState({ showSuccessAlert: true }, () => {
            window.setTimeout(() => {
                this.setState({ showSuccessAlert: false });
            }, 1500)
        });
        this.setState({ addedToCart: true });
    }

    // automatically time out the error alert
    handleErrorAlert = () => {
        this.setState({ showErrorAlert: true }, () => {
            window.setTimeout(() => {
                this.setState({ showErrorAlert: false })
            }, 2500)
        });
        this.setState({ addedToCart: false });
    }

    // Check if value is integer or not
    isPositiveInteger(valueToCheck, returnErrors = false) {
        let errors = []; // assume no errors at first
        if (Number(valueToCheck) != valueToCheck) errors.push('Not a number!'); // Check if string is a number value
        if (valueToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(valueToCheck) != valueToCheck) errors.push('Not an integer!'); // Check that it is an integer

        return returnErrors ? errors : (errors.length === 0);
    }

    render() {
        return (
            <Col xs="12" sm="6" md="6" lg="3" style={{ marginTop: "5px", marginBottom: "5px" }} >
                <Card className="h-100">
                    <Card.Img variant="top" src={this.props.product.imgUrl} />
                    <Card.Body>
                        <Card.Title>{this.props.product.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Price: ${Number(this.props.product.price).toFixed(2)}</Card.Subtitle>
                        <Card.Text>
                            Some description of the item should take up this area.
                    </Card.Text>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon3">
                                    Quantity:
                            </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl as="input"
                                id={this.props.product.name}
                                min="0"
                                onChange={this.handleChange}
                                placeholder="0"
                            />
                        </InputGroup>
                        <Button className='float-right' variant="outline-success" onClick={() => this.handleAdd({ product: this.props.product, amount: parseInt(this.state.amount) })}>Add to cart</Button>

                        <Modal centered show={this.state.showSuccessAlert} onHide={() => this.setState({ showSuccessAlert: false })}>
                            <Modal.Header closeButton>
                                <Modal.Title>{this.state.addedToCart ? 'Success' : 'Error'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{this.state.addedToCart ? `${this.props.product.name} added to cart` : `${this.props.product.name} not added to cart`}</Modal.Body>
                        </Modal>

                        <Modal centered show={this.state.showErrorAlert} onHide={() => this.setState({ showErrorAlert: false })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Invalid Value for {this.props.product.name}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {this.state.errors.length > 0 ?
                                    this.state.errors.map((elem, idx) =>
                                        <p key={idx}>
                                            {`You put ${this.state.amount}: ${elem}`}
                                        </p>
                                    ) :
                                    ''
                                }
                            </Modal.Body>
                        </Modal>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}

export default ProductCard