import React, { Component } from 'react';
import { Container, Label, Icon, Table, Grid, Input, Divider, Segment, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import ActivityDetailsModal from '../modals/ActivityDetailsModal';

import API from '../../api';

function GrantedLabel() {
  return <Label size='mini' color='green'>Granted</Label>;
}

function DeniedLabel() {
  return <Label size='mini'>Denied</Label>;
}

function IngoingLabel() {
  return <Label size='mini' color='olive'>Ingoing</Label>;
}

function OutgoingLabel() {
  return <Label size='mini' color='orange'>Outgoing</Label>;
}

function CloseLabel() {
  return <Label size='mini' color='yellow'>Close</Label>;
}

function WebLabel() {
  return <Label size='mini' color='blue'>Web</Label>;
}


class ActivityPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      activity: [],
      details_open: false,
      selected: 0
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
    let tags = {
      'ingoing': <IngoingLabel />,
      'outgoing': <OutgoingLabel />,
      'close': <CloseLabel />,
      'web': <WebLabel />,
    };

    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as='h1'>Activity</Header>
            </Grid.Column>
            <Grid.Column width={8} textAlign='right'>
              <Input style={{height: '32px'}} type='text' placeholder='Search...' action>
                <input style={{fontSize: '12px'}}/>
                <Button size='tiny' type='submit'>Search</Button>
              </Input>
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
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Access</Table.HeaderCell>
            <Table.HeaderCell>Tags</Table.HeaderCell>
            <Table.HeaderCell>Success</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {this.state.activity.map(x =>
            <Table.Row>
              <Table.Cell>{moment(x.timestamp).format('MMMM Do YYYY')}</Table.Cell>
              <Table.Cell>{moment(x.timestamp).format('HH:mm:ss')}</Table.Cell>
              <Table.Cell>{x.gate_name}</Table.Cell>
              <Table.Cell>{x.endpoint_name}</Table.Cell>
              <Table.Cell>{x.code}</Table.Cell>
              <Table.Cell>{x.access_name}</Table.Cell>
              <Table.Cell>{x.tags.map(x => tags[x])}</Table.Cell>
              <Table.Cell>{x.success ? <GrantedLabel/> : <DeniedLabel/>}</Table.Cell>
              <Table.Cell>
                <Link 
                  style={{fontSize: '12px'}}
                  onClick={() => this.setState({selected: x.id, details_open: true})}
                >
                  <Icon name='info circle'/> Details
                </Link>
              </Table.Cell>
            </Table.Row>
          )}
          </Table.Body>
        </Table>
        <ActivityDetailsModal
          id={this.state.selected}
          open={this.state.details_open}
          onClose={() => this.setState({details_open: false})}
        />
      </div>
    );
  }
}

export default ActivityPage;
