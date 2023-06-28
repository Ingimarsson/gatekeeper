import type { NextPage } from "next";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { Camera, Config, Gate } from "../../types";
import api from "../../api";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import moment from "moment";
import { ScreenType } from "../../components/LiveScreen/types";
import { LiveCameraScreen } from "../../components/LiveScreen/LiveCameraScreen";
import { LiveExternalScreen } from "../../components/LiveScreen/LiveExternalScreen";
import WebsocketsClient from "../../websockets";
import { useSession } from "next-auth/react";
import { LiveGateScreen } from "../../components/LiveScreen/LiveGateScreen";
import { InstructionsModal } from "../../components/LiveScreen/InstructionsModal";

export const Container = styled.div`
  background: #111;
  width: 100vw;
  height: 100vh;
  display: flex;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  font-family: Lato;
  flex-wrap: wrap-reverse;
  position: relative;
  overflow-y: hidden;
  cursor: none;
`;

export const Modal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000e;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  z-index: 10;

  h1 {
    font-size: 6vh;
  }
  h2 {
    font-size: 3vh;
  }
  h3 {
    font-size: 2vh;
  }
`;

export const TopLine = styled.div`
  position: absolute;
  background: #000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 6vh;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5vh;

  h1 {
    font-size: 2.5vh;
    margin: 0;
  }

  h2 {
    font-size: 1.6vh;
    margin: 0;
  }

  img {
    height: 2.7vh;
  }
`;

interface TopLineHalfProps {
  align?: string;
}

export const TopLineHalf = styled.div<TopLineHalfProps>`
  height: 100%;
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-basis: 0;
  justify-content: ${(props) => props.align ?? "left"};
  gap: 30px;
  white-space: nowrap;
