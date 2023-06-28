import type { NextPage } from "next";
import { Button, Header, Icon } from "semantic-ui-react";
import {
  AddGateModal,
  ConfigureButtonData,
  ConfirmActionModal,
  Layout,
  LogEntryTable,
} from "../../../components";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  GateDetails as GateDetailsType,
  GateSettings,
  UserSettings,
} from "../../../types";
import axios from "axios";
import moment from "moment";
import styled from "styled-components";
import {
  ButtonLabel,
  CameraLabel,
  ControllerLabel,
  IndicatorLabel,
} from "../../../components/GateBox/GateLabels";
import { ConfigureButtonModal } from "../../../components/modals/ConfigureButtonModal";
import api from "../../../api";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import WebsocketsClient from "../../../websockets";

interface GateDetailsProps {
  gate: GateDetailsType;
  user: UserSettings;
}

const LabelRow = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const LiveStreamBox = styled.div`
  aspect-ratio: 1.5;
  background: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    aspect-ratio: 1.5;
  }
`;

export const Logo = styled.img`
  width: 150px;
`;

const LiveStreamSlider = styled.input`
  width: 500px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const TimeLabel = styled.div`
  color: white;
  font-family: sans;
  font-size: 22px;
  font-weight: 900;
  position: absolute;
  bottom: 14px;
  background: #00000044;
  padding: 4px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const AlprLabel = styled(TimeLabel)`
  top: 10px;
  right: 10px;
  height: fit-content;
  width: fit-content;
  display: flex;
  flex-flow: column;
  gap: 6px;

  @media (max-width: 600px) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const LiveStreamBoxOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: -36px;

  @media (max-width: 600px) {
    margin-bottom: 0px;
  }
`;

interface AlprData {
  timestamp: number;
  plate: string;
  area: number;
}

