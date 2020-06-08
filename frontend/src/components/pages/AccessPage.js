import React, { Component } from 'react';
import { Container, Grid, Table, Divider, Segment, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class AccessPage extends Component {
  constructor(props) {
    super(props);
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
              <Button size='tiny'>Edit gate</Button>
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
            <Table.Row>
              <Table.Cell>Brynjar</Table.Cell>
              <Table.Cell>Hlið - Tjaldvarðarskúr</Table.Cell>
              <Table.Cell>OpenALPR Camera</Table.Cell>
              <Table.Cell>RA232</Table.Cell>
              <Table.Cell>Indefinite</Table.Cell>
              <Table.Cell>Indefinite</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default AccessPage;
