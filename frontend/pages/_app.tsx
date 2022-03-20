import "semantic-ui-css/semantic.min.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { startMocks } from "../mocks";
import { SessionProvider } from "next-auth/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

if (process.env.NEXT_MOCKING === "enabled") {
  console.log("enabling mocking");
  startMocks();
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session} basePath="/auth">
      <I18nextProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nextProvider>
    </SessionProvider>
  );
}

export default MyApp;
