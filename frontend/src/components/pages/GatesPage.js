import React, { Component } from 'react';
import { Container, Grid, Placeholder, Divider, Segment, Header, Dropdown, Form, Input, Button, Select } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class GatesPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as='h1'>Gates</Header>
            </Grid.Column>
            <Grid.Column width={8} textAlign='right'>
              <Button size='tiny' primary>Add gate</Button>
           </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                   <Placeholder style={{ height: 145, width: 240 }}>
                      <Placeholder.Image />
                  </Placeholder>
              </Grid.Column>
              <Grid.Column width={8}>
                <Link to='/gate/1'>
                  <Header as='h2'>Hlið - Tjaldvarðarskúr</Header>
                </Link>
              </Grid.Column>
              <Grid.Column width={4}>
                  <Button color='green'>Open</Button>
                  <Button>Close</Button>
             </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                   <Placeholder style={{ height: 145, width: 240 }}>
                      <Placeholder.Image />
                  </Placeholder>
              </Grid.Column>
              <Grid.Column width={8}>
                  <Header as='h2'>Hlið - Skrifstofa</Header>
              </Grid.Column>
              <Grid.Column width={4}>
                  <Button color='green'>Open</Button>
                  <Button>Close</Button>
             </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                   <Placeholder style={{ height: 145, width: 240 }}>
                      <Placeholder.Image />
                  </Placeholder>
              </Grid.Column>
              <Grid.Column width={8}>
                  <Header as='h2'>Hlið - Þórunnarstræti</Header>
              </Grid.Column>
              <Grid.Column width={4}>
                  <Button color='green'>Open</Button>
                  <Button>Close</Button>
             </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
 
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                   <Placeholder style={{ height: 145, width: 240 }}>
                      <Placeholder.Image />
                  </Placeholder>
              </Grid.Column>
              <Grid.Column width={8}>
                  <Header as='h2'>Hamrar 2</Header>
              </Grid.Column>
              <Grid.Column width={4}>
                  <Button color='green'>Open</Button>
             </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
}

export default GatesPage;
