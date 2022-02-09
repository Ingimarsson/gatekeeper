import "semantic-ui-css/semantic.min.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { startMocks } from "../mocks";

if (process.env.NEXT_MOCKING === "enabled") {
  console.log("enabling mocking");
  startMocks();
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