`;

interface MonitorProps {
  gates: Gate[];
  config: Config;
}

type ModalType = "none" | "gate-open" | "gate-close" | "instructions";

const ROLL_SECONDS = 20;

const Monitor: NextPage<MonitorProps> = ({ gates, config }) => {
  const router = useRouter();
  const session = useSession();
  const { t } = useTranslation();

  const getTime = () => moment().format("HH:mm:ss");

  const [time, setTime] = useState<string>(getTime());
  const [countdown, setCountdown] = useState<number>(ROLL_SECONDS);
  const [offset, setOffset] = useState<number>(0);
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [modal, setModal] = useState<ModalType>("instructions");
  const [rotating, setRotating] = useState<boolean>(true);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [latestEntry, setLatestEntry] = useState<number | null>(null);

  const rotatingRef = useRef<boolean>();
  rotatingRef.current = rotating;

  const screenRef = useRef<number>();
  screenRef.current = currentScreen;

  const refreshWindow = () => {
    location.reload();
  };

  const updateCameras = () =>
    api()
      .get("/camera")
      .then((res) => {
        setCameras(res.data as Camera[]);
        setOffset(0);
      });

  // Update cameras every 5 seconds
  useEffect(() => {
    updateCameras();
    const id = setInterval(() => {
      updateCameras();
    }, 5000);

    return () => clearInterval(id);
  }, []);

  // Configure all the screens (gates, cameras, external)
  const screens: ScreenType[] = useMemo(() => {
    let screens: ScreenType[] = [];

    for (const gate of gates) {
      screens.push({
        number: screens.length + 1,
        type: "gate",
        title: gate.name,
        gateId: gate.id,
        gateCameraGeneral: gate.cameraGeneral,
        gateCameraALPR: gate.cameraALPR,
      });
    }

    let cameraIds = cameras.filter((x) => x.isVisible).map((x) => x.id);

    for (let i = 0; i < cameraIds.length % 4; i++) {
      cameraIds.push(cameraIds[Math.min(cameraIds.length, i)]);
    }

    for (let i = 0; i < cameraIds.length; i += 4) {
      screens.push({
        number: screens.length + 1,
        type: "cameras",
        title: t("cameras", "Cameras"),
        cameraIds: cameraIds.slice(i, i + 4),
      });
    }

    if (config.screen1) {
      screens.push({
        number: screens.length + 1,
        type: "external",
        title: config.screen1.name,
        lastFetch: config.screen1.lastFetch,
        screenNumber: 1,
      });
    }
    if (config.screen2) {
      screens.push({
        number: screens.length + 1,
        type: "external",
        title: config.screen2.name,
        lastFetch: config.screen2.lastFetch,
        screenNumber: 2,
      });
    }

    console.log(screens);
    return screens;
  }, [cameras.length]);

  useEffect(() => {
    if (router.query?.gate) {
      const screen = screens.find(
        (s) => s.gateId === parseInt(router.query?.gate as string)
      );
      if (screen) {
        setCurrentScreen(screen.number);
        setRotating(false);
      }
    }
    if (router.query?.screen) {
      setCurrentScreen(parseInt(router.query?.screen as string) ?? 1);
      setRotating(false);
    }
  }, [router, screens.length]);

  // Set up clock interval.
  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTime());
      setOffset(offset + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [time, offset]);

  // Set up clock interval.
  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTime());
      setOffset(offset + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [time, offset]);

  // Set up the interval.
  useEffect(() => {
    const id = setInterval(() => {
      if (rotating) {
        if (countdown <= 1) {
          setCountdown(ROLL_SECONDS);
          setCurrentScreen((currentScreen % screens.length) + 1);
        } else {
          setCountdown(countdown - 1);
        }
      }
    }, 1000);

    return () => clearInterval(id);
  }, [rotating, countdown, currentScreen, screens]);

  // Handle all keyboard input
  useEffect(() => {
    function handleKeyDown(e: any) {
      console.log(e.keyCode);

      if (modal === "instructions" && e.keyCode === 13) {
        setModal("none");
        return;
      }

      // Refresh window with [/]
      if (e.keyCode == 111) {
        refreshWindow();
        return;
      }

      // Toggle rotating mode with [*]
      if (e.keyCode == 106) {
        setRotating(!rotating);
        setCountdown(ROLL_SECONDS);
        return;
      }

      // Open gate modal with [+]
      if (e.keyCode == 107 && screens[currentScreen - 1].type === "gate") {
        setRotating(false);
        setCountdown(ROLL_SECONDS);
        setModal("gate-open");
        return;
      }
      // Close gate modal with [-]
      if (e.keyCode == 109 && screens[currentScreen - 1].type === "gate") {
        setRotating(false);
        setCountdown(ROLL_SECONDS);
        setModal("gate-close");
        return;
      }
      // Close gate modal with [.]
      if (e.keyCode == 110) {
        setModal("none");
        return;
      }
      // Open gate
      if (e.keyCode == 13 && modal === "gate-open") {
        api().post(`/gate/${screens[currentScreen - 1].gateId}/command`, {
          command: "open",
        });
        setModal("none");
        return;
      }
      // Close gate
      if (e.keyCode == 13 && modal === "gate-close") {
        api().post(`/gate/${screens[currentScreen - 1].gateId}/command`, {
          command: "close",
        });
        setModal("none");
        return;
      }

      if (e.keyCode >= 97 && e.keyCode < 97 + Math.min(screens.length, 9)) {
        setCountdown(ROLL_SECONDS);
        setCurrentScreen(e.keyCode - 96);
      }
      if (e.keyCode >= 49 && e.keyCode < 49 + Math.min(screens.length, 9)) {
        setCountdown(ROLL_SECONDS);
        setCurrentScreen(e.keyCode - 48);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentScreen, screens, modal, rotating]);

  useEffect(() => {
    if (((session?.data?.token as string) ?? "").length < 1) {
      return;
    }
    const ws = WebsocketsClient(session?.data?.token as string);

    ws.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);

      if (data["type"] === "entry") {
        const screen = screens.find((s) => s.gateId === data["gate_id"]);
        console.log(rotatingRef.current, screen?.number, screenRef.current);

        if (
          screen &&
          (rotatingRef.current || screen?.number === screenRef.current)
        ) {
          console.log(screen, rotatingRef.current);
          setCurrentScreen(screen.number);
          setCountdown(ROLL_SECONDS);
          setLatestEntry(data["log_id"]);
        }
      }
    });
  }, [screens.length]);

  const screen = screens[currentScreen - 1];

  return (
    <Container>
      <Head>
        <title>Live View - Gatekeeper</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <TopLine>
        <TopLineHalf>
          <h1>{currentScreen}</h1>
          <h1>{screen?.title}</h1>
        </TopLineHalf>
        <TopLineHalf align={"center"}>
          <h2>
            {rotating
              ? `${t("rolling-screen", "Rotating")} (${countdown})`
              : t("fixed-screen", "Fixed")}
          </h2>
        </TopLineHalf>
        <TopLineHalf align={"center"}>
          <h1>{time}</h1>
        </TopLineHalf>
        <TopLineHalf align={"center"}>
          <h2>{config?.siteName}</h2>
        </TopLineHalf>
        <TopLineHalf align={"right"}>
          <img src="/logo_white.svg" />
        </TopLineHalf>
      </TopLine>
      {screen?.type === "gate" && (
        <LiveGateScreen
          screen={screen}
          latestEntry={latestEntry}
          cameras={cameras}
          offset={offset}
        />
      )}
      {screen?.type === "cameras" && (
        <LiveCameraScreen screen={screen} cameras={cameras} offset={offset} />
      )}
      {screen?.type === "external" && <LiveExternalScreen screen={screen} />}
      {modal === "gate-open" && (
        <Modal>
          <h1>{t("confirm-action", "Confirm action")}</h1>
          <h2>
            {t("confirm-open", "Press [ENTER] to open gate or [.] to cancel")}
          </h2>
        </Modal>
      )}
      {modal === "gate-close" && (
        <Modal>
          <h1>{t("confirm-action", "Confirm action")}</h1>
          <h2>
            {t("confirm-close", "Press [ENTER] to close gate or [.] to cancel")}
          </h2>
        </Modal>
      )}
      {modal === "instructions" && (
        <InstructionsModal close={() => setModal("none")} />
      )}
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data: gates }: { data: Camera[] } = await api(context).get("/gate", {
    params: context.query,
  });

  const { data: config }: { data: Config } = await api(context).get("/config", {
    params: context.query,
  });

  return {
    props: {
      gates,
      config,
    },
  };
};

export default Monitor;
