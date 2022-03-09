import type { NextPage } from "next";
import { Header, Label, Table } from "semantic-ui-react";
import { Code, Layout } from "../../../components";
import React, { useMemo, useState } from "react";
import Head from "next/head";
import { LogEntryDetails } from "../../../types";
import api from "../../../api";
import type { GetServerSideProps } from "next";
import moment from "moment";
import styled from "styled-components";
import { typeLabels, capitalizeFirst } from "../../../components/LogEntryTable";

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
  position: relative;
  margin-bottom: 20px;

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

const TimeLabel = styled.div`
  color: white;
  font-family: sans;
  font-size: 22px;
  font-weight: 900;
  position: absolute;
  bottom: 14px;
  background: #00000044;
  padding: 4px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const LogEntry: NextPage<LogEntryProps> = ({ entry }) => {
  const firstTime = useMemo(
    () => parseInt(entry.firstImage),
    [entry.timestamp]
  );
  const lastTime = useMemo(() => parseInt(entry.lastImage), [entry.timestamp]);

  const [offset, setOffset] = useState<number>(
    parseInt(entry.image) - firstTime
  );

  return (
    <Layout title="Log Entry" segmented={false} buttons={<></>}>
      <Head>
        <title>Log Entry - Gatekeeper</title>
      </Head>
      <Grid>
        <LiveStreamColumn>
          <LiveStreamBox>
            {entry.image ? (
              <img
                src={`/data/camera_${entry.gateId}/snapshots/${entry.image}/${
                  firstTime + offset
                }.jpg`}
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Logo src="/logo_white.svg" />
            )}

            <TimeLabel>
              {moment.unix(firstTime + offset).format("HH:mm:ss")}
            </TimeLabel>
          </LiveStreamBox>
          <input
            type="range"
            id="points"
            name="points"
            min="0"
            max={lastTime - firstTime}
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
                <b>Type</b>
              </Table.Cell>
              <Table.Cell>
                {!!entry.typeLabel && entry.typeLabel + " / "}
                {typeLabels[entry.type]}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>Code</b>
              </Table.Cell>
              <Table.Cell>
                <Code type={entry.type} code={entry.code} />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>Operation</b>
              </Table.Cell>
              <Table.Cell>
                <Label size="tiny">{capitalizeFirst(entry.operation)}</Label>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>Result</b>
              </Table.Cell>
              <Table.Cell>
                <Label size="tiny" color={entry.result ? "green" : undefined}>
                  {entry.result ? "Granted" : "Failed"}
                </Label>
              </Table.Cell>
            </Table.Row>
          </Table>
        </div>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data: response }: { data: LogEntryDetails } = await api(context).get(
    "/log/" + context.params?.id
  );

  return {
    props: {
      entry: response,
    },
  };
};

export default LogEntry;
