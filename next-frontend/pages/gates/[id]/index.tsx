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
import { Layout } from "../../../components";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { GateDetails as GateDetailsType, User } from "../../../types";
import axios from "axios";
import { LogEntryTable } from "../../../components/LogEntryTable";
import moment from "moment";
import { ConfirmActionModal } from "../../../components/modals";
import { DeleteModal } from "../../../components/modals/DeleteModal";
import {
  AddGateData,
  AddGateModal,
} from "../../../components/modals/AddGateModal";

interface GateDetailsProps {
  gate: GateDetailsType;
}

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
        <div style={{ height: 400, width: 600, background: "#444" }}></div>
        <Header as="h3">
          {moment.unix(lastTime - 90 + offset + elapsedTime).format("HH:mm:ss")}
        </Header>
        <input
          type="range"
          id="points"
          name="points"
          min="0"
          max="90"
          value={offset}
          onChange={(e) => setOffset(parseInt(e.target.value))}
          style={{ width: 500, marginBottom: 20 }}
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
      <LogEntryTable entries={gate.history} />
      <div style={{ display: "flex", flexFlow: "row-reverse" }}>
        <Button size="tiny" icon labelPosition="left" color="blue">
          <Icon name="list" />
          See All
        </Button>
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
