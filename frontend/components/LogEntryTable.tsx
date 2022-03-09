import { Label, Table } from "semantic-ui-react";
import Link from "next/link";
import moment from "moment";
import React from "react";
import { LogEntry } from "../types";
import { Code } from "./Code";

interface LogEntryTableProps {
  entries: LogEntry[];
}

export const typeLabels = {
  any: "Any",
  web: "Web Interface",
  keypad: "Keypad",
  "keypad-pin": "Keypad (PIN)",
  "keypad-card": "Keypad (Card)",
  "keypad-both": "Keypad (Both)",
  plate: "License Plate",
  "button-1": "Button 1",
  "button-2": "Button 2",
  "button-3": "Button 3",
};

export const capitalizeFirst = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

export const LogEntryTable = ({ entries }: LogEntryTableProps) => (
  <Table>
    <Table.Header>
      <Table.HeaderCell>Date</Table.HeaderCell>
      <Table.HeaderCell>Time</Table.HeaderCell>
      <Table.HeaderCell>User</Table.HeaderCell>
      <Table.HeaderCell>Gate</Table.HeaderCell>
      <Table.HeaderCell>Type</Table.HeaderCell>
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
            <Table.Cell>
              {!!entry.typeLabel && entry.typeLabel + " / "}
              {typeLabels[entry.type]}
            </Table.Cell>
            <Table.Cell>
              <Code type={entry.type} code={entry.code} />
            </Table.Cell>
            <Table.Cell>
              <Label>{capitalizeFirst(entry.operation)}</Label>
            </Table.Cell>
            <Table.Cell>
              <Label color={entry.result ? "green" : undefined}>
                {entry.result ? "Granted" : "Failed"}
              </Label>
            </Table.Cell>
          </Table.Row>
        </Link>
      ))}
    </Table.Body>
  </Table>
);
