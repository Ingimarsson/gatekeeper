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
  controllerStatus: "online" | "offline";
  cameraStatus: "online" | "offline" | "not-setup";
  buttonStatus: "disabled" | "enabled" | "timer";
}

export interface GateDetails {
  id: number;
  name: string;
  supportsOpen: boolean;
  supportsClose: boolean;
  controllerStatus: Gate["controllerStatus"];
  cameraStatus: Gate["cameraStatus"];
  buttonStatus: Gate["buttonStatus"];
  latestImage: string;
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
  cameraUri: string;
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
  image: string;
  firstImage: string;
  lastImage: string;
}

export interface CodeType {
  pin?: string;
  card?: string;
  plate?: string;
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
}

export interface Status {
  controllers: ControllerStatus[];
  streams: CameraStatus[];
}
