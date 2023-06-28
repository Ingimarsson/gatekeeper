import { Label, Table } from "semantic-ui-react";
import Link from "next/link";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LogEntry } from "../types";
import { Code } from "./Code";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

interface LogEntryTableProps {
  entries: LogEntry[];
}

const HoverBox = styled.div`
  position: fixed;
  top: 10px;
  left: 20px;
  height: 280px;
  min-width: 200px;
  width: fit-content;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  padding: 4px;
  z-index: 100;
  display: flex;
  gap: 4px;

  img {
    display: block;
    height: 100%;
  }
`;

export const capitalizeFirst = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

export const LogEntryTable = ({ entries }: LogEntryTableProps) => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<number>(0);
  const hoverBoxRef = useRef<HTMLDivElement>(null);
  const hoveredRecord = useMemo(
    () => entries.find((entry) => entry.id === hovered),
    [hovered]
  );

  const getWindowDimensions = () => {
    const hasWindow = typeof window !== "undefined";

    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  };

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  // Hook for window size
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hook for mouse position
  useEffect(() => {
    const updateMousePosition = (ev: any) => {
      if (hoverBoxRef.current)
        hoverBoxRef.current.style.transform = `translate3d(${Math.min(
          ev.clientX,
          (windowDimensions.width ?? 0) - 550
        )}px, ${Math.min(
          ev.clientY,
          (windowDimensions.height ?? 0) - 300
        )}px, 0)`;
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [hoverBoxRef, windowDimensions]);

  return (
    <>
      <Table>
        <Table.Header>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>{t("date", "Date")}</Table.HeaderCell>
          <Table.HeaderCell>{t("time", "Time")}</Table.HeaderCell>
          <Table.HeaderCell>{t("user", "User")}</Table.HeaderCell>
          <Table.HeaderCell>{t("gate", "Gate")}</Table.HeaderCell>
          <Table.HeaderCell>{t("comment", "Comment")}</Table.HeaderCell>
          <Table.HeaderCell>{t("type", "Type")}</Table.HeaderCell>
          <Table.HeaderCell>{t("code", "Code")}</Table.HeaderCell>
          <Table.HeaderCell>{t("operation", "Operation")}</Table.HeaderCell>
          <Table.HeaderCell>{t("result", "Result")}</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {entries.map((entry) => (
            <Link href={`/logs/${entry.id}`} key={entry.id}>
              <Table.Row
                onMouseEnter={() => setHovered(entry.id)}
                onMouseLeave={() => setHovered(0)}
              >
                <Table.Cell>
                  <Link href={`/logs/${entry.id}`} passHref={true}>
                    <a>#{entry.id}</a>
                  </Link>
                </Table.Cell>
                <Table.Cell>{moment(entry.timestamp).format("ll")}</Table.Cell>
                <Table.Cell>
                  {moment(entry.timestamp).format("HH:mm:ss")}
                </Table.Cell>
                <Table.Cell>{entry.user}</Table.Cell>
                <Table.Cell>{entry.gate}</Table.Cell>
                <Table.Cell>{entry.methodComment}</Table.Cell>
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
      {hoveredRecord !== undefined && hoveredRecord?.image !== null && (
        <HoverBox ref={hoverBoxRef}>
          <img
            alt=""
            src={`/data/camera_${hoveredRecord.cameraGeneral}/snapshots/${hoveredRecord.image}/${hoveredRecord.image}.jpg`}
          />
          {!!hoveredRecord.alprImage && (
            <img
              alt=""
              src={`/data/camera_${hoveredRecord.cameraAlpr}/snapshots/${hoveredRecord.alprImage}/${hoveredRecord.alprImage}.jpg`}
            />
          )}
        </HoverBox>
      )}
    </>
  );
};
