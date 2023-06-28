export type MethodType =
  | "web"
  | "keypad"
  | "keypad-pin"
  | "keypad-card"
  | "keypad-both"
  | "plate"
  | "button-1"
  | "button-2"
  | "button-3"
  | "any";

export interface Gate {
  id: number;
  name: string;
  supportsOpen: boolean;
  supportsClose: boolean;
  latestImage: string;
  cameraGeneral: number;
  cameraALPR: number;
  controllerStatus: "online" | "offline";
  cameraStatus: "online" | "offline" | "not-setup";
  buttonStatus: "disabled" | "enabled" | "timer";
  indicators: Array<"sensor_fault">;
}

export interface GateDetails {
  id: number;
  name: string;
  supportsOpen: boolean;
  supportsClose: boolean;
  controllerStatus: Gate["controllerStatus"];
  cameraStatus: Gate["cameraStatus"];
  buttonStatus: Gate["buttonStatus"];
  indicators: Array<"sensor_fault">;
  latestImage: string;
  latestImageAlpr?: string;
  cameraGeneral: number;
  cameraAlpr?: number;
  buttonTime: {
    startHour: string;
    endHour: string;
  };
  settings: GateSettings;
  logs: LogEntry[];
}

export interface GateSettings {
  name: string;
  type: "generic" | "gatekeeper";
  controllerIP?: string;
  uriOpen?: string;
  uriClose?: string;
  httpTrigger?: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  language: string;
  admin: boolean;
  webAccess: boolean;
  enabled: boolean;
}

export interface UserSettings {
  confirm_modal: boolean;
  email: string;
  is_admin: boolean;
  language: "is" | "en";
  name: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  gate: string;
  type: MethodType;
  typeLabel: string;
  code: string | null;
  operation: string;
  result: boolean;
  reason: string;
  image?: string;
  alprImage?: string;
  cameraGeneral?: number;
  cameraAlpr?: number;
  methodComment?: string;
}

export interface LogEntryDetails {
  id: number;
  timestamp: string;
  user: string;
  gate: string;
  gateId: number;
  type: MethodType;
  typeLabel: string;
  code: string | null;
  operation: string;
  result: boolean;
  reason: string;
  image: string;
  firstImage: string;
  lastImage: string;
  alprImage?: string;
  cameraGeneral: number;
  cameraAlpr?: number;
  method?: {
    startDate?: string;
    endDate?: string;
    comment?: string;
    data?: any;
  };
}

export interface CodeType {
  pin?: string | null;
  card?: string | null;
  plate?: string | null;
}

export interface AccessMethod {
  id: number;
  type: MethodType;
  allGates: boolean;
  gateId: number;
  gate: string;
  code: string | null;
  comment: string;
  lastUsage: string;
  startDate: string;
  endDate: string;
  startHour: string;
  endHour: string;
  enabled: boolean;
}

export interface UserDetails {
  user: User;
  methods: AccessMethod[];
  logs: LogEntry[];
}

export interface Alert {
  id: number;
  name: string;
  gate: string;
  gateId: number | null;
  user: string;
  userId: number | null;
  type: MethodType;
  code: string | null;
  timeLimits: boolean;
  startHour: string;
  endHour: string;
  failedAttempts: boolean;
  enabled: boolean;
}

export interface CameraStatus {
  alive: boolean;
  cpuUsage: number;
  diskUsage: number;
  gate: string;
  memoryUsage: number;
  pid: number;
  snapshotCount: number;
  timestamp: string;
  uptime: number;
}

export interface ControllerStatus {
  alive: boolean;
  gate: string;
  ipAddress: string;
  timestamp: string;
  type: string;
  uptime: number;
  detectorTime: number;
  freeMemory: number;
}

export interface Status {
  controllers: ControllerStatus[];
  streams: CameraStatus[];
}

export interface Camera {
  id: number;
  name: string;
  latestImage: string;
  isAlive: boolean;
  isVisible: boolean;
  cpuPercent: number;
  ipAddress: string;
}

export interface Screen {
  lastFetch: string;
  name: string;
}

export interface Config {
  siteName?: string;
  screen1: Screen | null;
  screen2: Screen | null;
}
