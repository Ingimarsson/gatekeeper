import type { NextPage } from "next";
import { Button, Header, Icon, Label, Table } from "semantic-ui-react";
import {
  AddMethodData,
  AddMethodModal,
  AddUserData,
  AddUserModal,
  ChangePasswordData,
  ChangePasswordModal,
  Code,
  DeleteModal,
  Layout,
  LogEntryTable,
} from "../../../components";
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Gate, User, UserDetails as UserDetailsType } from "../../../types";
import axios from "axios";
import moment from "moment";

interface UserDetailsProps {
  user: UserDetailsType;
  gates: Gate[];
}

const UserDetails: NextPage<UserDetailsProps> = ({ user, gates }) => {
  const [action, setAction] = useState<string>();
  const [currentMethod, setCurrentMethod] = useState<number>();

  const editUser = (data: AddUserData) => {
    setAction("");
    return true;
  };

  const changePassword = (data: ChangePasswordData) => {
    setAction("");
    return true;
  };

  const addMethod = (data: AddMethodData) => {
    setAction("");
    return true;
  };

  const editMethod = (data: AddMethodData) => {};

  const openEditModal = (id: number) => {
    setCurrentMethod(id);
    setAction("edit-method");
  };

  return (
    <Layout
      title={user.user.name}
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
            Edit User
          </Button>
          <Button
            size="tiny"
            icon
            labelPosition="left"
            color="blue"
            onClick={() => setAction("change-password")}
          >
            <Icon name="lock" />
            Change Password
          </Button>
        </>
      }
    >
      <Head>
        <title>User Details - Gatekeeper</title>
      </Head>
      <AddUserModal
        action={(data) => editUser(data)}
        close={() => setAction("")}
        isOpen={action === "edit"}
        edit={true}
        editData={user.user}
      />
      <ChangePasswordModal
        action={(data) => changePassword(data)}
        close={() => setAction("")}
        isOpen={action === "change-password"}
      />
      <AddMethodModal
        action={(data) => addMethod(data)}
        close={() => setAction("")}
        gates={gates}
        isOpen={action === "add-method" || action === "edit-method"}
        edit={action === "edit-method"}
        methodId={currentMethod}
        editData={(() => {
          if (action !== "edit-method") return undefined;
          const u = user.methods.find((method) => method.id === currentMethod);
          return !!u
            ? {
                ...u,
                limitHours:
                  u.timeLimits.startHour !== "" || u.timeLimits.endHour !== "",
                limitDate:
                  u.timeLimits.startDate !== "" || u.timeLimits.endDate !== "",
              }
            : undefined;
        })()}
      />
      <div style={{ maxWidth: 400 }}>
        <Table className="readonly">
          <Table.Row>
            <Table.Cell>
              <b>Username</b>
            </Table.Cell>
            <Table.Cell>{user.user.username}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <b>Email</b>
            </Table.Cell>
            <Table.Cell>{user.user.email}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <b>Role</b>
            </Table.Cell>
            <Table.Cell>
              <Label size="tiny" color={user.user.admin ? "green" : undefined}>
                {user.user.admin ? "Admin" : "User"}
              </Label>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <b>Web Access</b>
            </Table.Cell>
            <Table.Cell>
              <Label
                size="tiny"
                color={user.user.webAccess ? undefined : "red"}
              >
                {user.user.webAccess ? "Yes" : "No"}
              </Label>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <b>Enabled</b>
            </Table.Cell>
            <Table.Cell>
              <Label size="tiny" color={user.user.enabled ? undefined : "red"}>
                {user.user.enabled ? "Enabled" : "Disabled"}
              </Label>
            </Table.Cell>
          </Table.Row>
        </Table>
      </div>
      <Header as="h3">Access Methods</Header>
      <Table>
        <Table.Header>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Code</Table.HeaderCell>
          <Table.HeaderCell>Gate</Table.HeaderCell>
          <Table.HeaderCell>Last Usage</Table.HeaderCell>
          <Table.HeaderCell>Time Limits</Table.HeaderCell>
          <Table.HeaderCell>Comment</Table.HeaderCell>
          <Table.HeaderCell>Enabled</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {user.methods.map((method) => (
            <Table.Row key={method.id} onClick={() => openEditModal(method.id)}>
              <Table.Cell>{method.typeName}</Table.Cell>
              <Table.Cell>
                <Code code={method.code} />
              </Table.Cell>
              <Table.Cell>{method.gateName ?? "All"}</Table.Cell>
              <Table.Cell>
                {moment(method.lastUsage).format("ll HH:mm")}
              </Table.Cell>
              <Table.Cell>
                {method.timeLimits.startDate || method.timeLimits.startHour ? (
                  <div>
                    {method.timeLimits.startDate && (
                      <>
                        <div>
                          From{" "}
                          {moment(method.timeLimits.startDate).format(
                            "ll HH:mm"
                          )}
                        </div>
                        <div>
                          Until{" "}
                          {moment(method.timeLimits.endDate).format("ll HH:mm")}
                        </div>
                      </>
                    )}
                    {method.timeLimits.startHour && (
                      <div>
                        Between {method.timeLimits.startHour} -{" "}
                        {method.timeLimits.endHour}
                      </div>
                    )}
                  </div>
                ) : (
                  "None"
                )}
              </Table.Cell>
              <Table.Cell>{method.comment}</Table.Cell>
              <Table.Cell>
                <Label>{method.enabled ? "Enabled" : "Disabled"}</Label>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div>
        <div style={{ display: "flex", flexFlow: "row-reverse" }}>
          <Button
            size="tiny"
            icon
            labelPosition="left"
            color="blue"
            onClick={() => setAction("add-method")}
          >
            <Icon name="plus" />
            Add Method
          </Button>
        </div>
      </div>
      <Header as="h3">History</Header>
      <LogEntryTable entries={user.history} />
      <div style={{ display: "flex", flexFlow: "row-reverse" }}>
        <Link href={`/logs?user=${user.user.id}`} passHref={true}>
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
  const { data: user }: { data: UserDetailsType[] } = await axios.get(
    "/api/users/1"
  );
  const { data: gates }: { data: Gate[] } = await axios.get("/api/gates");

  return {
    props: {
      user,
      gates,
    },
  };
}

export default UserDetails;
