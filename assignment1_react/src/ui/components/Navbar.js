import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

function Navbar() {
    const [activeItem, setActiveItem] = useState('');

    return (
        <Menu>
            <Menu.Item as={Link} to="/"
                name='home'
                active={activeItem === 'home'}
                onClick={() => setActiveItem('home')}
            >
                Home
            </Menu.Item>

            <Menu.Item as={Link} to="/store"
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
