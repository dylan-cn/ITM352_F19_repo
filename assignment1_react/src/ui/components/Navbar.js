import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

function Navbar() {
    const [activeItem, setActiveItem] = useState('home');

    return (
        <Menu>
            <Menu.Item as={NavLink} to="/"
                name='home'
                active={activeItem === 'home'}
                onClick={() => setActiveItem('home')}
            >
                Home
            </Menu.Item>

            <Menu.Item as={NavLink} to="/store"
                name='store'
                active={activeItem === 'store'}
                onClick={() => setActiveItem('store')}
            >
                Store
            </Menu.Item>
        </Menu>
    );
}

export default Navbar;
