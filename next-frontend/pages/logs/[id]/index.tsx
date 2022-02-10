import type { NextPage } from "next";
import { Header, Table, Label } from "semantic-ui-react";
import { Code, Layout } from "../../../components";
import React, { useMemo, useState } from "react";
import Head from "next/head";
import { LogEntryDetails } from "../../../types";
import axios from "axios";
import moment from "moment";
import styled from "styled-components";

interface LogEntryProps {
  entry: LogEntryDetails;
}

const LiveStreamBox = styled.div`
  height: 400px;
  width: 600px;
  background: #444;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    aspect-ratio: 1.5;
  }
`;

export const Logo = styled.img`
  width: 150px;
`;

const LiveStreamSlider = styled.input`
  width: 500px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const Grid = styled.div`
  display: flex;
  flex-flow: row-reverse;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    gap: 0px;
  }
`;

export const LiveStreamColumn = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  flex-flow: column;
  flex-grow: 1;
`;

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
      <Grid>
        <LiveStreamColumn>
          <LiveStreamBox>
            <Logo src="/logo_white.svg" />
          </LiveStreamBox>
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
        </LiveStreamColumn>
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
      </Grid>
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
