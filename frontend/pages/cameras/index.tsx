import type { NextPage } from "next";
import { Label, Table } from "semantic-ui-react";
import { Layout } from "../../components";
import React from "react";
import Head from "next/head";
import { Camera } from "../../types";
import api from "../../api";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface CamerasProps {
  cameras: Camera[];
}

const Cameras: NextPage<CamerasProps> = ({ cameras }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Layout title={t("cameras", "Cameras")} segmented={false} buttons={<></>}>
      <Head>
        <title>{t("cameras", "Cameras")} - Gatekeeper</title>
      </Head>
      <Table>
        <Table.Header>
          <Table.HeaderCell>{t("name", "Name")}</Table.HeaderCell>
          <Table.HeaderCell>{t("ip-address", "IP address")}</Table.HeaderCell>
          <Table.HeaderCell>{t("cpu-usage", "CPU usage")}</Table.HeaderCell>
          <Table.HeaderCell>{t("is-visible", "Is visible")}</Table.HeaderCell>
          <Table.HeaderCell>{t("is-alive", "Is alive")}</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {cameras.map((camera) => (
            <Table.Row key={camera.id}>
              <Table.Cell>{camera.name}</Table.Cell>
              <Table.Cell>{camera.cpuPercent} %</Table.Cell>
              <Table.Cell>{camera.ipAddress} %</Table.Cell>
              <Table.Cell>
                <Label color={camera.isVisible ? undefined : "red"}>
                  {camera.isVisible ? t("yes", "Yes") : t("no", "No")}
                </Label>
              </Table.Cell>
              <Table.Cell>
                <Label color={camera.isAlive ? undefined : "red"}>
                  {camera.isAlive ? t("yes", "Yes") : t("no", "No")}
                </Label>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data: response }: { data: Camera[] } = await api(context).get(
    "/camera",
    {
      params: context.query,
    }
  );

  return {
    props: {
      cameras: response,
    },
  };
};

export default Cameras;
