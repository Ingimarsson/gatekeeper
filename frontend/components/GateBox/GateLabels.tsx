import { Icon, Label, SemanticCOLORS } from "semantic-ui-react";
import { Gate } from "../../types";
import React from "react";

const statusColors = {
  online: "green" as SemanticCOLORS,
  "not-setup": undefined,
  offline: "red" as SemanticCOLORS,
};

const statusLabels = {
  online: "Online",
  "not-setup": "Not Setup",
  offline: "Offline",
};

const buttonLabels = {
  enabled: "Always Enabled",
  disabled: "Always Disabled",
  timer: "Time Controlled",
};

export const ControllerLabel = ({
  status,
}: {
  status: Gate["controllerStatus"];
}) => (
  <span title="Controller Status">
    <Label size="tiny" color={statusColors[status]}>
      <Icon name="hdd" />
      {statusLabels[status]}
    </Label>
  </span>
);

export const CameraLabel = ({ status }: { status: Gate["cameraStatus"] }) => (
  <span title="Camera Status">
    <Label size="tiny" color={statusColors[status]}>
      <Icon name="camera" />
      {statusLabels[status]}
    </Label>
  </span>
);

export const ButtonLabel = ({ status }: { status: Gate["buttonStatus"] }) => (
  <span title="Button Status">
    <Label size="tiny">
      <Icon name="hand point right" />
      {buttonLabels[status]}
    </Label>
  </span>
);
