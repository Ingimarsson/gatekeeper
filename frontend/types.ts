import { AddGateData } from "./components/modals/AddGateModal";

export interface Gate {
  id: number;
  name: string;
  supportsClose: boolean;
  latestImage: string;
  controllerStatus: "online" | "offline";
  cameraStatus: "online" | "offline" | "not-setup";
}

export interface GateDetails {
  id: number;
  name: string;
  supportsClose: boolean;
  latestImage: string;
  settings: AddGateData;
  history: LogEntry[];
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
  method: string;
  code: CodeType;
  operation: string;
  granted: boolean;
}

export interface LogEntryDetails {
  id: number;
  timestamp: string;
  user: string;
  gate: string;
  method: string;
  code: CodeType;
  operation: string;
  granted: boolean;
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
  history: LogEntry[];
}
