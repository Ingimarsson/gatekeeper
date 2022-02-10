import "semantic-ui-css/semantic.min.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { startMocks } from "../mocks";
import { SessionProvider } from "next-auth/react";

if (process.env.NEXT_MOCKING === "enabled") {
  console.log("enabling mocking");
  startMocks();
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
