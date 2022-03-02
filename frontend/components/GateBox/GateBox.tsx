import { Button, Header, Icon } from "semantic-ui-react";
import React, { useState } from "react";
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

interface GateBoxProps {
  gate: Gate;
}

export const GateBox = ({ gate }: { gate: Gate }) => {
  const [action, setAction] = useState<string>("");

  const execute = (action: string) => {
    setAction("");
  };

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
                <Logo src="/logo_white.svg" />
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
              <Button
                size="tiny"
                icon
                labelPosition="left"
                color="green"
                onClick={() => setAction("open")}
              >
                <Icon name="unlock" />
                Open
              </Button>
              {gate.supportsClose && (
                <Button
                  size="tiny"
                  icon
                  labelPosition="left"
                  onClick={() => setAction("close")}
                >
                  <Icon name="lock" />
                  Close
                </Button>
              )}
            </ReverseButtonRow>
          </ControlsBox>
        </ControlsColumn>
      </GridContainer>
    </Box>
  );
};
