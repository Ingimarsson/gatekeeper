import { setupWorker } from "msw";
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const startMocks = () => {
  if (typeof window === "undefined") {
    const server = setupServer(...handlers);
    server.listen();
  } else {
    const worker = setupWorker(...handlers);
    worker.start();
  }
};
