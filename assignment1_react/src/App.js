import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Navbar from './ui/components/Navbar';
import Footer from './ui/components/Footer';

function App() {
  return (
    <Router>
      <Container>
        <Navbar />

        <Switch>
          <Route exact path='/'>

          </Route>
        </Switch>

        <Footer />
      </Container>
    </Router>
  );
}

export default App;
