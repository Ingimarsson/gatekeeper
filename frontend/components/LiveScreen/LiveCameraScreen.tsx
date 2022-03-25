import React from "react";
import { Camera } from "../../types";
import {
  CameraCell,
  CameraColumn,
  CameraLabel,
  Image,
} from "./LiveScreen.style";
import { ScreenType } from "./types";

interface LiveCameraScreenProps {
  screen: ScreenType;
  cameras: Camera[];
  offset: number;
}

export const LiveCameraScreen = ({
  screen,
  cameras,
  offset = 0,
}: LiveCameraScreenProps) => {
  const currentCameras = (screen.cameraIds ?? []).map((id) =>
    cameras.find((camera) => camera.id === id)
  );

  return (
    <>
      <CameraColumn>
        <CameraCell>
          <CameraLabel>{currentCameras[0]?.name}</CameraLabel>
          <Image
            src={`/data/camera_${currentCameras[0]?.id}/live/${
              parseInt(currentCameras[0]?.latestImage ?? "") + offset - 1
            }.jpg`}
          />
        </CameraCell>
        <CameraCell>
          <CameraLabel>{currentCameras[1]?.name}</CameraLabel>
          <Image
            src={`/data/camera_${currentCameras[1]?.id}/live/${
              parseInt(currentCameras[1]?.latestImage ?? "") + offset - 1
            }.jpg`}
          />
        </CameraCell>
      </CameraColumn>
      <CameraColumn>
        <CameraCell>
          <CameraLabel>{currentCameras[2]?.name}</CameraLabel>
          <Image
            src={`/data/camera_${currentCameras[2]?.id}/live/${
              parseInt(currentCameras[2]?.latestImage ?? "") + offset - 1
            }.jpg`}
          />
        </CameraCell>
        <CameraCell>
          <CameraLabel>{currentCameras[3]?.name}</CameraLabel>
          <Image
            src={`/data/camera_${currentCameras[3]?.id}/live/${
              parseInt(currentCameras[3]?.latestImage ?? "") + offset - 1
            }.jpg`}
          />
        </CameraCell>
      </CameraColumn>
    </>
  );
};
