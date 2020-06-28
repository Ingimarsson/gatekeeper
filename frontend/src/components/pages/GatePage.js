import React, { Component } from 'react';
import { Container, Table, Grid, Icon, Placeholder, Divider, Segment, Header, Dropdown, Form, Input, Button, Select } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class GatePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as='h1'>Hlið - Tjaldvarðarskúr</Header>
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
        <div style={{maxWidth: 800, margin: '0 auto', marginBottom: 34, height: 480}}>
        <Placeholder style={{ height: '100%', width: '100%', maxWidth: 800, marginBottom: 14}}>
          <Placeholder.Image />
        </Placeholder>
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
