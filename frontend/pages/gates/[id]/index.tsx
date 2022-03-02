import type { NextPage } from "next";
import { Button, Header, Icon } from "semantic-ui-react";
import {
  AddGateModal,
  ConfirmActionModal,
  Layout,
  LogEntryTable,
} from "../../../components";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { GateDetails as GateDetailsType, GateSettings } from "../../../types";
import axios from "axios";
import moment from "moment";
import styled from "styled-components";
import {
  ButtonLabel,
  CameraLabel,
  ControllerLabel,
} from "../../../components/GateBox/GateLabels";
import { ConfigureButtonModal } from "../../../components/modals/ConfigureButtonModal";

interface GateDetailsProps {
  gate: GateDetailsType;
}

const LabelRow = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const LiveStreamBox = styled.div`
  aspect-ratio: 1.5;
  background: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

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

const ButtonRow = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: -36px;

  @media (max-width: 600px) {
    margin-bottom: 0px;
  }
`;

const GateDetails: NextPage<GateDetailsProps> = ({ gate }) => {
  const lastTime = useMemo(() => moment(gate.latestImage).unix(), [gate]);

  const [offset, setOffset] = useState<number>(90);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [action, setAction] = useState<string>("");
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Update window height
  useEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Update live stream image every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime(elapsedTime + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [elapsedTime]);

  // Execute open or close action
  const execute = (action: string) => {
    setAction("");
  };

  const deleteGate = () => {
    setAction("");
    return true;
  };

  const editGate = (data: GateSettings) => {
    setAction("");
    return true;
  };

  return (
    <Layout
      title={gate.name}
      segmented={false}
      buttons={
        <>
          <Button
            size="tiny"
            icon
            labelPosition="left"
            onClick={() => setAction("edit")}
          >
            <Icon name="edit" />
            Edit Gate
          </Button>
          <Button
            size="tiny"
            icon
            labelPosition="left"
            color="blue"
            onClick={() => setAction("button")}
          >
            <Icon name="hand point right" />
            Configure Button
          </Button>
        </>
      }
    >
      <Head>
        <title>Gate - Gatekeeper</title>
      </Head>
      <ConfirmActionModal
        action={() => execute(action)}
        close={() => setAction("")}
        isOpen={action === "open" || action === "close"}
      />
      <AddGateModal
        action={(data) => editGate(data)}
        close={() => setAction("")}
        isOpen={action === "edit"}
        edit={true}
        editData={gate.settings}
      />
      <ConfigureButtonModal
        action={() => deleteGate()}
        close={() => setAction("")}
        isOpen={action === "button"}
        initialData={{ status: gate.buttonStatus, ...gate.buttonTime }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "20px 0",
          flexFlow: "column",
        }}
      >
        <LiveStreamBox
          style={
            windowWidth > 1100 && windowHeight > 800
              ? { height: Math.min(windowHeight - 420, 1127 / 1.5) }
              : { width: "100%" }
          }
        >
          {" "}
          <Logo src="/logo_white.svg" />
          <TimeLabel>
            {moment
              .unix(lastTime - 90 + offset + elapsedTime)
              .format("HH:mm:ss")}
          </TimeLabel>
        </LiveStreamBox>
        <LabelRow>
          <ControllerLabel status={gate.controllerStatus} />
          <CameraLabel status={gate.cameraStatus} />
          <ButtonLabel status={gate.buttonStatus} />
        </LabelRow>
        <LiveStreamSlider
          type="range"
          id="points"
          name="points"
          min="0"
          max="90"
          value={offset}
          onChange={(e) => setOffset(parseInt(e.target.value))}
        />
        <ButtonRow>
          {gate.supportsClose && (
            <Button
              size="tiny"
              icon
              labelPosition="left"
              onClick={() => setAction("close")}
            >
              <Icon name="lock" />
              Close
            </Button>
          )}
          <Button
            size="tiny"
            icon
            labelPosition="left"
            color="green"
            onClick={() => setAction("open")}
          >
            <Icon name="unlock" />
            Open
          </Button>
        </ButtonRow>
      </div>
      <Header as="h3">History</Header>
      <LogEntryTable entries={gate.history} />
      <div style={{ display: "flex", flexFlow: "row-reverse" }}>
        <Link href={`/logs?gate=${gate.id}`} passHref={true}>
          <Button size="tiny" icon labelPosition="right" color="blue">
            <Icon name="arrow right" />
            See All
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const { data: response }: { data: GateDetailsType } = await axios.get(
    "/api/gates/1"
  );

  return {
    props: {
      gate: response,
    },
  };
}

export default GateDetails;