const GateDetails: NextPage<GateDetailsProps> = ({ gate, user }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const session = useSession();

  const [alprData, setAlprData] = useState<AlprData | null>(null);
  const [debug, setDebug] = useState<boolean>(false);
  const [alprView, setAlprView] = useState<boolean>(false);

  const refreshWindow = () =>
    router
      .push(router.asPath, undefined, { scroll: false })
      .then(() => setElapsedTime(0));

  useEffect(() => {
    if (((session?.data?.token as string) ?? "").length < 1) {
      return;
    }
    const ws = WebsocketsClient(session?.data?.token as string);

    ws.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);

      if (data["type"] === "entry" && data["gate_id"] === gate.id) {
        refreshWindow();
      }
      if (data["type"] === "plate" && data["gate_id"] === gate.id) {
        setAlprData(data);
      }
    });

    return () => ws.close();
  }, [session?.data?.token]);

  const lastTime = useMemo(
    () =>
      parseInt(
        (alprView ? gate.latestImageAlpr ?? "" : gate.latestImage).split(".")[0]
      ) - 1,
    [gate, alprView]
  );

  const [offset, setOffset] = useState<number>(50);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [action, setAction] = useState<string>("");
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Update window height
  useEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Update live stream image every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime(elapsedTime + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [elapsedTime, gate]);

  useEffect(() => {
    const interval = setInterval(() => refreshWindow(), 5000);
    return () => {
      clearInterval(interval);
    };
  }, [router]);

  useEffect(() => {
    setElapsedTime(0);
  }, [gate]);

  // Execute open or close action
  const execute = (action: string) => {
    api()
      .post(`/gate/${gate.id}/command`, { command: action })
      .then((res) => {
        if (res.status != 200) {
          alert("Error occurred: " + JSON.stringify(res.data));
        } else {
          setAction("");
        }
      });
  };

  const editButton = (data: ConfigureButtonData) => {
    api()
      .post(`/gate/${gate.id}/button`, data)
      .then((res) => {
        if (res.status != 200) {
          alert("Error occurred: " + JSON.stringify(res.data));
        } else {
          setAction("");
          router.push(router.asPath);
        }
      });
  };

  const deleteGate = () => {
    api()
      .delete(`/gate/${gate.id}`)
      .then((res) => {
        if (res.status != 200) {
          alert("Error occurred: " + JSON.stringify(res.data));
        } else {
          setAction("");
          router.push("/gates");
        }
      });
  };

  const editGate = (data: GateSettings) => {
    api()
      .put(`/gate/${gate.id}`, data)
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
      title={gate.name}
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
              {t("edit-gate", "Edit Gate")}
            </Button>
            <Button
              size="tiny"
              icon
              labelPosition="left"
              color="blue"
              onClick={() => setAction("button")}
            >
              <Icon name="hand point right" />
              {t("configure-button", "Configure Button")}
            </Button>
          </>
        ) : null
      }
    >
      <Head>
        <title>{t("gate", "Gate")} - Gatekeeper</title>
      </Head>
      <ConfirmActionModal
        action={() => execute(action)}
        close={() => setAction("")}
        isOpen={action === "open" || action === "close"}
      />
      <AddGateModal
        submitAction={(data) => editGate(data)}
        deleteAction={() => deleteGate()}
        close={() => setAction("")}
        isOpen={action === "edit"}
        edit={true}
        editData={gate.settings}
      />
      <ConfigureButtonModal
        action={(data) => editButton(data)}
        close={() => setAction("")}
        isOpen={action === "button"}
        initialData={{ type: gate.buttonStatus, ...gate.buttonTime }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "20px 0",
          flexFlow: "column",
        }}
      >
        <LiveStreamBox
          style={
            windowWidth > 1100 && windowHeight > 800
              ? { height: Math.min(windowHeight - 420, 1127 / 1.5) }
              : { width: "100%" }
          }
        >
          {" "}
          {gate.cameraStatus === "online" ? (
            <>
              <img
                src={`/data/camera_${
                  alprView ? gate.cameraAlpr : gate.cameraGeneral
                }/live/${lastTime - 50 + offset + elapsedTime}.jpg`}
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                }}
              />{" "}
              <TimeLabel>
                {moment
                  .unix(lastTime - 50 + offset + elapsedTime)
                  .format("HH:mm:ss")}
              </TimeLabel>
              {!!debug && (
                <AlprLabel>
                  <div>
                    Timestamp:{" "}
                    {!!alprData?.timestamp &&
                      moment.unix(alprData?.timestamp).format("HH:mm:ss.SS")}
                  </div>
                  <div>Area: {alprData?.area} </div>
                  <div>Plate: {alprData?.plate}</div>
                </AlprLabel>
              )}
              <LiveStreamBoxOverlay>
                <Link href={`/cockpit?gate=${gate.id}`} passHref={true}>
                  <Button size="mini" icon labelPosition="left">
                    <Icon name="expand" /> {t("full-screen", "Cockpit")}
                  </Button>
                </Link>
                <Button
                  size="mini"
                  icon
                  labelPosition="left"
                  onClick={() => setDebug(!debug)}
                >
                  <Icon name="bug" /> {t("debug-mode", "Debug")}
                </Button>
                {!!gate.cameraAlpr &&
                <Button
                  size="mini"
                  icon
                  labelPosition="left"
                  color="blue"
                  onClick={() => setAlprView(!alprView)}
                >
                  <Icon name="video" /> {t("alpr-view", "ALPR")}
                </Button>}
              </LiveStreamBoxOverlay>
            </>
          ) : (
            <Logo src="/logo_white.svg" />
          )}
        </LiveStreamBox>
        <LabelRow>
          <ControllerLabel status={gate.controllerStatus} />
          <CameraLabel status={gate.cameraStatus} />
          <ButtonLabel status={gate.buttonStatus} />
          {gate.indicators.map((indicator, idx) => (
            <IndicatorLabel indicator={indicator} key={idx} />
          ))}
        </LabelRow>
        {gate.cameraStatus === "online" && (
          <LiveStreamSlider
            type="range"
            id="points"
            name="points"
            min="0"
            max="50"
            value={offset}
            onChange={(e) => setOffset(parseInt(e.target.value))}
          />
        )}
        <ButtonRow>
          {gate.supportsClose && (
            <Button
              size="tiny"
              icon
              labelPosition="left"
              onClick={() =>
                user.confirm_modal ? setAction("close") : execute("close")
              }
            >
              <Icon name="lock" />
              {t("close", "Close")}
            </Button>
          )}
          {gate.supportsOpen && (
            <Button
              size="tiny"
              icon
              labelPosition="left"
              color="green"
              onClick={() =>
                user.confirm_modal ? setAction("open") : execute("open")
              }
            >
              <Icon name="unlock" />
              {t("open", "Open")}
            </Button>
          )}
        </ButtonRow>
      </div>
      <Header as="h3">{t("history", "History")}</Header>
      <LogEntryTable entries={gate.logs} />
      <div style={{ display: "flex", flexFlow: "row-reverse" }}>
        <Link href={`/logs?gate=${gate.id}`} passHref={true}>
          <Button size="tiny" icon labelPosition="right" color="blue">
            <Icon name="arrow right" />
            {t("see-all", "See all")}
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data: gate }: { data: GateDetailsType } = await api(context).get(
    "/gate/" + context.params?.id
  );
  const { data: user }: { data: UserSettings } = await api(context).get(
    "/auth/user"
  );

  return {
    props: {
      gate,
      user,
    },
  };
};

export default GateDetails;
