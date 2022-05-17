import type { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import { Button, Grid, Icon } from "semantic-ui-react";
import { AddGateModal, GateBox, Layout } from "../../components";
import React, { useEffect, useState } from "react";
import { Gate, GateSettings, UserSettings } from "../../types";
import api from "../../api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface GatesProps {
  gates: Gate[];
  user: UserSettings;
}

const Gates: NextPage<GatesProps> = ({ gates, user }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const session = useSession();

  const [action, setAction] = useState<string>();

  const addGate = (data: GateSettings) => {
    api()
      .post(`/gate`, data)
      .then((res) => {
        if (res.status != 200) {
          alert("Error occurred: " + JSON.stringify(res.data));
        } else {
          setAction("");
          router.push(router.asPath);
        }
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      router.push(router.asPath, undefined, { scroll: false });
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [router]);

  return (
    <Layout
      title={t("gates", "Gates")}
      segmented={false}
      buttons={
        <>
          {session.data?.admin && (
            <Button
              size="tiny"
              icon
              labelPosition="left"
              color="blue"
              onClick={() => setAction("add")}
            >
              <Icon name="plus" />
              {t("add-gate", "Add Gate")}
            </Button>
          )}
        </>
      }
    >
      <Head>
        <title>{t("gates", "Gates")} - Gatekeeper</title>
      </Head>
      <AddGateModal
        submitAction={(data) => addGate(data)}
        close={() => setAction("")}
        isOpen={action === "add"}
      />
      <Grid>
        <Grid.Row>
          {gates?.map((gate) => (
            <Grid.Column key={gate.id} mobile={16} tablet={16} computer={8}>
              <GateBox gate={gate} confirmModal={user.confirm_modal} />
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data: gates }: { data: Gate[] } = await api(context).get("/gate");
  const { data: user }: { data: UserSettings } = await api(context).get(
    "/auth/user"
  );

  return {
    props: {
      gates,
      user,
    },
  };
};

export default Gates;
