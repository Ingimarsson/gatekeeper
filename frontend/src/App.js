import React from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { PublicRoute, PrivateRoute } from './components/Routes';
import Navbar from './components/Navbar';

import LoginPage from './components/pages/LoginPage';
import GatesPage from './components/pages/GatesPage';
import GatePage from './components/pages/GatePage';
import AccessPage from './components/pages/AccessPage';
import ActivityPage from './components/pages/ActivityPage';

import { isLogin, getUser } from './utils';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var that = this;
    getUser().then((response) => {
      that.forceUpdate();
    });
  }

  render() {
    return (
      <div className="App">
        <Router>
          { isLogin() && <Navbar /> }
          <PublicRoute exact path='/login' component={LoginPage} />
          <Container style={{marginTop: '60px'}}>
            <PrivateRoute exact path='/' component={GatesPage} />
            <PrivateRoute exact path='/gate/:id' component={GatePage} />
            <PrivateRoute exact path='/access' component={AccessPage} />
            <PrivateRoute exact path='/activity' component={ActivityPage} />
          </Container>
        </Router>
      </div>
    );
  }
}

export default App;
