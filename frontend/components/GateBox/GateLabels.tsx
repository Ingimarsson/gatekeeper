import { Icon, Label, SemanticCOLORS } from "semantic-ui-react";
import { Gate } from "../../types";
import React from "react";
import { useTranslation } from "react-i18next";

const statusColors = {
  online: "green" as SemanticCOLORS,
  "not-setup": undefined,
  offline: "red" as SemanticCOLORS,
};

const statusLabels = {
  online: "online",
  "not-setup": "not-setup",
  offline: "offline",
};

const buttonLabels = {
  enabled: "always-enabled",
  disabled: "always-disabled",
  timer: "time-controlled",
};

const indicatorColors = {
  sensor_fault: "orange" as SemanticCOLORS,
};

export const ControllerLabel = ({
  status,
}: {
  status: Gate["controllerStatus"];
}) => {
  const { t } = useTranslation();
  return (
    <span title={t("controller-status", "Controller Status")}>
      <Label size="tiny" color={statusColors[status]}>
        <Icon name="hdd" />
        {t(statusLabels[status])}
      </Label>
    </span>
  );
};

export const CameraLabel = ({ status }: { status: Gate["cameraStatus"] }) => {
  const { t } = useTranslation();
  return (
    <span title={t("camera-status", "Controller status")}>
      <Label size="tiny" color={statusColors[status]}>
        <Icon name="camera" />
        {t(statusLabels[status])}
      </Label>
    </span>
  );
};

export const ButtonLabel = ({ status }: { status: Gate["buttonStatus"] }) => {
  const { t } = useTranslation();
  return (
    <span title={t("button-status", "Button Status")}>
      <Label size="tiny">
        <Icon name="hand point right" />
        {t(buttonLabels[status])}
      </Label>
    </span>
  );
};

export const IndicatorLabel = ({
  indicator,
}: {
  indicator: Gate["indicators"][0];
}) => {
  const { t } = useTranslation();
  return (
    <span title={t("indicator", "Indicator")}>
      <Label size="tiny" color={indicatorColors[indicator]}>
        <Icon name="warning circle" />
        {t(indicator)}
      </Label>
    </span>
  );
};
