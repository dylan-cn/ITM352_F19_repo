import React from 'react';
import { Button, Container } from 'react-bootstrap';

function Home() {
    return (
        // Center the homepage
        // <Container style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        //     <div className='text-center'>
        //         <h1>Assignment 1: e-Commerce Store</h1>
        //         <Button variant="dark" href='/store'>Go to Store</Button>
        //     </div>
        // </Container>

        // <Container className='d-flex justify-content-center'>
        //     <div className='flex-column'>
        //         <h1>Assignment 1: e-Commerce Store</h1>
        //         <Button variant="dark" href='/store'>Go to Store</Button>
        //     </div>
        // </Container>

        <Container>
            <div className='text-center'>
                <h1>Welcome to</h1>
                <h4>Assignment 1: e-Commerce Store</h4>
                <Button variant="dark" href='/store'>Go to Store</Button>
            </div>
        </Container>
    );
}

export default Home;
