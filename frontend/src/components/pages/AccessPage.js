import React, { Component } from 'react';
import { Container, Grid, Icon, Table, Divider, Segment, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import API from '../../api';

class AccessPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      access: []
    }
  }

  getData() {
    this.setState({loading: true});

    var that = this;

    API.get('/access').then(function(response) {
      that.setState({access: response.data});
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as='h1'>Access</Header>
            </Grid.Column>
            <Grid.Column width={8} textAlign='right'>
              <Button size='tiny' primary icon labelPosition='left'>
                <Icon name='plus' />
                Add access
              </Button>
           </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Table>
          <Table.Header>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Gate</Table.HeaderCell>
            <Table.HeaderCell>Endpoint</Table.HeaderCell>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Valid From</Table.HeaderCell>
            <Table.HeaderCell>Valid To</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
          {this.state.access.map(x =>
            <Table.Row>
              <Table.Cell>{x.name}</Table.Cell>
              <Table.Cell>{x.gate_name}</Table.Cell>
              <Table.Cell>{x.endpoint_name}</Table.Cell>
              <Table.Cell>{x.code}</Table.Cell>
              <Table.Cell>{x.valid_from}</Table.Cell>
              <Table.Cell>{x.valid_to}</Table.Cell>
            </Table.Row>
          )}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default AccessPage;
