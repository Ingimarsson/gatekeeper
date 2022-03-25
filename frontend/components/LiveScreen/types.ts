export interface ScreenType {
  number: number;
  type: "gate" | "cameras" | "external";
  title: string;
  gateId?: number;
  gateCameraGeneral?: number;
  gateCameraALPR?: number;
  cameraIds?: number[];
  lastFetch?: string;
  screenNumber?: number;
}
