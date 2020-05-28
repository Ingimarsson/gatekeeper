import React from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import GatesPage from './components/pages/GatesPage';
import GatePage from './components/pages/GatePage';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Container style={{marginTop: '60px'}}>
          <Route exact path='/' component={GatesPage} />
          <Route exact path='/gate/1' component={GatePage} />
        </Container>
      </Router>
    </div>
  );
}

export default App;
