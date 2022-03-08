import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Button, Icon, Label, Table } from "semantic-ui-react";
import { AddUserData, AddUserModal, Layout } from "../../components";
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { User } from "../../types";
import api from "../../api";
import { getSession } from "next-auth/react";

interface UsersProps {
  users: User[];
}

const Users: NextPage<UsersProps> = ({ users }) => {
  const [action, setAction] = useState<string>();

  const addUser = (data: AddUserData) => {
    setAction("");
    return true;
  };

  return (
    <Layout
      title="Users"
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
          Add User
        </Button>
      }
    >
      <Head>
        <title>Users - Gatekeeper</title>
      </Head>
      <AddUserModal
        action={(data) => addUser(data)}
        close={() => setAction("")}
        isOpen={action === "add"}
      />
      <Table>
        <Table.Header>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Username</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Role</Table.HeaderCell>
          <Table.HeaderCell>Web Access</Table.HeaderCell>
          <Table.HeaderCell>Enabled</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
            <Link key={user.id} href={`/users/${user.id}`}>
              <Table.Row>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Label color={user.admin ? "green" : undefined}>
                    {user.admin ? "Admin" : "User"}
                  </Label>
                </Table.Cell>
                <Table.Cell>
                  <Label color={user.webAccess ? undefined : "red"}>
                    {user.webAccess ? "Yes" : "No"}
                  </Label>
                </Table.Cell>
                <Table.Cell>
                  <Label color={user.enabled ? undefined : "red"}>
                    {user.enabled ? "Enabled" : "Disabled"}
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
