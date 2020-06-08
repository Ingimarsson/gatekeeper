import React, { Component } from 'react';
import { Menu, Container } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

class Navbar extends Component {
  render() {
    return (
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item header>Gatekeeper</Menu.Item>
          <Menu.Item as={Link} to='/'>Gates</Menu.Item>
          <Menu.Item as={Link} to='/access'>Access</Menu.Item>
          <Menu.Item as={Link} to='/activity'>Activity</Menu.Item>
        </Container>
      </Menu>
    );
  }
}

export default withRouter(Navbar);
