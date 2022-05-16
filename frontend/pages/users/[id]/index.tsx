import type { NextPage } from "next";
import { Button, Header, Icon, Input, Label, Table } from "semantic-ui-react";
import {
  AddMethodData,
  AddMethodModal,
  AddUserData,
  AddUserModal,
  ChangePasswordData,
  ChangePasswordModal,
  Code,
  Layout,
  LogEntryTable,
} from "../../../components";
import React, { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Gate,
  User,
  UserDetails as UserDetailsType,
  CodeType,
} from "../../../types";
import api from "../../../api";
import moment from "moment";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";

const serializeCode = (type: string, code: CodeType) => {
  if (type === "keypad-both") {
    return code?.pin + "-" + code?.card;
  }
  if (type === "keypad-pin") {
    return code?.pin;
  }
  if (type === "keypad-card") {
    return code?.card;
  }
  if (type === "plate") {
    return code?.plate;
  }
};

const deserializeCode = (type: string, code: string | null): CodeType => {
  if (type === "keypad-both") {
    return {
      pin: code?.split("-")[0],
      card: code?.split("-")[1],
    };
  }
  if (type === "keypad-pin") {
    return {
      pin: code,
    };
  }
  if (type === "keypad-card") {
    return {
      card: code,
    };
  }
  if (type === "plate") {
    return {
      plate: code,
    };
  }
  return {};
};

interface UserDetailsProps {
  user: UserDetailsType;
  gates: Gate[];
}

