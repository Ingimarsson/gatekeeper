import type { NextPage } from "next";
import { Button, Header, Icon } from "semantic-ui-react";
import {
  AddGateData,
  AddGateModal,
  ConfirmActionModal,
  DeleteModal,
  Layout,
  LogEntryTable,
} from "../../../components";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { GateDetails as GateDetailsType } from "../../../types";
import axios from "axios";
import moment from "moment";
import styled from "styled-components";

interface GateDetailsProps {
  gate: GateDetailsType;
}

const LiveStreamBox = styled.div`
  width: 100%;
  aspect-ratio: 1.5;
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

const GateDetails: NextPage<GateDetailsProps> = ({ gate }) => {
  const lastTime = useMemo(() => moment(gate.latestImage).unix(), [gate]);

  const [offset, setOffset] = useState<number>(90);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [action, setAction] = useState<string>("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime(elapsedTime + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [elapsedTime]);

  const execute = (action: string) => {
    setAction("");
  };

  const deleteGate = () => {
    setAction("");
    return true;
  };

  const editGate = (data: AddGateData) => {
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
            color="red"
            onClick={() => setAction("delete")}
          >
            <Icon name="delete" />
            Delete Gate
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
      <DeleteModal
        action={() => deleteGate()}
        close={() => setAction("")}
        isOpen={action === "delete"}
        type="Gate"
        name={gate.name}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "20px 0",
          flexFlow: "column",
        }}
      >
        <LiveStreamBox>
          {" "}
          <Logo src="/logo_white.svg" />
        </LiveStreamBox>
        <Header as="h3">
          {moment.unix(lastTime - 90 + offset + elapsedTime).format("HH:mm:ss")}
        </Header>
        <LiveStreamSlider
          type="range"
          id="points"
          name="points"
          min="0"
          max="90"
          value={offset}
          onChange={(e) => setOffset(parseInt(e.target.value))}
        />
        <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
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
        </div>
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
