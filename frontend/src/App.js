import React from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import GatesPage from './components/pages/GatesPage';
import GatePage from './components/pages/GatePage';
import AccessPage from './components/pages/AccessPage';
import ActivityPage from './components/pages/ActivityPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Container style={{marginTop: '60px'}}>
          <Route exact path='/' component={GatesPage} />
          <Route exact path='/gate/:id' component={GatePage} />
          <Route exact path='/access' component={AccessPage} />
          <Route exact path='/activity' component={ActivityPage} />
        </Container>
      </Router>
    </div>
  );
}

export default App;
