import type { NextPage } from "next";
import { Button, Checkbox, Input } from "semantic-ui-react";
import { Layout, LogEntryTable } from "../../components";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { LogEntry, User } from "../../types";
import api from "../../api";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import WebsocketsClient from "../../websockets";

interface LogsProps {
  entries: LogEntry[];
}

const Logs: NextPage<LogsProps> = ({ entries }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const session = useSession();

  const [query, setQuery] = useState<string>(
    (router.query?.search ?? "") as string
  );
  const [searchInput, setSearchInput] = useState<string>(
    (router.query?.search ?? "") as string
  );
  const [limit, setLimit] = useState<number>(
    parseInt((router.query?.limit ?? "50") as string)
  );
  const [showFailed, setShowFailed] = useState<boolean>(
    router.query?.show_failed === "true"
  );

  useEffect(() => {
    setSearchInput((router.query?.search ?? "") as string);
    setLimit(parseInt((router.query?.limit ?? "50") as string));
    setShowFailed(router.query?.show_failed === "true");
  }, [router]);

  useEffect(() => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...(!!router.query?.gate && {
            gate: router.query?.gate,
          }),
          ...(!!router.query?.user && {
            user: router.query?.user,
          }),
          ...(!!router.query?.type && {
            type: router.query?.type,
          }),
          ...(limit != 50 && { limit }),
          ...(query != "" && { search: query }),
          ...(showFailed && { show_failed: showFailed }),
        },
      },
      undefined,
      { scroll: false }
    );
  }, [query, limit, showFailed]);

  const refreshWindow = () =>
    router.push(router.asPath, undefined, {
      scroll: false,
    });

  useEffect(() => {
    if (((session?.data?.token as string) ?? "").length < 1) {
      return;
    }
    const ws = WebsocketsClient(session?.data?.token as string);

    ws.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);

      if (data["type"] === "entry") {
        refreshWindow();
      }
    });

    return () => ws.close();
  }, [session?.data?.token, router.query]);

  return (
    <Layout
      title={t("access-log", "Access Log")}
      segmented={false}
      buttons={
        <>
          <Checkbox
            label={t("show-failed", "Show failed attempts")}
            style={{ marginRight: 20 }}
            checked={showFailed}
            onChange={(e: any, d: { checked?: boolean | undefined }) =>
              setShowFailed(d.checked ?? false)
            }
          />
          <Input
            style={{ height: "32px" }}
            type="text"
            placeholder={t("search", "Search") + "..."}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            action
          >
            <input style={{ fontSize: "12px" }} />
            <Button
              size="tiny"
              onClick={() => setQuery(searchInput)}
              type="submit"
            >
              {t("search", "Search")}
            </Button>
          </Input>
        </>
      }
    >
      <Head>
        <title>{t("access-log", "Access Log")} - Gatekeeper</title>
      </Head>
      <LogEntryTable entries={entries} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          color="blue"
          onClick={() => setLimit(limit + 50)}
          disabled={entries.length < limit}
        >
          {t("see-more", "See More")}
        </Button>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data: response }: { data: User[] } = await api(context).get("/log", {
    params: context.query,
  });

  return {
    props: {
      entries: response,
    },
  };
};

export default Logs;
