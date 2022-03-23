import { Label, Table } from "semantic-ui-react";
import Link from "next/link";
import moment from "moment";
import React from "react";
import { LogEntry } from "../types";
import { Code } from "./Code";
import { useTranslation } from "react-i18next";

interface LogEntryTableProps {
  entries: LogEntry[];
}

export const capitalizeFirst = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

export const LogEntryTable = ({ entries }: LogEntryTableProps) => {
  const { t } = useTranslation();

  return (
    <Table>
      <Table.Header>
        <Table.HeaderCell>{t("date", "Date")}</Table.HeaderCell>
        <Table.HeaderCell>{t("time", "Time")}</Table.HeaderCell>
        <Table.HeaderCell>{t("user", "User")}</Table.HeaderCell>
        <Table.HeaderCell>{t("gate", "Gate")}</Table.HeaderCell>
        <Table.HeaderCell>{t("type", "Type")}</Table.HeaderCell>
        <Table.HeaderCell>{t("code", "Code")}</Table.HeaderCell>
        <Table.HeaderCell>{t("operation", "Operation")}</Table.HeaderCell>
        <Table.HeaderCell>{t("result", "Result")}</Table.HeaderCell>
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
                {t(entry.type)}
              </Table.Cell>
              <Table.Cell>
                <Code type={entry.type} code={entry.code} />
              </Table.Cell>
              <Table.Cell>
                <Label>{t(entry.operation)}</Label>
              </Table.Cell>
              <Table.Cell>
                <Label color={entry.result ? "green" : undefined}>
                  {t(entry.reason)}
                </Label>
              </Table.Cell>
            </Table.Row>
          </Link>
        ))}
      </Table.Body>
    </Table>
  );
};
