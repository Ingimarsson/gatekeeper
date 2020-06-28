import React, { Component } from 'react';
import { Container, Grid, Placeholder, Icon, Divider, Segment, Header, Dropdown, Form, Input, Button, Select } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

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
                 <Placeholder style={{ height: 145, width: 240 }}>
                    <Placeholder.Image />
                </Placeholder>
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
              <Button size='tiny' primary icon labelPosition='left'>
                <Icon name='plus' />
                Add gate
              </Button>
           </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <GateSegment id={1} name='Hlið - Tjaldvarðarskúr'/>
        <GateSegment id={2} name='Hlið - Skrifstofa'/>
        <GateSegment id={3} name='Hiið - Þórunnarstræti'/>
      </div>
    );
  }
}

export default GatesPage;
