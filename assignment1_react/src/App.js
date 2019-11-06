import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Navbar from './ui/components/Navbar';
import Footer from './ui/components/Footer';
import Store from './ui/pages/Store';
import Home from './ui/pages/Home';

function App() {
  return (
    <Router>
      <div id="page-container">
        <Container>
          <div id="content-wrap">
          <Navbar />
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>

            <Router exact path='/store'>
              <Store />
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
