import type { NextPage } from "next";
import { Button, Icon, Label, Modal, Table } from "semantic-ui-react";
import { Code, Layout } from "../../../components";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { LogEntryDetails } from "../../../types";
import api from "../../../api";
import type { GetServerSideProps } from "next";
import moment from "moment";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

interface LogEntryProps {
  entry: LogEntryDetails;
}

const LiveStreamBox = styled.div`
  height: 400px;
  width: 600px;
  background: #444;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
  color: #fffd;
  position: relative;

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    aspect-ratio: 1.5;
  }
`;

const LiveStreamBoxOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
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

  @media (max-width: 600px) {
    width: 100%;
  }
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
  const { t } = useTranslation();

  const firstTime = useMemo(
    () =>
      parseInt(entry.firstImage?.length > 0 ? entry.firstImage : entry.image),
    []
  );
  const lastTime = useMemo(
    () => parseInt(entry.lastImage?.length > 0 ? entry.lastImage : entry.image),
    []
  );

  const [offset, setOffset] = useState<number>(
    parseInt(entry.image) - firstTime
  );
  const [playing, setPlaying] = useState<boolean>(false);
  const [enlarged, setEnlarged] = useState<boolean>(false);
  const [preloaded, setPreloaded] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing && offset < lastTime - firstTime) {
        setOffset(offset + 1);
      }
      if (offset == lastTime - firstTime) {
        setPlaying(false);
      }
    }, 150);
    return () => {
      clearInterval(interval);
    };
  }, [playing, offset, lastTime, firstTime]);

  const changeOffset = (offset: number) => {
    setPlaying(false);
    setOffset(offset);

    // Preload all jpegs for smooth playback
    if (!preloaded) {
      let images = new Array();
      for (let i = firstTime; i <= lastTime; i++) {
        images[firstTime - i] = new Image();
        images[
          firstTime - i
        ].src = `/data/camera_${entry.cameraGeneral}/snapshots/${entry.image}/${i}.jpg`;
      }
      setPreloaded(true);
    }
  };

  const play = () => {
    changeOffset(0);
    setPlaying(true);
  };

  return (
    <Layout
      title={t("log-entry", "Log Entry")}
      segmented={false}
      buttons={<></>}
    >
      <Head>
        <title>{t("log-entry", "Log Entry")} - Gatekeeper</title>
      </Head>
      <Modal
        size="fullscreen"
        onClose={() => setEnlarged(false)}
        open={enlarged}
        closeIcon
        basic
      >
        <img
          src={`/data/camera_${entry.cameraGeneral}/snapshots/${entry.image}/${
            firstTime + offset
          }.jpg`}
          style={{
            background: "#999",
            width: "90vw",
            maxHeight: "90vh",
            objectFit: "contain",
          }}
        />
      </Modal>
      <Grid>
        <LiveStreamColumn>
          <LiveStreamBox>
            {entry.image ? (
              <img
                src={`/data/camera_${entry.cameraGeneral}/snapshots/${
                  entry.image
                }/${firstTime + offset}.jpg`}
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <>
                <Logo src="/logo_white.svg" />
                {!entry.image && <h3>{t("no-image", "No image available")}</h3>}
              </>
            )}
            {entry.firstImage?.length > 0 && (
              <TimeLabel>
                {moment.unix(firstTime + offset).format("HH:mm:ss")}
              </TimeLabel>
            )}
            <LiveStreamBoxOverlay>
              {entry.image?.length > 0 && (
                <Button
                  size="mini"
                  icon
                  labelPosition="left"
                  onClick={() => setEnlarged(true)}
                >
                  <Icon name="expand" /> {t("enlarge", "Enlarge")}
                </Button>
              )}
              {entry.firstImage?.length > 0 && (
                <Button
                  size="mini"
                  color="blue"
                  icon
                  labelPosition="left"
                  onClick={() => (playing ? setPlaying(false) : play())}
                >
                  <Icon name={playing ? "pause" : "play"} />
                  {playing ? t("pause", "Pause") : t("play", "Play")}
                </Button>
              )}
            </LiveStreamBoxOverlay>
          </LiveStreamBox>
          {entry.firstImage?.length > 0 && (
            <input
              type="range"
              id="points"
              name="points"
              min="0"
              max={lastTime - firstTime}
              value={offset}
              onChange={(e) => changeOffset(parseInt(e.target.value))}
              style={{ width: 300, marginBottom: 20 }}
            />
          )}
        </LiveStreamColumn>
        <div
          style={{ flexGrow: 1, maxWidth: 400, minWidth: 300, paddingTop: 20 }}
        >
          <Table className="readonly">
            <Table.Row>
              <Table.Cell>
                <b>{t("date", "Date")}</b>
              </Table.Cell>
              <Table.Cell>
                {moment(entry.timestamp).format("ll HH:mm:ss")}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>{t("user", "User")}</b>
              </Table.Cell>
              <Table.Cell>{entry.user}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>{t("gate", "Gate")}</b>
              </Table.Cell>
              <Table.Cell>{entry.gate}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>{t("type", "Type")}</b>
              </Table.Cell>
              <Table.Cell>
                {!!entry.typeLabel && entry.typeLabel + " / "}
                {t(entry.type)}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>{t("code", "Code")}</b>
              </Table.Cell>
              <Table.Cell>
                <Code type={entry.type} code={entry.code} />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>{t("operation", "Operation")}</b>
              </Table.Cell>
              <Table.Cell>
                <Label size="tiny">{t(entry.operation)}</Label>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>{t("result", "Result")}</b>
              </Table.Cell>
              <Table.Cell>
                <Label size="tiny" color={entry.result ? "green" : undefined}>
                  {entry.result
                    ? t("granted", "Granted")
                    : t("failed", "Failed")}
                </Label>
              </Table.Cell>
            </Table.Row>
          </Table>
          <h3>{t("methodDetails", "Method Details")}</h3>
          <Table className="readonly">
            <Table.Row>
              <Table.Cell>
                <b>{t("startDate", "Start Date")}</b>
              </Table.Cell>
              <Table.Cell>
                {!!entry.method?.startDate &&
                  moment(entry.method.startDate).format("ll HH:mm")}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>{t("endDate", "End Date")}</b>
              </Table.Cell>
              <Table.Cell>
                {!!entry.method?.endDate &&
                  moment(entry.method.endDate).format("ll HH:mm")}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>{t("comment", "Comment")}</b>
              </Table.Cell>
              <Table.Cell>
                {!!entry.method?.comment && entry.method.comment}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <b>{t("metadata", "Metadata")}</b>
              </Table.Cell>
              <Table.Cell
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 4,
                }}
              >
                {!!entry.method?.data &&
                  Object.entries(entry.method.data).map(([k, v]) => (
                    <>
                      <b>{k}</b>
                      <span>{v as number|string}</span>
                    </>
                  ))}
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
