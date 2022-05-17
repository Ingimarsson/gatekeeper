import { Button, Header, Icon } from "semantic-ui-react";
import React, { useState, useEffect } from "react";
import {
  Box,
  ButtonRow,
  ControlsBox,
  ControlsColumn,
  GridContainer,
  LiveStreamBox,
  Logo,
  ReverseButtonRow,
  StreamColumn,
  TopControlsBox,
} from "./GateBox.style";
import Link from "next/link";
import { Gate } from "../../types";
import { ConfirmActionModal } from "../modals";
import { ButtonLabel, CameraLabel, ControllerLabel } from "./GateLabels";
import api from "../../api";
import { useTranslation } from "react-i18next";

interface GateBoxProps {
  gate: Gate;
  confirmModal?: boolean;
}

export const GateBox = ({ gate, confirmModal = true }: GateBoxProps) => {
  const { t } = useTranslation();

  const [action, setAction] = useState<string>("");
  const [lastTime, setLastTime] = useState<number>(
    parseInt(gate.latestImage.split(".")[0]) - 1
  );

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

  useEffect(
    () => setLastTime(parseInt(gate.latestImage.split(".")[0]) - 1),
    [gate]
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setLastTime(lastTime + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [lastTime]);

  return (
    <Box>
      <ConfirmActionModal
        action={() => execute(action)}
        close={() => setAction("")}
        isOpen={action !== ""}
      />
      <GridContainer>
        <StreamColumn>
          <Link href={`/gates/${gate.id}`} passHref={true}>
            <a>
              <LiveStreamBox>
                {gate.cameraStatus === "online" ? (
                  <img
                    src={`/data/camera_${gate.cameraGeneral}/live/${lastTime}.jpg`}
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Logo src="/logo_white.svg" />
                )}
              </LiveStreamBox>
            </a>
          </Link>
        </StreamColumn>
        <ControlsColumn>
          <ControlsBox>
            <TopControlsBox>
              <Link href={`/gates/${gate.id}`} passHref={true}>
                <a
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    display: "block",
                  }}
                >
                  <Header as="h3">{gate.name}</Header>
                </a>
              </Link>
              <ButtonRow>
                <ControllerLabel status={gate.controllerStatus} />
                <CameraLabel status={gate.cameraStatus} />
              </ButtonRow>
              <ButtonRow>
                <ButtonLabel status={gate.buttonStatus} />
              </ButtonRow>
            </TopControlsBox>
            <ReverseButtonRow>
              {gate.supportsOpen && (
                <Button
                  size="tiny"
                  icon
                  labelPosition="left"
                  color="green"
                  onClick={() =>
                    confirmModal ? setAction("open") : execute("open")
                  }
                >
                  <Icon name="unlock" />
                  {t("open", "Open")}
                </Button>
              )}
              {gate.supportsClose && (
                <Button
                  size="tiny"
                  icon
                  labelPosition="left"
                  onClick={() =>
                    confirmModal ? setAction("close") : execute("open")
                  }
                >
                  <Icon name="lock" />
                  {t("close", "Close")}
                </Button>
              )}
            </ReverseButtonRow>
          </ControlsBox>
        </ControlsColumn>
      </GridContainer>
    </Box>
  );
};
