import type { NextPage } from "next";
import {
  Header,
  Button,
  Icon,
  Table,
  Label,
  Input,
  Checkbox,
} from "semantic-ui-react";
import { Code, Layout } from "../../../components";
import React, { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  GateDetails as GateDetailsType,
  LogEntryDetails,
} from "../../../types";
import axios from "axios";
import moment from "moment";

interface LogEntryProps {
  entry: LogEntryDetails;
}

const LogEntry: NextPage<LogEntryProps> = ({ entry }) => {
  const firstTime = useMemo(
    () => moment(entry.firstImage).unix(),
    [entry.timestamp]
  );
  const lastTime = useMemo(
    () => moment(entry.lastImage).unix(),
    [entry.timestamp]
  );

  const [offset, setOffset] = useState<number>(
    moment(entry.timestamp).unix() - firstTime
  );

  return (
    <Layout title="Log Entry" segmented={false} buttons={<></>}>
      <Head>
        <title>Log Entry - Gatekeeper</title>
      </Head>
      <div
        style={{
          display: "flex",
          flexFlow: "row-reverse",
          justifyContent: "center",
          gap: 60,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px 0",
            flexFlow: "column",
          }}
        >
          <div style={{ height: 400, width: 600, background: "#444" }}></div>
          <Header as="h3">
            {moment.unix(firstTime + offset).format("HH:mm:ss")}
          </Header>
          <input
            type="range"
            id="points"
            name="points"
            min="0"
            max={lastTime - firstTime + 1}
            value={offset}
            onChange={(e) => setOffset(parseInt(e.target.value))}
            style={{ width: 300, marginBottom: 20 }}
          />
        </div>
        <div
          style={{ flexGrow: 1, maxWidth: 400, minWidth: 300, paddingTop: 20 }}
        >
          <Table className="readonly">
            <Table.Row>
              <Table.Cell>
                <b>Date</b>
              </Table.Cell>
              <Table.Cell>
                {moment(entry.timestamp).format("ll HH:mm:ss")}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>User</b>
              </Table.Cell>
              <Table.Cell>{entry.user}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>Gate</b>
              </Table.Cell>
              <Table.Cell>{entry.gate}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>Method</b>
              </Table.Cell>
              <Table.Cell>{entry.method}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>Code</b>
              </Table.Cell>
              <Table.Cell>
                <Code code={entry.code} />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>Operation</b>
              </Table.Cell>
              <Table.Cell>
                <Label size="tiny">{entry.operation}</Label>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>Result</b>
              </Table.Cell>
              <Table.Cell>
                <Label size="tiny" color={entry.granted ? "green" : undefined}>
                  {entry.granted ? "Granted" : "Failed"}
                </Label>
              </Table.Cell>
            </Table.Row>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const { data: response }: { data: LogEntryDetails } = await axios.get(
    "/api/logs/1"
  );

  return {
    props: {
      entry: response,
    },
  };
}

export default LogEntry;
