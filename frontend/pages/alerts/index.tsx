import type { NextPage } from "next";
import { AddEmailAlertModal, Layout } from "../../components";
import React, { useState } from "react";
import Head from "next/head";
import { Alert, Gate, User } from "../../types";
import { Button, Header, Icon, Label, Table } from "semantic-ui-react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import api from "../../api";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface AlertsProps {
  alerts: Alert[];
  gates: Gate[];
  users: User[];
}

const Alerts: NextPage<AlertsProps> = ({ alerts, gates, users }) => {
  const { t } = useTranslation();

  const [action, setAction] = useState<string>("");
  const [currentAlert, setCurrentAlert] = useState<number>();

  const router = useRouter();

  const addAlert = (data: Alert) => {
    api()
      .post("/alert", {
        name: data.name,
        gateId: !!data.gateId ? data.gateId : null,
        userId: !!data.userId ? data.userId : null,
        type: data.type !== "any" ? data.type : null,
        code: data.code !== "" ? data.code : null,
        timeLimits: data.timeLimits,
        startHour: data.startHour,
        endHour: data.endHour,
        failedAttempts: data.failedAttempts,
        enabled: data.enabled,
      })
      .then((res) => {
        if (res.status != 200) {
          alert("Error occurred: " + JSON.stringify(res.data));
        } else {
          setAction("");
          router.push(router.asPath);
        }
      });
  };

  const deleteAlert = (id: number) => {
    api()
      .delete(`/alert/${id}`)
      .then((res) => {
        if (res.status != 200) {
          alert("Error occurred: " + JSON.stringify(res.data));
        } else {
          setAction("");
          router.push(router.asPath);
        }
      });
  };

  const editAlert = (data: Alert) => {
    api()
      .put(`/alert/${data.id}`, {
        name: data.name,
        gateId: !!data.gateId ? data.gateId : null,
        userId: !!data.userId ? data.userId : null,
        type: data.type !== "any" ? data.type : null,
        code: data.code !== "" ? data.code : null,
        timeLimits: data.timeLimits,
        startHour: data.startHour,
        endHour: data.endHour,
        failedAttempts: data.failedAttempts,
        enabled: data.enabled,
      })
      .then((res) => {
        if (res.status != 200) {
          alert("Error occurred: " + JSON.stringify(res.data));
        } else {
          setAction("");
          router.push(router.asPath);
        }
      });
  };

  const openEditModal = (id: number) => {
    setCurrentAlert(id);
    setAction("edit-alert");
  };

  return (
    <Layout
      title={t("email-alerts", "Email Alerts")}
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
          {t("add-alert", "Add Alert")}
        </Button>
      }
    >
      <Head>
        <title>{t("email-alerts", "Email Alerts")} - Gatekeeper</title>
      </Head>
      <AddEmailAlertModal
        submitAction={
          action === "add"
            ? (data) => addAlert(data)
            : (data) => editAlert(data)
        }
        deleteAction={(id) => deleteAlert(id)}
        close={() => setAction("")}
        gates={gates}
        users={users}
        isOpen={action === "add" || action === "edit-alert"}
        edit={action === "edit-alert"}
        alertId={currentAlert}
        editData={((alert) => {
          return alert
            ? {
                ...alert,
                userId: Number(alert?.userId) ?? 0,
                gateId: Number(alert?.gateId) ?? 0,
                type: alert?.type ?? "any",
              }
            : undefined;
        })(alerts.find((alert) => alert.id === currentAlert))}
      />
      <Table>
        <Table.Header>
          <Table.HeaderCell>{t("name", "Name")}</Table.HeaderCell>
          <Table.HeaderCell>{t("gate", "Gate")}</Table.HeaderCell>
          <Table.HeaderCell>{t("user", "User")}</Table.HeaderCell>
          <Table.HeaderCell>{t("method-type", "Method Type")}</Table.HeaderCell>
          <Table.HeaderCell>{t("code", "Code")}</Table.HeaderCell>
          <Table.HeaderCell>{t("time-limits", "Time Limits")}</Table.HeaderCell>
          <Table.HeaderCell>{t("result", "Result")}</Table.HeaderCell>
          <Table.HeaderCell>{t("enabled", "Enabled")}</Table.HeaderCell>
        </Table.Header>
        {alerts.map((alert) => (
          <Table.Row key={alert.id} onClick={() => openEditModal(alert.id)}>
            <Table.Cell>{alert.name}</Table.Cell>
            <Table.Cell>{alert.gate ?? t("all-gates", "All Gates")}</Table.Cell>
            <Table.Cell>{alert.user ?? t("all-users", "All users")}</Table.Cell>
            <Table.Cell>
              {alert.type ? t(alert.type) : t("all-types", "All Types")}
            </Table.Cell>
            <Table.Cell>{alert.code}</Table.Cell>
            <Table.Cell>
              {alert.timeLimits && `${alert.startHour} - ${alert.endHour}`}
            </Table.Cell>
            <Table.Cell>
              {t("granted", "Granted")}
              {alert.failedAttempts && " / " + t("failed", "Failed")}
            </Table.Cell>
            <Table.Cell>
              <Label color={alert.enabled ? undefined : "red"}>
                {alert.enabled
                  ? t("enabled", "Enabled")
                  : t("disabled", "Disabled")}
              </Label>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
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
  const { data: alerts }: { data: Alert[] } = await api(context).get("/alert");
  const { data: gates }: { data: Gate[] } = await api(context).get("/gate");
  const { data: users }: { data: User[] } = await api(context).get("/user");

  return {
    props: {
      alerts,
      gates,
      users,
    },
  };
};

export default Alerts;
