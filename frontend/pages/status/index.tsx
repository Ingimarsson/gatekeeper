import type { NextPage } from "next";
import { Layout } from "../../components";
import React from "react";
import Head from "next/head";
import { LogEntry } from "../../types";
import { Header, Label, Table } from "semantic-ui-react";

interface StatusProps {
  entries: LogEntry[];
}

const Status: NextPage<StatusProps> = () => {
  return (
    <Layout title="System Status" segmented={false} buttons={<></>}>
      <Head>
        <title>System Status - Gatekeeper</title>
      </Head>
      <Header as="h3">Camera Streams</Header>
      <Table className="readonly">
        <Table.Header>
          <Table.HeaderCell>Gate</Table.HeaderCell>
          <Table.HeaderCell>Uptime</Table.HeaderCell>
          <Table.HeaderCell>PID</Table.HeaderCell>
          <Table.HeaderCell>CPU usage</Table.HeaderCell>
          <Table.HeaderCell>Memory usage</Table.HeaderCell>
          <Table.HeaderCell>Disk usage</Table.HeaderCell>
          <Table.HeaderCell>Snapshot count</Table.HeaderCell>
          <Table.HeaderCell>Is alive</Table.HeaderCell>
        </Table.Header>
        <Table.Row>
          <Table.Cell>Front Entrance</Table.Cell>
          <Table.Cell>1d 12h 5m</Table.Cell>
          <Table.Cell>1928383</Table.Cell>
          <Table.Cell>54.2%</Table.Cell>
          <Table.Cell>127 MB</Table.Cell>
          <Table.Cell>1.24 GB</Table.Cell>
          <Table.Cell>12564</Table.Cell>
          <Table.Cell>
            <Label color="red">Dead</Label>
          </Table.Cell>
        </Table.Row>
      </Table>
      <Header as="h3">Controllers</Header>
      <Table className="readonly">
        <Table.Header>
          <Table.HeaderCell>Gate</Table.HeaderCell>
          <Table.HeaderCell>IP</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Uptime</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Header>
        <Table.Row>
          <Table.Cell>Front Entrance</Table.Cell>
          <Table.Cell>192.168.1.237</Table.Cell>
          <Table.Cell>Gatekeeper GK-400</Table.Cell>
          <Table.Cell>1d 12h 5m</Table.Cell>
          <Table.Cell>
            <Label color="green">Running</Label>
          </Table.Cell>
        </Table.Row>
      </Table>
    </Layout>
  );
};

export default Status;
