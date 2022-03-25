import React, { useEffect, useState } from "react";
import { ScreenType } from "./types";
import api from "../../api";
import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";

interface LiveExternalScreenProps {
  screen: ScreenType;
}

const Container = styled.div`
  position: relative;
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
  const [lastFetch, setLastFetch] = useState<string>("");

  const updateScreen = () => {
    api()
      .get(`/config/screen/${screen.screenNumber}`)
      .then((res) => {
        setBody(res.data.body);
        setLastFetch(res.data.lastFetch);
      });
    return;
  };

  useEffect(() => updateScreen(), []);

  // Set up interval.
  useEffect(() => {
    const id = setInterval(() => updateScreen(), 2 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Container>
      {screen.screenNumber}
      <iframe
        srcDoc={body}
        style={{
          width: "100vw",
          height: "100vh",
          paddingTop: "8vh",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
        frameBorder={0}
      />
      <Label>
        {t("last-update", "Last update")}: {moment(lastFetch).format("HH:mm")}
      </Label>
    </Container>
  );
};
