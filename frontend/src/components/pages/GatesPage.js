import React, { Component } from 'react';
import { Container, Grid, Placeholder, Icon, Divider, Segment, Image, Header, Dropdown, Form, Input, Button, Select } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import API from '../../api';

class GateSegment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>
      <Segment basic>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={4}>
              <Image src={this.props.image} size='small'/>
            </Grid.Column>
            <Grid.Column width={8}>
              <Link to={'/gate/'+this.props.id}>
                <Header as='h2'>{this.props.name}</Header>
              </Link>
            </Grid.Column>
            <Grid.Column width={4}>
           </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Divider/>
    </div>
    );
 
  }
}

class GatesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      gates: []
    }
  }

  getData() {
    this.setState({loading: true});

    var that = this;

    API.get('/gates').then(function(response) {
      that.setState({gates: response.data});
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    let timestamp = Math.floor(Date.now() / 1000) -2;

    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as='h1'>Gates</Header>
            </Grid.Column>
            <Grid.Column width={8} textAlign='right'>
              <Button size='tiny' primary icon labelPosition='left'>
                <Icon name='plus' />
                Add gate
              </Button>
           </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        {this.state.gates.map(x => <GateSegment id={x.id} name={x.name} image={'http://192.168.1.240:8080/live/'+x.id+'/'+timestamp+'.jpg'}/>)}
      </div>
    );
  }
}

export default GatesPage;