const UserDetails: NextPage<UserDetailsProps> = ({ user, gates }) => {
  const [action, setAction] = useState<string>();
  const [currentMethod, setCurrentMethod] = useState<number>();

  const [searchInput, setSearchInput] = useState<string>("");
  const [methodsPage, setMethodsPage] = useState<number>(1);

  const router = useRouter();
  const { t } = useTranslation();
  const session = useSession();

  const resultMethods = useMemo(
    () =>
      user.methods.filter(
        (method) =>
          method.code?.toLowerCase().includes(searchInput.toLowerCase()) ||
          method.comment.toLowerCase().includes(searchInput.toLowerCase())
      ),
    [searchInput, methodsPage, user]
  );

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(resultMethods.length / 10)),
    [resultMethods]
  );

  const editUser = (data: AddUserData) => {
    api()
      .put(`/user/${user.user.id}`, {
        name: data.name,
        username: data.username,
        email: data.email,
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

  const deleteUser = () => {
    api()
      .delete(`/user/${user.user.id}`)
      .then((res) => {
        if (res.status != 200) {
          alert("Error occurred: " + JSON.stringify(res.data));
        } else {
          setAction("");
          router.push("/users");
        }
      });
  };

  const changePassword = (data: ChangePasswordData) => {
    api()
      .post(`/user/${user.user.id}/password`, { password: data.password })
      .then((res) => {
        if (res.status != 200) {
          alert("Error occurred: " + JSON.stringify(res.data));
        } else {
          setAction("");
          router.push(router.asPath);
        }
      });
  };

  const addMethod = (data: AddMethodData) => {
    api()
      .post(`/user/${user.user.id}/method`, {
        type: data.type,
        code: serializeCode(data.type, data.code),
        gate: data.allGates ? null : data.gate,
        startDate: data.limitDate ? data.startDate : null,
        endDate: data.limitDate ? data.endDate : null,
        startHour: data.limitHours ? data.startHour : null,
        endHour: data.limitHours ? data.endHour : null,
        comment: data.comment,
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

  const deleteMethod = (id: number) => {
    api()
      .delete(`/user/method/${id}`)
      .then((res) => {
        if (res.status != 200) {
          alert("Error occurred: " + JSON.stringify(res.data));
        } else {
          setAction("");
          router.push(router.asPath);
        }
      });
  };

  const editMethod = (data: AddMethodData) => {
    api()
      .put(`/user/method/${data.id}`, {
        type: data.type,
        code: serializeCode(data.type, data.code),
        gate: data.allGates ? null : data.gate,
        startDate: data.limitDate ? data.startDate : null,
        endDate: data.limitDate ? data.endDate : null,
        startHour: data.limitHours ? data.startHour : null,
        endHour: data.limitHours ? data.endHour : null,
        comment: data.comment,
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
    setCurrentMethod(id);
    setAction("edit-method");
  };

  return (
    <Layout
      title={user.user.name}
      segmented={false}
      buttons={
        session.data?.admin ? (
          <>
            <Button
              size="tiny"
              icon
              labelPosition="left"
              onClick={() => setAction("edit")}
            >
              <Icon name="edit" />
              {t("edit-user", "Edit User")}
            </Button>
            <Button
              size="tiny"
              icon
              labelPosition="left"
              color="blue"
              onClick={() => setAction("change-password")}
            >
              <Icon name="lock" />
              {t("change-password", "Change Password")}
            </Button>
          </>
        ) : null
      }
    >
      <Head>
        <title>{t("user-details", "User Details")} - Gatekeeper</title>
      </Head>
      <AddUserModal
        submitAction={(data) => editUser(data)}
        deleteAction={() => deleteUser()}
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
        submitAction={
          action === "add-method"
            ? (data) => addMethod(data)
            : (data) => editMethod(data)
        }
        deleteAction={(id) => deleteMethod(id)}
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
                code: deserializeCode(u.type, u.code),
                allGates: !u.gateId,
                gate: u.gateId,
                limitHours: !!u.startHour && !!u.endHour,
                limitDate: !!u.startDate && !!u.endDate,
              }
            : undefined;
        })()}
      />
      <div style={{ maxWidth: 400 }}>
        <Table className="readonly">
          <Table.Row>
            <Table.Cell>
              <b>{t("username", "Username")}</b>
            </Table.Cell>
            <Table.Cell>{user.user.username}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <b>{t("email", "Email")}</b>
            </Table.Cell>
            <Table.Cell>{user.user.email}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <b>{t("language", "Language")}</b>
            </Table.Cell>
            <Table.Cell>{t(user.user.language)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <b>{t("role", "Role")}</b>
            </Table.Cell>
            <Table.Cell>
              <Label size="tiny" color={user.user.admin ? "green" : undefined}>
                {user.user.admin ? t("admin", "Admin") : t("user", "User")}
              </Label>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <b>{t("web-access", "Web Access")}</b>
            </Table.Cell>
            <Table.Cell>
              <Label
                size="tiny"
                color={user.user.webAccess ? undefined : "red"}
              >
                {user.user.webAccess ? t("yes", "Yes") : t("no", "No")}
              </Label>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <b>{t("enabled", "Enabled")}</b>
            </Table.Cell>
            <Table.Cell>
              <Label size="tiny" color={user.user.enabled ? undefined : "red"}>
                {user.user.enabled
                  ? t("enabled", "Enabled")
                  : t("disabled", "Disabled")}
              </Label>
            </Table.Cell>
          </Table.Row>
        </Table>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5em",
            marginTop: "1em",
          }}
        >
          <Header as="h3" style={{ margin: 0 }}>
            {t("methods", "Access Methods")}
          </Header>
          <div>
            <Input
              icon="search"
              placeholder="Search..."
              size="mini"
              className="search-input"
              style={{ marginRight: "1em" }}
              value={searchInput}
              onChange={(e) => {
                setMethodsPage(1);
                setSearchInput(e.target.value);
              }}
            />
            {session.data?.admin ? (
              <Button
                size="tiny"
                icon
                style={{ marginTop: "1px" }}
                labelPosition="left"
                color="blue"
                onClick={() => setAction("add-method")}
              >
                <Icon name="plus" />
                {t("add-method", "Add Method")}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <Table className={session.data?.admin ? "" : "readonly"}>
        <Table.Header>
          <Table.HeaderCell>{t("type", "Type")}</Table.HeaderCell>
          <Table.HeaderCell>{t("code", "Code")}</Table.HeaderCell>
          <Table.HeaderCell>{t("gate", "Gate")}</Table.HeaderCell>
          <Table.HeaderCell>{t("time-limits", "Time Limits")}</Table.HeaderCell>
          <Table.HeaderCell>{t("comment", "Comment")}</Table.HeaderCell>
          <Table.HeaderCell>{t("enabled", "Enabled")}</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {resultMethods
            .slice((methodsPage - 1) * 10, methodsPage * 10)
            .map((method) => (
              <Table.Row
                key={method.id}
                onClick={() =>
                  session.data?.admin ? openEditModal(method.id) : null
                }
              >
                <Table.Cell>{t(method.type)}</Table.Cell>
                <Table.Cell>
                  <Code type={method.type} code={method.code} />
                </Table.Cell>
                <Table.Cell>
                  {method.gate ?? t("all-gates", "All Gates")}
                </Table.Cell>
                <Table.Cell>
                  {method.startDate || method.startHour ? (
                    <div>
                      {method.startDate && (
                        <>
                          <div>
                            {t("from", "From")}{" "}
                            {moment(method.startDate).format("ll HH:mm")}
                          </div>
                          <div>
                            {t("until", "Until")}{" "}
                            {moment(method.endDate).format("ll HH:mm")}
                          </div>
                        </>
                      )}
                      {method.startHour && (
                        <div>
                          {t("between", "Between")} {method.startHour} -{" "}
                          {method.endHour}
                        </div>
                      )}
                    </div>
                  ) : (
                    t("none", "None")
                  )}
                </Table.Cell>
                <Table.Cell>{method.comment}</Table.Cell>
                <Table.Cell>
                  <Label color={method.enabled ? undefined : "red"}>
                    {method.enabled
                      ? t("enabled", "Enabled")
                      : t("disabled", "Disabled")}
                  </Label>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      {pageCount > 1 && (
        <div
          style={{
            display: "flex",
            flexFlow: "row-reverse",
            alignItems: "center",
            gap: "1em",
          }}
        >
          <Button.Group size="tiny">
            <Button icon onClick={() => setMethodsPage(1)}>
              <Icon name="angle double left" />
            </Button>
            <Button
              icon
              onClick={() => setMethodsPage(Math.max(1, methodsPage - 1))}
            >
              <Icon name="angle left" />
            </Button>
            <Button
              icon
              onClick={() =>
                setMethodsPage(Math.min(pageCount, methodsPage + 1))
              }
            >
              <Icon name="angle right" />
            </Button>
            <Button icon onClick={() => setMethodsPage(pageCount)}>
              <Icon name="angle double right" />
            </Button>
          </Button.Group>
          <span>
            {resultMethods.length} methods (page {methodsPage} of {pageCount})
          </span>
        </div>
      )}
      <Header as="h3">{t("history", "History")}</Header>
      <LogEntryTable entries={user.logs} />
      <div style={{ display: "flex", flexFlow: "row-reverse" }}>
        <Link href={`/logs?user=${user.user.id}`} passHref={true}>
          <Button size="tiny" icon labelPosition="right" color="blue">
            <Icon name="arrow right" />
            {t("see-all", "See All")}
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data: user }: { data: UserDetailsType[] } = await api(context).get(
    "/user/" + context.params?.id
  );
  const { data: gates }: { data: Gate[] } = await api(context).get("/gate");

  return {
    props: {
      user,
      gates,
    },
  };
};

export default UserDetails;
