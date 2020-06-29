import React, { Component } from 'react';
import { Container, Image, Table, Grid, Icon, Placeholder, Divider, Segment, Header, Dropdown, Form, Input, Button, Select } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import API from '../../api';

class GatePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      gate: []
    }
  }

  getData() {
    this.setState({loading: true});

    var that = this;

    const { match: { params } } = this.props;

    API.get('/gate/'+params.id).then(function(response) {
      that.setState({gate: response.data});
    });
  }

  componentDidMount() {
    this.getData();
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let timestamp = Math.floor(Date.now() / 1000) -2;

    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as='h1'>{this.state.gate.name}</Header>
            </Grid.Column>
            <Grid.Column width={8} textAlign='right'>
              <Button size='tiny' icon labelPosition='left'>
                <Icon name='edit' />
                Edit Gate
              </Button>
           </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider/>
        <Segment basic>
        <div style={{maxWidth: 800, margin: '0 auto', marginBottom: 34}}>
          <Image src={'http://192.168.1.240:8080/live/'+this.state.gate.id+'/'+timestamp+'.jpg'} style={{width: 800, marginBottom: 10}}/>
        <Button size='tiny' floated='left' color='green'>Open</Button>

        <Button size='tiny' floated='left'>Close</Button>
        <Button size='tiny' icon labelPosition='left' floated='right'>
          <Icon name='sync' />
          Restart Stream
        </Button>
 
        </div>
        </Segment>
        <Header as='h1' dividing>Activity</Header>
        <Table>
          <Table.Header>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Method</Table.HeaderCell>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>May 26, 2020</Table.Cell>
              <Table.Cell>17:20</Table.Cell>
              <Table.Cell>Myndavél</Table.Cell>
              <Table.Cell>RA232</Table.Cell>
              <Table.Cell>Details</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>May 26, 2020</Table.Cell>
              <Table.Cell>16:38</Table.Cell>
              <Table.Cell>Talnalás</Table.Cell>
              <Table.Cell>1234</Table.Cell>
              <Table.Cell>Details</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default GatePage;
