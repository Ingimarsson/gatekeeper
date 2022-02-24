import {
  Button,
  Grid,
  Header,
  Icon,
  Label,
  SemanticCOLORS,
} from "semantic-ui-react";
import React, { useState } from "react";
import {
  Box,
  ButtonRow,
  ControlsBox,
  LiveStreamBox,
  Logo,
  ReverseButtonRow,
  TopControlsBox,
} from "./GateBox.style";
import Link from "next/link";
import { Gate } from "../../types";
import { ConfirmActionModal } from "../modals";

interface GateBoxProps {
  gate: Gate;
}

const labelColors = {
  online: "green" as SemanticCOLORS,
  "not-setup": "grey" as SemanticCOLORS,
  offline: "red" as SemanticCOLORS,
};

const labelTitles = {
  online: "Online",
  "not-setup": "Not Setup",
  offline: "Offline",
};

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
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={16} computer={8}>
            <Link href={`/gates/${gate.id}`} passHref={true}>
              <a>
                <LiveStreamBox>
                  <Logo src="/logo_white.svg" />
                </LiveStreamBox>
              </a>
            </Link>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={8}>
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
                  <Label color={labelColors[gate.controllerStatus]} size="tiny">
                    <Icon name="hdd" title="Ok" />
                    {labelTitles[gate.controllerStatus]}
                  </Label>
                  <Label color={labelColors[gate.cameraStatus]} size="tiny">
                    <Icon name="camera" />
                    {labelTitles[gate.cameraStatus]}
                  </Label>
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
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Box>
  );
};
