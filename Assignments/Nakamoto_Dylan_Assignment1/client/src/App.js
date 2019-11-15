import React, { useState } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import './App.css';
import TopNav from './ui/components/TopNav';
import Footer from './ui/components/Footer';
import Store from './ui/pages/Store';
import Home from './ui/pages/Home';
import PageNotFound from './ui/pages/PageNotFound';

function App() {
  const [cart, setCart] = useState([]);
  const adjustCart = (cart) => setCart(cart);

  const [products, setProducts] = useState([]);

  return (
    <Router>
      <div id="page-container">
        <TopNav cart={cart} setCart={adjustCart} />
        <Container fluid>
          <div id="content-wrap">
            <Switch>
              {/* Route to home */}
              <Router exact path="/">
                <Home />
              </Router>

              {/* Route to store */}
              <Router exact path='/store'>
                <Store cart={cart} setCart={adjustCart} products={products} setProducts={setProducts} />
              </Router>

              {/* Route everything else to page not found */}
              <Router path=''>
                <PageNotFound />
              </Router>

            </Switch>

          </div>
        </Container>
      </div>

      <div id="footer">
        <Footer />
      </div>
    </Router>
  );
}

export default App;
