import React, { useEffect, useState } from "react";
import { ScreenType } from "./types";
import api from "../../api";
import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { CameraLabel } from "./LiveScreen.style";

interface LiveExternalScreenProps {
  screen: ScreenType;
}

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const Label = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 24px;
  padding: 10px;
`;

export const LiveExternalScreen = ({ screen }: LiveExternalScreenProps) => {
  const { t } = useTranslation();

  const [body, setBody] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [lastFetch, setLastFetch] = useState<string>("");

  const updateScreen = () => {
    api()
      .get(`/config/screen/${screen.screenNumber}`)
      .then((res) => {
        setBody(res.data.body);
        setUrl(res.data.url);
        setLastFetch(res.data.lastFetch);
      });
    return;
  };

  useEffect(() => updateScreen(), [screen]);

  // Set up interval.
  useEffect(() => {
    const id = setInterval(() => updateScreen(), 2 * 1000);
    return () => clearInterval(id);
  }, [screen]);

  return (
    <Container>
      <iframe
        src={url}
        scrolling="no"
        style={{
          width: "100vw",
          height: "100vh",
          paddingTop: "6vh",
          boxSizing: "border-box",
          pointerEvents: "none",
          overflowY: "hidden",
        }}
        frameBorder={0}
      />
      <CameraLabel style={{ right: 0, left: "unset" }}>
        {t("last-update", "Last update")}: {moment(lastFetch).format("HH:mm")}
      </CameraLabel>
    </Container>
  );
};
