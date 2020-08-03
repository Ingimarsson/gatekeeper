import React, { Component } from 'react'
import { Button, TextArea, Header, Image, Table, Modal, Form, Input, Divider, Segment } from 'semantic-ui-react'

import API from '../../api';

class ActivityDetailsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      details: []
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.getData();
    }
  }

  getData() {
    var that = this;
    API.get('/activity/'+this.props.id).then(function(response) {
      that.setState({details: response.data});
    });
  }

  render() {
    return <Modal size='small'
      onClose={this.props.onClose}
      open={this.props.open}
    >
      <Modal.Header>Activity Details</Modal.Header>
      <Modal.Content>
        <Image src={'http://192.168.1.240:8080/snapshot/'+this.state.details.snapshot}/>
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell><b>Timestamp</b></Table.Cell>
              <Table.Cell>{this.state.details.timestamp}</Table.Cell>
            </Table.Row>
             <Table.Row>
              <Table.Cell><b>Gate</b></Table.Cell>
              <Table.Cell>{this.state.details.gate_name}</Table.Cell>
            </Table.Row>
             <Table.Row>
              <Table.Cell><b>Endpoint</b></Table.Cell>
              <Table.Cell>{this.state.details.endpoint_name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><b>Code</b></Table.Cell>
              <Table.Cell>{this.state.details.code}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><b>Command</b></Table.Cell>
              <Table.Cell>{this.state.details.command}</Table.Cell>
            </Table.Row>
             <Table.Row>
              <Table.Cell><b>Access</b></Table.Cell>
              <Table.Cell>{this.state.details.access_name}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Modal.Content>
    </Modal>;
  }
}

export default ActivityDetailsModal;
