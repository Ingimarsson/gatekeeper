import React, { Component } from 'react';
import { Container, Table, Grid, Placeholder, Divider, Segment, Header, Dropdown, Form, Input, Button, Select } from 'semantic-ui-react';
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
              <Button size='tiny'>Edit gate</Button>
           </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Placeholder style={{ height: 300, width: '100%', maxWidth: 1000, marginBottom: 14}}>
                <Placeholder.Image />
              </Placeholder>
              <Button size='tiny'>Refresh Stream</Button>
            </Grid.Column>
            <Grid.Column width={8}>
              <Button color='green'>Open</Button>
              <Button>Close</Button>
              <Header as='h3'>Access Methods</Header>
              <Table>
                <Table.Header>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Myndavél</Table.Cell>
                    <Table.Cell>OpenALPR</Table.Cell>
                    <Table.Cell><a href='#'>Properties</a></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Talnalás</Table.Cell>
                    <Table.Cell>Keypad</Table.Cell>
                    <Table.Cell><a href='#'>Properties</a></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Vefgátt</Table.Cell>
                    <Table.Cell>Portal</Table.Cell>
                    <Table.Cell><a href='#'>Properties</a></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Hnappur</Table.Cell>
                    <Table.Cell>Local</Table.Cell>
                    <Table.Cell><a href='#'>Properties</a></Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <Button floated='right' size='tiny'>Add Method</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
