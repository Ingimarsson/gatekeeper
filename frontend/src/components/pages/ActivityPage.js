import React, { Component } from 'react';
import { Container, Table, Grid, Divider, Segment, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import API from '../../api';

class ActivityPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      activity: []
    }
  }

  getData() {
    this.setState({loading: true});

    var that = this;

    API.get('/activity').then(function(response) {
      that.setState({activity: response.data});
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
              <Header as='h1'>Activity</Header>
            </Grid.Column>
            <Grid.Column width={8} textAlign='right'>
           </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Table>
          <Table.Header>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Gate</Table.HeaderCell>
            <Table.HeaderCell>Endpoint</Table.HeaderCell>
            <Table.HeaderCell>Access</Table.HeaderCell>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Success</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {this.state.activity.map(x =>
            <Table.Row>
              <Table.Cell>{x.timestamp}</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>{x.gate_name}</Table.Cell>
              <Table.Cell>{x.endpoint_name}</Table.Cell>
              <Table.Cell>{x.access_name}</Table.Cell>
              <Table.Cell>{x.code}</Table.Cell>
              <Table.Cell>{x.success}</Table.Cell>
            </Table.Row>
          )}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default ActivityPage;
