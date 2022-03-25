import React, { useEffect, useMemo, useState } from "react";
import {
  Status,
  HistoryBox,
  MainColumn,
  Reading,
  ReadingColumn,
  SideBox,
  SideColumn,
  SideImage,
  Container,
  Image,
} from "./LiveScreen.style";
import { ScreenType } from "./types";
import api from "../../api";
import moment from "moment";
import { Camera, LogEntry, LogEntryDetails } from "../../types";
import { useTranslation } from "react-i18next";

interface LiveGateScreenProps {
  screen: ScreenType;
  cameras: Camera[];
  offset: number;
  latestEntry: number | null;
}

export const LiveGateScreen = ({
  screen,
  cameras,
  offset,
  latestEntry,
}: LiveGateScreenProps) => {
  const { t } = useTranslation();

  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [entry, setEntry] = useState<LogEntryDetails | null>(null);

  const cameraGeneral = useMemo(
    () => cameras.find((c) => c.id === screen.gateCameraGeneral),
    [screen, cameras]
  );
  const cameraALPR = useMemo(
    () => cameras.find((c) => c.id === screen.gateCameraALPR),
    [screen, cameras]
  );

  const updateLog = () => {
    api()
      .get(`/log?gate=${screen.gateId}&show_failed=true`)
      .then((res) => setLogEntries(res.data));
  };

  const formatCode = (entry: LogEntryDetails | LogEntry) => {
    return entry.type === "plate"
      ? entry.code
      : !!entry.typeLabel
      ? entry.typeLabel
      : t(entry.type);
  };

  const formatTimeAgo = (time: string) => {
    const diff = moment().unix() - moment(time).unix();

    if (diff > 24 * 60 * 60) {
      return `${Math.floor(diff / (24 * 60 * 60))}d`;
    } else if (diff > 60 * 60) {
      return `${Math.floor(diff / (60 * 60))}h`;
    } else if (diff > 60) {
      return `${Math.floor(diff / 60)}m`;
    } else {
      return `${diff}s`;
    }
  };

  useEffect(() => updateLog(), [screen.gateId, latestEntry]);
  useEffect(() => {
    if (logEntries.length > 0) {
      api()
        .get(`/log/${logEntries[0].id}`)
        .then((res) => setEntry(res.data));
    }
  }, [logEntries]);

  return (
    <Container>
      <MainColumn>
        <Image
          src={`/data/camera_${cameraGeneral?.id}/live/${
            parseInt(cameraGeneral?.latestImage ?? "") + offset - 1
          }.jpg`}
        />
      </MainColumn>
      <SideColumn>
        <SideImage>
          <Image
            src={`/data/camera_${cameraALPR?.id}/live/${
              parseInt(cameraALPR?.latestImage ?? "") + offset - 1
            }.jpg`}
          />
        </SideImage>
        <Status>{!!entry && formatCode(entry)?.toUpperCase()}</Status>
        <Reading>
          <ReadingColumn
            style={{
              background: !!entry ? (entry.result ? "green" : "#922") : "#555",
            }}
          >
            {!!entry && t(entry?.reason).toUpperCase()}
          </ReadingColumn>
        </Reading>
        <SideBox>
          <div style={{ textAlign: "center", marginTop: "4vh", color: "#bbb" }}>
            {t("no-metadata", "No metadata")}
          </div>
        </SideBox>
        <HistoryBox>
          {" "}
          <table style={{ width: "100%" }}>
            {logEntries.slice(0, 5).map((entry, i) => (
              <tr key={i}>
                <td width="33%">{entry.user}</td>
                <td width="33%">{formatCode(entry)}</td>
                <td width="33%" style={{ textAlign: "right" }}>
                  {formatTimeAgo(entry.timestamp)}
                </td>
              </tr>
            ))}
          </table>
        </HistoryBox>
      </SideColumn>
    </Container>
  );
};
