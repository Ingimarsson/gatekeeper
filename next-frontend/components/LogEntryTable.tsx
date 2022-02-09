import { Label, Table } from "semantic-ui-react";
import Link from "next/link";
import moment from "moment";
import React from "react";
import { LogEntry } from "../types";
import { Code } from "./Code";

interface LogEntryTableProps {
  entries: LogEntry[];
}

export const LogEntryTable = ({ entries }: LogEntryTableProps) => (
  <Table>
    <Table.Header>
      <Table.HeaderCell>Date</Table.HeaderCell>
      <Table.HeaderCell>Time</Table.HeaderCell>
      <Table.HeaderCell>User</Table.HeaderCell>
      <Table.HeaderCell>Gate</Table.HeaderCell>
      <Table.HeaderCell>Method</Table.HeaderCell>
      <Table.HeaderCell>Code</Table.HeaderCell>
      <Table.HeaderCell>Operation</Table.HeaderCell>
      <Table.HeaderCell>Result</Table.HeaderCell>
    </Table.Header>
    <Table.Body>
      {entries.map((entry) => (
        <Link href={`/logs/${entry.id}`} key={entry.id}>
          <Table.Row>
            <Table.Cell>{moment(entry.timestamp).format("ll")}</Table.Cell>
            <Table.Cell>
              {moment(entry.timestamp).format("HH:mm:ss")}
            </Table.Cell>
            <Table.Cell>{entry.user}</Table.Cell>
            <Table.Cell>{entry.gate}</Table.Cell>
            <Table.Cell>{entry.method}</Table.Cell>
            <Table.Cell>
              <Code code={entry.code} />
            </Table.Cell>
            <Table.Cell>
              <Label>{entry.operation}</Label>
            </Table.Cell>
            <Table.Cell>
              <Label color={entry.granted ? "green" : undefined}>
                {entry.granted ? "Granted" : "Failed"}
              </Label>
            </Table.Cell>
          </Table.Row>
        </Link>
      ))}
    </Table.Body>
  </Table>
);
