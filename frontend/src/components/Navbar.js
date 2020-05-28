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
          <Menu.Item as={Link} to='/flight'>Activity</Menu.Item>
          <Menu.Item as={Link} to='/booking'>Whitelist</Menu.Item>
        </Container>
      </Menu>
    );
  }
}

export default withRouter(Navbar);
