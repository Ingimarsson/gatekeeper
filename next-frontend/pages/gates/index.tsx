import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Header, Button, Icon, Grid } from "semantic-ui-react";
import { Layout, GateBox } from "../../components";
import React, { useState } from "react";
import { Gate } from "../../types";
import axios from "axios";
import {
  AddGateData,
  AddGateModal,
} from "../../components/modals/AddGateModal";
import { ChangePasswordModal } from "../../components/modals/ChangePasswordModal";
import { getSession } from "next-auth/react";

interface GatesProps {
  gates: Gate[];
}

const Gates: NextPage<GatesProps> = ({ gates }) => {
  const [action, setAction] = useState<string>();

  const addGate = (data: AddGateData) => {
    setAction("");
    return true;
  };

  return (
    <Layout
      title="Gates"
      segmented={false}
      buttons={
        <Button
          size="tiny"
          icon
          labelPosition="left"
          color="blue"
          onClick={() => setAction("add")}
        >
          <Icon name="plus" />
          Add Gate
        </Button>
      }
    >
      <Head>
        <title>Gates - Gatekeeper</title>
      </Head>
      <AddGateModal
        action={(data) => addGate(data)}
        close={() => setAction("")}
        isOpen={action === "add"}
      />
      <Grid>
        <Grid.Row>
          {gates?.map((gate) => (
            <Grid.Column key={gate.id} mobile={16} tablet={16} computer={8}>
              <GateBox gate={gate} />
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { data: response }: { data: Gate[] } = await axios.get("/api/gates");

  return {
    props: {
      gates: response,
    },
  };
};

export default Gates;
