type MethodType =
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
  supportsClose: boolean;
  latestImage: string;
  controllerStatus: "online" | "offline";
  cameraStatus: "online" | "offline" | "not-setup";
  buttonStatus: "disabled" | "enabled" | "timer";
}

export interface GateDetails {
  id: number;
  name: string;
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
  openUrl?: string;
  closeUrl?: string;
  cameraEnabled: boolean;
  cameraUrl: string;
  dvrTriggerUrl?: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
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
  code: CodeType;
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
  code: CodeType;
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
  type: string;
  typeName: string;
  allGates: boolean;
  gate: number;
  gateName: string;
  code: CodeType;
  comment: string;
  lastUsage: string;
  timeLimits: {
    startDate: string;
    endDate: string;
    startHour: string;
    endHour: string;
  };
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
  method: MethodType;
  code: string;
  timeLimits: boolean;
  startHour: string;
  endHour: string;
  failedAttempts: boolean;
  enabled: boolean;
}
