import { NextPage } from "next";
import { Layout } from "../../components";
import React from "react";
import Head from "next/head";
import { Status as StatusType } from "../../types";
import { Header, Label, Table } from "semantic-ui-react";
import { GetServerSideProps } from "next";
import api from "../../api";
import moment from "moment";

interface StatusProps {
  status: StatusType;
}

const humanFileSize = (size: number) => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
};

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor(seconds / (60 * 60)) % 24;
  const minutes = Math.floor(seconds / 60) % 60;

  return (
    (days > 0 ? days + "d " : "") +
    (hours > 0 || days > 0 ? hours + "h " : "") +
    minutes +
    "m"
  );
};

const Status: NextPage<StatusProps> = ({ status }) => {
  return (
    <Layout title="System Status" segmented={false} buttons={<></>}>
      <Head>
        <title>System Status - Gatekeeper</title>
      </Head>
      <Header as="h3">Camera Streams</Header>
      <Table className="readonly">
        <Table.Header>
          <Table.HeaderCell>Gate</Table.HeaderCell>
          <Table.HeaderCell>Last update</Table.HeaderCell>
          <Table.HeaderCell>Uptime</Table.HeaderCell>
          <Table.HeaderCell>PID</Table.HeaderCell>
          <Table.HeaderCell>CPU usage</Table.HeaderCell>
          <Table.HeaderCell>Memory usage</Table.HeaderCell>
          <Table.HeaderCell>Disk usage</Table.HeaderCell>
          <Table.HeaderCell>Snapshot count</Table.HeaderCell>
          <Table.HeaderCell>Is alive</Table.HeaderCell>
        </Table.Header>
        {status.streams.map((stream) => (
          <Table.Row key={stream.gate}>
            <Table.Cell>{stream.gate}</Table.Cell>
            <Table.Cell>{moment(stream.timestamp).fromNow()}</Table.Cell>
            <Table.Cell>
              {stream.alive && stream.alive && formatUptime(stream.uptime)}
            </Table.Cell>
            <Table.Cell>{stream.alive && stream.pid}</Table.Cell>
            <Table.Cell>
              {stream.alive && (stream.cpuUsage / 10).toFixed(1) + "%"}
            </Table.Cell>
            <Table.Cell>
              {stream.alive && humanFileSize(stream.memoryUsage)}
            </Table.Cell>
            <Table.Cell>
              {stream.alive && humanFileSize(stream.diskUsage)}
            </Table.Cell>
            <Table.Cell>{stream.alive && stream.snapshotCount}</Table.Cell>
            <Table.Cell>
              {stream.alive ? (
                <Label color="green">Running</Label>
              ) : (
                <Label color="red">Dead</Label>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      <Header as="h3">Controllers</Header>
      <Table className="readonly">
        <Table.Header>
          <Table.HeaderCell>Gate</Table.HeaderCell>
          <Table.HeaderCell>Last update</Table.HeaderCell>
          <Table.HeaderCell>IP</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Uptime</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Header>
        {status.controllers.map((controller) => (
          <Table.Row key={controller.gate}>
            <Table.Cell>{controller.gate}</Table.Cell>
            <Table.Cell>{moment(controller.timestamp).fromNow()}</Table.Cell>
            <Table.Cell>{controller.ipAddress}</Table.Cell>
            <Table.Cell>{controller.type}</Table.Cell>
            <Table.Cell>
              {controller.alive && formatUptime(controller.uptime)}
            </Table.Cell>
            <Table.Cell>
              {controller.alive ? (
                <Label color="green">Running</Label>
              ) : (
                <Label color="red">Dead</Label>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data: status }: { data: StatusType } = await api(context).get(
    "/system"
  );

  return {
    props: {
      status,
    },
  };
};

export default Status;
