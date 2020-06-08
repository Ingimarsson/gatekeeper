import React, { Component } from 'react';
import { Container, Table, Grid, Divider, Segment, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class ActivityPage extends Component {
  constructor(props) {
    super(props);
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
            <Table.Row>
              <Table.Cell>May 4, 2020</Table.Cell>
              <Table.Cell>20:23</Table.Cell>
              <Table.Cell>Hlið - Tjaldvarðarskúr</Table.Cell>
              <Table.Cell>OpenALPR Camera</Table.Cell>
              <Table.Cell>Brynjar</Table.Cell>
              <Table.Cell>RA232</Table.Cell>
              <Table.Cell>True</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default ActivityPage;
