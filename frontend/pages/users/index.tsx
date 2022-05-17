import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Button, Icon, Label, Table } from "semantic-ui-react";
import { AddUserData, AddUserModal, Layout } from "../../components";
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { User } from "../../types";
import api from "../../api";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface UsersProps {
  users: User[];
}

const Users: NextPage<UsersProps> = ({ users }) => {
  const [action, setAction] = useState<string>();

  const router = useRouter();
  const { t } = useTranslation();
  const session = useSession();

  const addUser = (data: AddUserData) => {
    api()
      .post("/user", {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        webAccess: data.webAccess,
        admin: data.admin,
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

  return (
    <Layout
      title={t("users", "Users")}
      segmented={false}
      buttons={
        session.data?.admin ? (
          <Button
            size="tiny"
            icon
            labelPosition="left"
            color="blue"
            onClick={() => setAction("add")}
          >
            <Icon name="plus" />
            {t("add-user", "Add User")}
          </Button>
        ) : null
      }
    >
      <Head>
        <title>{t("users", "Users")} - Gatekeeper</title>
      </Head>
      <AddUserModal
        submitAction={(data) => addUser(data)}
        close={() => setAction("")}
        isOpen={action === "add"}
      />
      <Table>
        <Table.Header>
          <Table.HeaderCell>{t("name", "Name")}</Table.HeaderCell>
          <Table.HeaderCell>{t("username", "Username")}</Table.HeaderCell>
          <Table.HeaderCell>{t("email", "Email")}</Table.HeaderCell>
          <Table.HeaderCell>{t("role", "Role")}</Table.HeaderCell>
          <Table.HeaderCell>{t("web-access", "Web Access")}</Table.HeaderCell>
          <Table.HeaderCell>{t("enabled", "Enabled")}</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
            <Link key={user.id} href={`/users/${user.id}`}>
              <Table.Row>
                <Table.Cell>
                  <Link href={`/users/${user.id}`} passHref={true}>
                    <a>{user.name}</a>
                  </Link>
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Label color={user.admin ? "green" : undefined}>
                    {user.admin ? t("admin", "Admin") : t("user", "User")}
                  </Label>
                </Table.Cell>
                <Table.Cell>
                  <Label color={user.webAccess ? undefined : "red"}>
                    {user.webAccess ? t("yes", "Yes") : t("no", "No")}
                  </Label>
                </Table.Cell>
                <Table.Cell>
                  <Label color={user.enabled ? undefined : "red"}>
                    {user.enabled
                      ? t("enabled", "Enabled")
                      : t("disabled", "Disabled")}
                  </Label>
                </Table.Cell>
              </Table.Row>
            </Link>
          ))}
        </Table.Body>
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
  const { data: response }: { data: User[] } = await api(context).get("/user");
  return {
    props: {
      users: response,
    },
  };
};

export default Users;
