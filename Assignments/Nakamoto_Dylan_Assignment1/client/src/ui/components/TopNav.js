import React from 'react';
import { NavLink } from 'react-router-dom';
import Cart from './Cart';
import { Navbar, Nav } from 'react-bootstrap';

function TopNav({ cart, setCart }) {
    return (
        <Navbar sticky='top' collapseOnSelect expand='md' bg='dark' variant='dark'>
            <Navbar.Brand href='/'>
                Dylan's Store
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className='mr-auto'>
                    <Nav.Link as={NavLink} to="/" exact href='/'>
                        Home
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/store" href='/store'>
                        Store
                    </Nav.Link>
                </Nav>
                <Nav>
                    <Cart cart={cart} setCart={setCart} />
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default TopNav;
