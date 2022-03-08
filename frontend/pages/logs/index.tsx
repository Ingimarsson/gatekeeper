import type { NextPage } from "next";
import { Button, Checkbox, Input } from "semantic-ui-react";
import { Layout, LogEntryTable } from "../../components";
import React from "react";
import Head from "next/head";
import { LogEntry, User } from "../../types";
import api from "../../api";
import { GetServerSideProps } from "next";

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data: response }: { data: User[] } = await api(context).get("/log");

  return {
    props: {
      entries: response,
    },
  };
};

export default Logs;
