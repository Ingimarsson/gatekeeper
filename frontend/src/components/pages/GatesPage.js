import React, { Component } from 'react';
import { Container, Grid, Placeholder, Icon, Divider, Segment, Image, Header, Dropdown, Form, Input, Button, Select } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import API from '../../api';

class GateSegment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid.Column>
        <Link to={'/gate/'+this.props.id}>
          <Segment style={{minHeight: '260px'}}>
            <Image src={this.props.image} style={{width: '100%', aspectRatio: 5/4}}/>
            <Header as='h3'>{this.props.name}</Header>
          </Segment>
        </Link>
      </Grid.Column>
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
        <Grid columns={4} stackable>
        {this.state.gates.map(x => <GateSegment id={x.id} name={x.name} image={'http://192.168.1.240:8080/live/'+x.id+'/'+timestamp+'.jpg'}/>)}
        </Grid>
      </div>
    );
  }
}

export default GatesPage;
