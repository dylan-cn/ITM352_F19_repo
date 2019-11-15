import React from 'react';
import { Image } from 'react-bootstrap';
import './PageNotFound.css';

const PageNotFound = () => (
    <div id="container">
        <Image id="yourDiv" src='/images/404.png' />
        <h1>You have seem to run into a missing page...</h1>
    </div>
)

export default PageNotFound;
