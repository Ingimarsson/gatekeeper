import React, { Component } from 'react';
import { Menu, Container, Dropdown } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { logout } from '../utils';

class Navbar extends Component {
  render() {
    return (
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item header>Gatekeeper</Menu.Item>
          <Menu.Item as={Link} to='/'>Gates</Menu.Item>
          <Menu.Item as={Link} to='/access'>Access</Menu.Item>
          <Menu.Item as={Link} to='/activity'>Activity</Menu.Item>
          <Menu.Menu position='right'>
            <Dropdown item text="Administrator">
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to='/admin/users'><i className='user icon'/> Users</Dropdown.Item>
                <Dropdown.Item as={Link} to='/admin/settings'><i className='cog icon'/> Settings</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item onClick={ () => logout() }><i className='sign out icon'/> Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}

export default withRouter(Navbar);
