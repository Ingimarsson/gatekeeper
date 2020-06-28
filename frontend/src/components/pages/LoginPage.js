import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { login } from '../../utils';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      warning: '',
      disabled: false
    };
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit = event => {
    var that = this;

    this.state.disabled = true;

    login(this.state.username, this.state.password).then(function(result) {
      that.props.history.push('/');
    }).catch(function(error) {
      that.setState({warning: 'Invalid username or password'});
    });
    
    that.state.disabled = false;
  }

  render() {
    return <Grid textAlign='center' style={{ height: '90vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h1' textAlign='center' style={{marginBottom: '0px'}}>
          Gatekeeper
        </Header>
        <Header as='h3' textAlign='center' style={{marginBottom: '30px', marginTop: '10px'}}>
          Access Control System
        </Header>
        <Form size='large' onSubmit={this.handleSubmit}>
          <Segment>
            <Form.Input 
              name='username' 
              value={this.state.username} 
              fluid 
              icon='user' 
              iconPosition='left' 
              placeholder='Username' 
              onChange={this.handleChange} 
            />
            <Form.Input
              name='password'
              value={this.state.password}
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              onChange={this.handleChange} 
            />
            <Button primary
              fluid 
              size='large'
              disabled={this.state.disabled}
            >
              Login
            </Button>
          </Segment>
        </Form>
        { this.state.warning &&
        <Message error>
          {this.state.warning}
        </Message>
        }
        <p style={{marginTop: '40px', color: '#bbb'}}></p>
      </Grid.Column>
    </Grid>
  }
}

export default Login;
