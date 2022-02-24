import { rest } from "msw";

export const handlers = [
  rest.get("*/api/gates", (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: "Front Entrance",
          supportsClose: true,
          controllerStatus: "online",
          cameraStatus: "online",
        },
        {
          id: 2,
          name: "Side Entrance",
          supportsClose: false,
          controllerStatus: "offline",
          cameraStatus: "not-setup",
        },
        {
          id: 3,
          name: "Parking Barrier",
          supportsClose: true,
          controllerStatus: "online",
          cameraStatus: "online",
        },
      ])
    )
  ),
  rest.get("*/api/users", (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: "Harrison Ford",
          username: "harrison",
          email: "harrison@example.com",
          admin: true,
          webAccess: true,
          enabled: true,
        },
        {
          id: 2,
          name: "Kenau Reeves",
          username: "kenau",
          email: "kenau@example.com",
          admin: false,
          webAccess: false,
          enabled: false,
        },
      ])
    )
  ),
  rest.get("*/api/logs", (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json([
        {
          id: 2,
          timestamp: "2022-01-21 11:21:31.933123",
          user: "Harrison Ford",
          gate: "Parking Barrier",
          method: "Licence Plate",
          code: {
            plate: "UV838",
          },
          operation: "Open",
          granted: true,
        },
        {
          id: 1,
          timestamp: "2022-01-20 14:42:39.933123",
          user: "Harrison Ford",
          gate: "Main Entrance",
          method: "Keypad",
          code: {
            pin: "1234",
          },
          operation: "Close",
          granted: true,
        },
      ])
    )
  ),
  rest.get("*/api/gates/*", (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        id: 1,
        name: "Front Entrance",
        supportsClose: true,
        latestImage: "2022-01-21 11:21:31.933123",
        settings: {
          name: "Front Entrance",
          type: "gatekeeper",
          controllerIP: "192.168.12.145",
          cameraEnabled: true,
          cameraUrl: "rtsp://192.168.10.145:4455/stream",
          dvrTriggerUrl: "http://blueiris.local/camera/1/trigger",
        },
        history: [
          {
            id: 2,
            timestamp: "2022-01-21 11:21:31.933123",
            user: "Harrison Ford",
            gate: "Parking Barrier",
            method: "Licence Plate",
            code: {
              plate: "UV838",
            },
            operation: "Open",
            granted: true,
          },
        ],
      })
    )
  ),
  rest.get("*/api/users/*", (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        user: {
          id: 1,
          name: "Harrison Ford",
          username: "harrison",
          email: "harrison@example.com",
          admin: true,
          webAccess: true,
          enabled: true,
        },
        methods: [
          {
            id: 1,
            type: "keypad-pin",
            typeName: "Keypad (PIN)",
            allGates: true,
            gate: 0,
            gateName: "All",
            code: {
              pin: "1234",
            },
            comment: "",
            lastUsage: "2022-01-21 11:21:31.933123",
            timeLimits: {
              startDate: "",
              endDate: "",
              startHour: "",
              endHour: "",
            },
            enabled: true,
          },
          {
            id: 2,
            type: "keypad-both",
            typeName: "Keypad (PIN and Card)",
            allGates: true,
            gate: 0,
            gateName: "All",
            code: {
              pin: "1234",
              card: "0024549388",
            },
            comment: "Test",
            lastUsage: "2022-01-21 11:21:31.933123",
            timeLimits: {
              startDate: "2022-01-10 12:00:00.000000",
              endDate: "2022-01-20 14:00:00.000000",
              startHour: "7:00",
              endHour: "18:00",
            },
            enabled: true,
          },
        ],
        history: [
          {
            id: 2,
            timestamp: "2022-01-21 11:21:31.933123",
            user: "Harrison Ford",
            gate: "Parking Barrier",
            method: "Licence Plate",
            code: {
              plate: "UV838",
            },
            operation: "Open",
            granted: true,
          },
        ],
      })
    )
  ),
  rest.get("*/api/logs/*", (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        id: 2,
        timestamp: "2022-01-21 11:21:31.933123",
        user: "Harrison Ford",
        gate: "Parking Barrier",
        method: "Licence Plate",
        code: {
          plate: "UV838",
        },
        operation: "Open",
        granted: true,
        firstImage: "2022-01-21 11:21:16.933123",
        lastImage: "2022-01-21 11:21:45.933123",
      })
    )
  ),
];
