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
import { Layout } from "../../components";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { LogEntry, User } from "../../types";
import axios from "axios";
import moment from "moment";
import { LogEntryTable } from "../../components/LogEntryTable";

interface LogsProps {
  entries: LogEntry[];
}

const Logs: NextPage<LogsProps> = ({ entries }) => {
  return (
    <Layout
      title="Access Log"
      segmented={false}
      buttons={
        <>
          <Checkbox label="Show failed attempts" style={{ marginRight: 20 }} />
          <Input
            style={{ height: "32px" }}
            type="text"
            placeholder="Search..."
            action
          >
            <input style={{ fontSize: "12px" }} />
            <Button size="tiny" type="submit">
              Search
            </Button>
          </Input>
        </>
      }
    >
      <Head>
        <title>Access Log - Gatekeeper</title>
      </Head>
      <LogEntryTable entries={entries} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const { data: response }: { data: User[] } = await axios.get("/api/logs");

  return {
    props: {
      entries: response,
    },
  };
}

export default Logs;
