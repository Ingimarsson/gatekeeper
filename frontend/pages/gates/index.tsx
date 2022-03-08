import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Button, Grid, Icon } from "semantic-ui-react";
import { AddGateModal, GateBox, Layout } from "../../components";
import React, { useEffect, useState } from "react";
import { Gate, GateSettings } from "../../types";
import api from "../../api";
import { useRouter } from "next/router";

interface GatesProps {
  gates: Gate[];
}

const Gates: NextPage<GatesProps> = ({ gates }) => {
  const router = useRouter();

  const [action, setAction] = useState<string>();

  const addGate = (data: GateSettings) => {
    setAction("");
    return true;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      router.replace(router.asPath);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [router]);

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
  const { data: response }: { data: Gate[] } = await api(context).get("/gate");

  console.log(response);

  return {
    props: {
      gates: response,
    },
  };
};

export default Gates;
